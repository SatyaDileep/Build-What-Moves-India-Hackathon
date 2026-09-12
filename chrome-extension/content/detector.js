// DocBridge - Portal Detector
(function() {
  "use strict";

  var hostname = window.location.hostname;
  var pathname = window.location.pathname;
  var lastPortal = null;
  var lastUploads = null;

  // Popup primary CTA → open the panel on demand.
  try {
    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
      if (msg && msg.type === "DOCBRIDGE_OPEN_PANEL") {
        try {
          if (lastPortal && lastUploads) {
            injectNudge(lastPortal, lastUploads, false);
            // Nudge shows first; escalate to panel if user enabled assistive auto-open.
            sendResponse({ ok: true });
          } else {
            sendResponse({ ok: false, reason: "no-portal" });
          }
        } catch(e) { try { sendResponse({ ok: false }); } catch(err) {} }
        return true;
      }
    });
  } catch(e) {}

  // Check if user has dismissed this site
  var dismissedKey = "docbridge_dismissed_" + hostname;
  chrome.storage.local.get([dismissedKey, "docbridge_nudge_enabled", "docbridge_assist_mode"], function(data) {
    if (data[dismissedKey]) return;

    // Check nudge-enabled setting
    var settings = { "docbridge_nudge_enabled": data.docbridge_nudge_enabled, "docbridge_assist_mode": data.docbridge_assist_mode };
    if (settings.docbridge_nudge_enabled === false) return;

    // Assistive mode (elderly / needs-guidance): skip the passive banner and
    // auto-launch the DocBridge panel shortly after the page settles, the
    // same auto-nudge behavior the web app gives the elder persona.
    var assistive = settings.docbridge_assist_mode === "assistive" || settings.docbridge_assist_mode === true;

      var matchedPortal = null;
      var matchedUpload = null;

      // 1. Try to match against known portals. Domain match is authoritative;
      // urlPatterns are hints only — a path mismatch must NOT downgrade a known
      // gov domain to "Not Auto-Indexed" (e.g. EPFO /memberinterface/ claim pages).
      for (var i = 0; i < DOCBRIDGE_PORTALS.length; i++) {
        var portal = DOCBRIDGE_PORTALS[i];
        if (matchDomain(hostname, portal.domains)) {
          matchedPortal = portal;
          // Pass all uploads; nudge/panel will let user pick which type to process
          matchedUpload = portal.uploads;
          break;
        }
      }

      // 2. Check PDF portals (v2 notice)
      if (!matchedPortal) {
        for (var j = 0; j < DOCBRIDGE_PDF_PORTALS.length; j++) {
          var pdfPortal = DOCBRIDGE_PDF_PORTALS[j];
          if (matchDomain(hostname, pdfPortal.domains)) {
            // Show a subdued notice for PDF-only portals
            showPdfNotice(pdfPortal);
            return;
          }
        }
      }

      // 3. Scan DOM for file inputs on unknown gov sites
      if (!matchedPortal) {
        var hints = scanPageForUploads();
        if (hints.length > 0) {
          matchedPortal = {
            id: "unknown-gov-portal",
            name: hostname,
            uploads: hints.map(function(h) {
              return {
                type: "photo",
                hint: buildHintFromScan(h),
                constraint: buildConstraintFromScan(h)
              };
            })
          };
          matchedUpload = matchedPortal.uploads;
        }
      }

      if (matchedPortal && matchedUpload) {
        lastPortal = matchedPortal;
        lastUploads = matchedUpload;
        // Send detection result to background for badge update
        try {
          chrome.runtime.sendMessage({
            type: "PORTAL_DETECTED",
            portal: matchedPortal.id,
            portalName: matchedPortal.name
          });
        } catch(e) { /* ignore - background might not be ready */ }

        // No file input on this page (e.g. EPFO claim-status tracker)? Don't
        // pop a banner — badge + popup still let the user pre-prepare a file.
        // Arm the SPA observer so the nudge appears if an upload is added later.
        var hasUpload = null;
        try { hasUpload = document.querySelector('input[type="file"]'); } catch(e) {}
        if (!hasUpload) {
          try { armObserver(matchedPortal, matchedUpload, false); } catch(e) {}
          return;
        }

        if (assistive) {
          // Elderly assistive auto-nudge: open the panel automatically after
          // a short settle delay, mirroring the web app's assistive persona.
          setTimeout(function() {
            injectNudge(matchedPortal, matchedUpload, true);
          }, 1200);
        } else {
          injectNudge(matchedPortal, matchedUpload);
        }
      }
  });

  function scanPageForUploads() {
    var inputs = document.querySelectorAll('input[type="file"]');
    var hints = [];

    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var accept = input.accept || "";
      var label = "";
      var el = input.closest("label") || input.closest(".form-group") || input.parentElement;
      if (el) label = el.textContent || "";
      var text = (label + " " + accept).toLowerCase();

      // Check if it's an image upload
      var isImage = accept.indexOf("image") >= 0
        || accept.indexOf("jpeg") >= 0
        || accept.indexOf("jpg") >= 0
        || accept.indexOf(".jpg") >= 0
        || accept.indexOf(".jpeg") >= 0;

      if (isImage) {
        var sizeMatch = text.match(/(\d+)\s*(kb|mb)/i);
        var dimMatch = text.match(/(\d+)\s*[x\u00d7]\s*(\d+)/);

        hints.push({
          input: input,
          accept: accept,
          maxKB: sizeMatch ? parseInt(sizeMatch[1]) : null,
          dimensions: dimMatch ? { w: parseInt(dimMatch[1]), h: parseInt(dimMatch[2]) } : null,
          text: text.substring(0, 300)
        });
      }
    }
    return hints;
  }

  function buildHintFromScan(hint) {
    var parts = ["JPEG"];
    if (hint.dimensions) parts.push(hint.dimensions.w + "\u00d7" + hint.dimensions.h + "px");
    if (hint.maxKB) parts.push("<" + hint.maxKB + "KB");
    return parts.join(" \u00b7 ");
  }

  function buildConstraintFromScan(hint) {
    var constraint = { format: "jpeg", bg_color: "white" };
    if (hint.maxKB) constraint.max_kb = hint.maxKB;
    if (hint.dimensions) {
      constraint.width_px = hint.dimensions.w;
      constraint.height_px = hint.dimensions.h;
    }
    return constraint;
  }

  function showPdfNotice(portal) {
    if (document.getElementById("docbridge-nudge")) return;

    var nudge = document.createElement("div");
    nudge.id = "docbridge-nudge";
    nudge.innerHTML =
      '<div class="db-nudge-inner">' +
        '<div class="db-nudge-top">' +
          '<span class="db-nudge-shield">\u2724</span>' +
          '<span class="db-nudge-title">DocBridge supports <strong>' + portal.name + '</strong></span>' +
        '</div>' +
        '<div class="db-nudge-hint">' + portal.note + '</div>' +
        '<div class="db-nudge-actions">' +
          '<button id="db-nudge-dismiss" class="db-btn-ghost">Dismiss</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(nudge);

    document.getElementById("db-nudge-dismiss").onclick = function() {
      nudge.remove();
    };
  }

  function injectNudge(portal, uploads, autoOpen) {
    // Don't double-inject. All UI runs in the isolated content-script world
    // so chrome.* APIs stay available (MV3 production-safe, no page-script injection).
    if (document.getElementById("docbridge-nudge") || document.getElementById("docbridge-panel")) return;
    try {
      window.dispatchEvent(new CustomEvent("docbridge-nudge-init", {
        detail: { portal: portal, uploads: uploads, upload: uploads, autoOpen: !!autoOpen }
      }));
    } catch(e) {}
  }

  // SPA support: portals that inject file inputs after load. Debounced rescan
  // re-triggers the nudge once, never duplicates.
  var observed = false;
  function armObserver(portal, uploads, autoOpen) {
    if (observed) return;
    observed = true;
    var timer = null;
    try {
      var mo = new MutationObserver(function() {
        if (document.getElementById("docbridge-nudge") || document.getElementById("docbridge-panel")) return;
        if (timer) clearTimeout(timer);
        timer = setTimeout(function() {
          var hints = [];
          try { hints = scanPageForUploads(); } catch(e) {}
          if (hints.length > 0 && !document.getElementById("docbridge-nudge")) {
            injectNudge(portal, uploads, false);
          }
        }, 1200);
      });
      mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
      setTimeout(function() { try { mo.disconnect(); } catch(e) {} }, 120000);
    } catch(e) {}
  }
})();
