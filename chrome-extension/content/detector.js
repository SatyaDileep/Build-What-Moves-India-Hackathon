// DocBridge - Portal Detector
(function() {
  "use strict";

  var hostname = window.location.hostname;
  var pathname = window.location.pathname;

  // Check if user has dismissed this site
  var dismissedKey = "docbridge_dismissed_" + hostname;
  chrome.storage.local.get(dismissedKey, function(data) {
    if (data[dismissedKey]) return;

    // Check nudge-enabled setting
    chrome.storage.local.get("docbridge_nudge_enabled", function(settings) {
      if (settings.docbridge_nudge_enabled === false) return;

      var matchedPortal = null;
      var matchedUpload = null;

      // 1. Try to match against known portals
      for (var i = 0; i < DOCBRIDGE_PORTALS.length; i++) {
        var portal = DOCBRIDGE_PORTALS[i];
        if (matchDomain(hostname, portal.domains) && matchUrlPatterns(pathname, portal.urlPatterns)) {
          matchedPortal = portal;
          matchedUpload = portal.uploads[0];
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
          matchedUpload = matchedPortal.uploads[0];
        }
      }

      if (matchedPortal && matchedUpload) {
        // Send detection result to background for badge update
        try {
          chrome.runtime.sendMessage({
            type: "PORTAL_DETECTED",
            portal: matchedPortal.id,
            portalName: matchedPortal.name
          });
        } catch(e) { /* ignore - background might not be ready */ }

        // Inject the nudge
        injectNudge(matchedPortal, matchedUpload);
      }
    });
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

  function injectNudge(portal, upload) {
    // Don't double-inject
    if (document.getElementById("docbridge-nudge")) return;

    // Load nudge.js as a web-accessible resource
    var script = document.createElement("script");
    script.src = chrome.runtime.getURL("content/nudge.js");
    script.onload = function() {
      this.remove();
      // Dispatch event to trigger nudge initialization
      window.dispatchEvent(new CustomEvent("docbridge-nudge-init", {
        detail: { portal: portal, upload: upload }
      }));
    };
    (document.head || document.documentElement).appendChild(script);
  }
})();
