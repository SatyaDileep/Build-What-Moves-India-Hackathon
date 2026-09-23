// DocBridge Full-Screen workspace — the big standalone converter for
// non-portal sites, custom specs, PDF→image, image→PDF, and document work.
// Open from the extension popup ("Open Full-Screen DocBridge") or detect a
// known portal first: fullscreen.html?preset=<id>&type=<uploadType>.
(function() {
  "use strict";

  var activePortal = null;
  var activeUploadIndex = 0;
  var outputFormat = null; // null = follow the portal's default
  // Voice is strictly opt-in: only speaks when the citizen enabled
  // "Elderly assistive mode" in the extension popup Settings. Default: silent.
  var voiceEnabled = false;
  var assistiveMode = false;

  // Header speaker button: standalone on/off switch for spoken guidance.
  // When Elderly assistive mode owns the voice, the button says so and yields.
  function paintVoiceBtn() {
    var b = $("fs-voice-btn");
    if (!b) return;
    if (assistiveMode) {
      b.disabled = true;
      b.setAttribute("aria-pressed", "true");
      b.textContent = "🔊 Assistive voice on";
      b.title = "Voice is on via Elderly assistive mode (extension popup → Settings)";
    } else {
      b.disabled = false;
      b.setAttribute("aria-pressed", voiceEnabled ? "true" : "false");
      b.textContent = voiceEnabled ? "🔊 Voice on" : "🔇 Voice off";
      b.title = "Toggle spoken guidance";
    }
  }

  function initVoice() {
    var b = $("fs-voice-btn");
    if (b) b.onclick = function() {
      if (assistiveMode) return;
      voiceEnabled = !voiceEnabled;
      try { chrome.storage.local.set({ docbridge_voice_enabled: voiceEnabled }); } catch (e) {}
      if (!voiceEnabled) { try { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); } catch (e) {} }
      paintVoiceBtn();
      if (voiceEnabled) speak("Voice guidance on.");
    };
    try {
      chrome.storage.local.get(["docbridge_assist_mode", "docbridge_voice_enabled"], function(d) {
        assistiveMode = !!(d && (d.docbridge_assist_mode === "assistive" || d.docbridge_assist_mode === true));
        voiceEnabled = assistiveMode || !!(d && d.docbridge_voice_enabled === true);
        paintVoiceBtn();
        if (voiceEnabled) {
          setTimeout(function() { speak("DocBridge full-screen converter is ready. Choose your portal, then add your document."); }, 400);
        }
      });
    } catch (e) { voiceEnabled = false; assistiveMode = false; paintVoiceBtn(); }
  }

  var $ = function(id) { return document.getElementById(id); };

  function queryParam(name) {
    try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; }
  }

  function esc(s) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(String(s == null ? "" : s)));
    return div.innerHTML;
  }

  /* ===== Preset search (mirrors popup) ===== */
  var PRESET_OPTIONS = (function() {
    var opts = [];
    (typeof DOCBRIDGE_PORTALS !== "undefined" ? DOCBRIDGE_PORTALS : []).forEach(function(p) {
      if (p.id.indexOf("mock-") === 0) return;
      p.uploads.forEach(function(u) {
        opts.push({ portal: p, upload: u, label: p.name + " — " + (u.type.charAt(0).toUpperCase() + u.type.slice(1)) + " | " + u.hint });
      });
    });
    return opts;
  })();

  function renderSearch(q) {
    var dd = $("fs-preset-dropdown");
    var query = (q || "").toLowerCase().trim();
    // Empty query lists the whole registry — every site is one click away.
    var filtered = query ? PRESET_OPTIONS.filter(function(o) { return o.label.toLowerCase().indexOf(query) >= 0; }) : PRESET_OPTIONS.slice();
    dd.innerHTML = "";
    if (!filtered.length) {
      var e = document.createElement("div");
      e.className = "fs-dd-empty";
      e.textContent = "No presets match. Try SSC, UPSC, Passport, NEET, IBPS…";
      dd.appendChild(e);
      return;
    }
    var head = document.createElement("div");
    head.className = "fs-dd-empty";
    head.textContent = filtered.length + " preset" + (filtered.length === 1 ? "" : "s") + " — pick one:";
    dd.appendChild(head);
    filtered.slice(0, 120).forEach(function(o) {
      var row = document.createElement("button");
      row.type = "button";
      row.className = "fs-dd-row";
      row.textContent = o.label;
      row.onclick = function() {
        selectUpload(o.portal, o.portal.uploads.indexOf(o.upload));
        $("fs-preset-search").value = o.portal.name + " " + o.upload.type;
        dd.innerHTML = "";
      };
      dd.appendChild(row);
    });
  }

  // One-tap shortcuts for the portals citizens open most.
  var FS_POPULAR = ["passport-seva", "ssc", "upsc", "ibps", "neet-ug", "rrb-ntpc", "generic-doc"];
  function renderPopular() {
    var wrap = $("fs-popular");
    if (!wrap) return;
    wrap.innerHTML = "";
    var label = document.createElement("span");
    label.className = "fs-popular-label";
    label.textContent = "Popular:";
    wrap.appendChild(label);
    FS_POPULAR.forEach(function(id) {
      var p = (typeof DOCBRIDGE_PORTALS !== "undefined" ? DOCBRIDGE_PORTALS : []).filter(function(x) { return x.id === id; })[0];
      if (!p) return;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "fs-pop-btn" + (activePortal && activePortal.id === id ? " active" : "");
      b.textContent = p.id === "generic-doc" ? "General" : p.name.replace(" (UG)", "").replace("Staff Selection Commission (SSC)", "SSC");
      b.title = p.name;
      b.onclick = function() {
        selectUpload(p, 0);
        $("fs-preset-search").value = "";
        $("fs-preset-dropdown").innerHTML = "";
        renderPopular();
      };
      wrap.appendChild(b);
    });
  }

  function renderChips() {
    var wrap = $("fs-type-chips");
    wrap.innerHTML = "";
    if (!activePortal || !activePortal.uploads || !activePortal.uploads.length) return;
    activePortal.uploads.forEach(function(u, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "fs-chip" + (i === activeUploadIndex ? " active" : "");
      b.setAttribute("aria-pressed", i === activeUploadIndex ? "true" : "false");
      var kb = u.constraint.max_kb ? (u.constraint.min_kb ? u.constraint.min_kb + "–" + u.constraint.max_kb + "KB" : "<" + u.constraint.max_kb + "KB") : "";
      var dims = u.constraint.width_px && u.constraint.height_px ? " " + u.constraint.width_px + "\u00d7" + u.constraint.height_px : "";
      b.textContent = u.type.charAt(0).toUpperCase() + u.type.slice(1) + (kb ? " (" + kb + dims + ")" : "");
      b.onclick = function() { selectUpload(activePortal, i); };
      wrap.appendChild(b);
    });
  }

  function renderReq() {
    var el = $("fs-req-summary");
    var u = activeUpload();
    if (!u) { el.textContent = "Pick a portal above, or keep “General / Document Converter” to convert any file freely."; return; }
    el.textContent = "Requirement: " + getConstraintSummary(u.constraint);
  }

  function renderFormat() {
    var sel = $("fs-output-format");
    sel.innerHTML = "";
    var u = activeUpload();
    var formats = (u && u.constraint) ? outputFormatsFor(u.constraint) : ["jpeg", "png", "pdf"];
    var has = {};
    formats.forEach(function(f) { has[f] = true; });
    ["jpeg", "png", "pdf"].forEach(function(f) {
      if (!has[f]) return;
      var o = document.createElement("option");
      o.value = f;
      o.textContent = formatLabel(f) + (f === "pdf" ? " (document)" : " (image)");
      sel.appendChild(o);
    });
    var def = (u && u.constraint && u.constraint.format) || "jpeg";
    var pick = (has[outputFormat] && outputFormat) || (has[def] && def) || sel.options[0].value;
    outputFormat = pick;
    sel.value = pick;
    var hint = $("fs-format-hint");
    hint.textContent = has[pick] && pick === "pdf"
      ? "Converts to a PDF page — great for document uploads."
      : (has[pick] ? "Output will be a " + formatLabel(pick) + " image, compliant with the portal above." : "");
  }

  function activeUpload() {
    if (activePortal && activePortal.uploads && activePortal.uploads[activeUploadIndex]) return activePortal.uploads[activeUploadIndex];
    return null;
  }

  function selectUpload(portal, idx) {
    activePortal = portal;
    activeUploadIndex = idx || 0;
    if (activeUploadIndex >= portal.uploads.length) activeUploadIndex = 0;
    outputFormat = null;
    renderChips();
    renderReq();
    renderFormat();
    renderPopular();
    var ctx = $("fs-context-label");
    ctx.textContent = "\u2724 " + portal.name;
  }

  function updateContextLabel() {
    var ctx = $("fs-context-label");
    ctx.textContent = activePortal ? "\u2724 " + activePortal.name : "Full-Screen Standalone";
  }

  /* ===== Chevron train progress ===== */
  function setStep(n) {
    var stops = document.querySelectorAll(".fs-stop");
    for (var k = 0; k < stops.length; k++) {
      (function(s) {
        var i = parseInt(s.getAttribute("data-step"), 10);
        s.classList.toggle("done", i < n);
        s.classList.toggle("current", i === n);
        var num = s.querySelector(".fs-stop-num");
        if (num) num.textContent = i < n ? "\u2713" : String(i);
      })(stops[k]);
    }
  }

  /* ===== File drop / browse ===== */
  function initDrop() {
    var drop = $("fs-drop");
    var input = $("fs-file");
    drop.onclick = function() { input.click(); };
    drop.onkeydown = function(e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } };
    ["dragover", "dragenter"].forEach(function(ev) { drop.addEventListener(ev, function(e) { e.preventDefault(); drop.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function(ev) { drop.addEventListener(ev, function(e) { e.preventDefault(); drop.classList.remove("drag"); }); });
    drop.addEventListener("drop", function(e) { if (e.dataTransfer && e.dataTransfer.files[0]) processFileUser(e.dataTransfer.files[0]); });
    input.onchange = function() { if (this.files[0]) processFileUser(this.files[0]); this.value = ""; };
  }

  function processFileUser(file) {
    if (!isSupportedInput(file)) {
      showError("That file type isn\u2019t supported yet. Upload a JPEG, PNG, WebP, GIF or BMP photo, or a PDF document.");
      return;
    }
    var u = activeUpload();
    if (!u) {
      showError("Pick a target above (or keep \u201cGeneral / Document Converter\u201d) before adding a file.");
      return;
    }
    var fmt = effectiveOutputFormat(u.constraint, outputFormat);
    if (["jpeg", "png", "pdf"].indexOf(fmt) < 0) fmt = "jpeg";

    hideError();
    showProcessing("Preparing\u2026 " + file.name);
    setStep(2);
    DocBridgeProcessor.processFile(file, u.constraint, { outputFormat: fmt })
      .then(function(result) {
        renderResult(result, file, u, activePortal);
        speakResult(result);
      })
      .catch(function(err) {
        var box = $("fs-result");
        box.hidden = true;
        box.innerHTML = "";
        setStep(2);
        showError("Couldn\u2019t convert that file: " + (err && err.message ? err.message : "unknown error") + (err && err.message && err.message.indexOf("PDF") >= 0 ? " \u2014 if this is a PDF inside a portal page, the Full-Screen converter can render it." : ""));
      });
  }

  /* ===== Result rendering ===== */
  function renderResult(result, file, upload, portal) {
    var box = $("fs-result");
    box.hidden = false;
    box.innerHTML = "";
    setStep(3);

    var orig = result.original;
    var opt = result.optimized;
    var constraint = result.constraint;
    var isPdfOut = opt.format === "pdf";

    var reduction = orig.size_kb > 0 ? Math.round((1 - opt.size_kb / orig.size_kb) * 100) : 0;
    var ok = opt.withinLimit;
    var statusClass = ok ? "fs-status ok" : "fs-status warn";
    var statusText = ok
      ? "\u2713 Ready \u2014 " + formatFileSize(opt.size_kb)
      : "\u26a0 Still over the limit \u2014 " + formatFileSize(opt.size_kb);

    var title = document.createElement("div");
    title.className = "fs-result-title";
    title.textContent = "Your converted " + (isPdfOut ? "PDF" : formatLabel(opt.format)) + " for " + portal.name;

    box.appendChild(title);

    var metrics = document.createElement("div");
    metrics.className = "fs-metrics";
    var m1 = document.createElement("div");
    m1.className = "fs-metric";
    m1.innerHTML = "<span>Original</span><strong>" + formatFileSize(orig.size_kb) + (orig.width && orig.height ? " \u00b7 " + orig.width + "\u00d7" + orig.height + "px" : "") + "</strong><span class=\"fs-format-tag\">" + formatLabel(orig.format || "unknown") + "</span>";
    var m2 = document.createElement("div");
    m2.className = "fs-metric";
    m2.innerHTML = "<span>Converted</span><strong>" + formatFileSize(opt.size_kb) + (opt.width && opt.height ? " \u00b7 " + opt.width + "\u00d7" + opt.height + "px" : "") + "</strong><span class=\"fs-format-tag\">" + formatLabel(opt.format) + (opt.pageCount ? " \u00b7 " + opt.pageCount + " pg" : "") + "</span>";
    metrics.appendChild(m1);
    metrics.appendChild(m2);
    box.appendChild(metrics);

    if (reduction > 0 && !isPdfOut) {
      var red = document.createElement("div");
      red.className = "fs-reduction";
      red.textContent = opt.aiCleaned === "cloud"
        ? "AI-recomposed background · fitted to portal spec on your device"
        : reduction + "% smaller \u00b7 converted on your device";
      box.appendChild(red);
    }

    // Previews
    if (!isPdfOut && opt.width && opt.height) {
      var prevRow = document.createElement("div");
      prevRow.className = "fs-previews";
      var c1 = document.createElement("div");
      c1.className = "fs-preview-card";
      c1.innerHTML = "<div class=\"fs-preview-label\">Original</div><canvas id=\"fs-pv-orig\" width=\"140\" height=\"140\"></canvas><div class=\"fs-preview-meta\">" + formatFileSize(orig.size_kb) + " \u00b7 " + (orig.width ? orig.width + "\u00d7" + orig.height : "document") + "</div>";
      var arrow = document.createElement("div");
      arrow.className = "fs-preview-arrow";
      arrow.textContent = "\u2192";
      var c2 = document.createElement("div");
      c2.className = "fs-preview-card";
      c2.innerHTML = "<div class=\"fs-preview-label\">Converted</div><canvas id=\"fs-pv-opt\" width=\"140\" height=\"140\"></canvas><div class=\"fs-preview-meta\">" + formatFileSize(opt.size_kb) + " \u00b7 " + opt.width + "\u00d7" + opt.height + "</div>";
      prevRow.appendChild(c1);
      prevRow.appendChild(arrow);
      prevRow.appendChild(c2);
      box.appendChild(prevRow);
      try { drawPreview("fs-pv-orig", orig.blob); } catch (e) {}
      drawPreview("fs-pv-opt", opt.blob);
    } else {
      var pdfTag = document.createElement("div");
      pdfTag.style.textAlign = "center";
      pdfTag.style.marginBottom = "14px";
      pdfTag.innerHTML = "<span class=\"fs-preview-pdf\">PDF</span> <span style=\"font-size:13px;color:var(--db-muted)\">\u2014 " + formatFileSize(opt.size_kb) + (opt.pageCount ? " \u00b7 " + opt.pageCount + " page document" : "") + "</span>";
      box.appendChild(pdfTag);
    }

    var status = document.createElement("div");
    status.className = statusClass;
    status.textContent = statusText;
    box.appendChild(status);

    if (opt.warning) {
      var warn = document.createElement("div");
      warn.className = "fs-clarity";
      warn.textContent = "\u2139 " + opt.warning;
      box.appendChild(warn);
    }

    // Honest footer: the default is zero-leak, but say so when this session
    // used the cloud AI path with the citizen's confirmation.
    if (opt.aiCleaned === "cloud") {
      var note = $("fs-privacy-note");
      if (note) note.innerHTML = "&#128274; <strong>Zero leak by default</strong> &mdash; this file&rsquo;s background was recomposed with AI using your key, with your confirmation.";
    }

    var filename = fsFilename(portal.id, upload.type, opt.ext || formatExt(opt.format || "jpg"));

    var actions = document.createElement("div");
    actions.className = "fs-actions";

    var dl = document.createElement("button");
    dl.type = "button";
    dl.className = "fs-btn-primary";
    dl.textContent = "Download " + (isPdfOut ? "PDF" : formatLabel(opt.format));

    var again = document.createElement("button");
    again.type = "button";
    again.className = "fs-btn-secondary";
    again.textContent = "Convert another file";

    actions.appendChild(dl);
    actions.appendChild(again);

    // Background cleanup, two tiers (photos only, white-bg slots, JPEG
    // output): on-device keying is the default; cloud AI is explicit,
    // per-use opt-in with its own key and disclaimer.
    var canCleanup = upload.type === "photo" && opt.format === "jpeg" && !opt.aiCleaned && orig.format !== "pdf";
    if (canCleanup && constraint.bg_color === "white" && constraint.width_px && constraint.height_px) {
      var pick = document.createElement("div");
      pick.className = "db-ai-pick";
      pick.style.flexBasis = "100%";

      var localBtn = document.createElement("button");
      localBtn.type = "button";
      localBtn.className = "fs-btn-secondary";
      localBtn.textContent = "Clean background — 100% on-device";

      var cloudBtn = document.createElement("button");
      cloudBtn.type = "button";
      cloudBtn.className = "fs-btn-ai";
      cloudBtn.textContent = "Remove background with AI";

      pick.appendChild(localBtn);
      pick.appendChild(cloudBtn);
      actions.appendChild(pick);

      localBtn.onclick = function() {
        localBtn.disabled = true;
        localBtn.textContent = "Cleaning…";
        DocBridgeProcessor.aiCleanup(orig.blob, constraint).then(function(cleaned) {
          renderResult(cleaned, file, upload, portal);
        }).catch(function() {
          localBtn.disabled = false;
          localBtn.textContent = "Clean background — 100% on-device";
        });
      };

      cloudBtn.onclick = function() {
        if ($("fs-ai-consent")) return;
        localBtn.disabled = true;
        cloudBtn.disabled = true;
        DocBridgeAI.getKey().then(function(k) {
          var card = DocBridgeAI.buildConsentCard({
            hasKey: !!k,
            onCancel: function() {
              card.remove();
              localBtn.disabled = false;
              cloudBtn.disabled = false;
            },
            onConfirm: function(typedKey) {
              function run() {
                DocBridgeAI.cleanupToSpec(orig.blob, constraint).then(function(cleaned) {
                  renderResult(cleaned, file, upload, portal);
                }).catch(function(e) {
                  var st = card._status;
                  if (st) { st.style.display = "block"; st.textContent = (e && e.message) || "AI cleanup failed. Your on-device file is untouched."; }
                  if (card._go) { card._go.disabled = false; card._go.textContent = "Try again"; }
                });
              }
              if (typedKey) {
                DocBridgeAI.saveKey(typedKey).then(function() { run(); });
              } else {
                run();
              }
            }
          });
          card.id = "fs-ai-consent";
          box.appendChild(card);
          try { card.scrollIntoView({ block: "nearest" }); } catch (e) {}
        });
      };
    }

    box.appendChild(actions);

    // Handoff + share after download
    dl.onclick = function() {
      dl.disabled = true;
      dl.textContent = "Saving\u2026";
      fsDownload(opt.blob, filename, function() {
        dl.textContent = "\u2713 Saved \u2014 check Downloads";
        appendHandoff(box, filename);
        bumpStats();
        setTimeout(function() { dl.textContent = "Download " + (isPdfOut ? "PDF" : formatLabel(opt.format)); dl.disabled = false; }, 1600);
      });
    };
    again.onclick = function() {
      box.hidden = true;
      box.innerHTML = "";
      setStep(2);
      $("fs-file").value = "";
    };
  }

  function appendHandoff(box, filename) {
    if ($("fs-handoff")) return;
    var h = document.createElement("div");
    h.id = "fs-handoff";
    h.className = "fs-handoff";
    h.innerHTML = "<div class=\"fs-handoff-title\">\u2713 Saved to Downloads</div>" +
      "<div class=\"fs-handoff-file\">" + esc(filename) + "</div>" +
      "<div>Now click \u201cChoose File\u201d on the portal and pick this file. It\u2019s already sized for the portal\u2019s rules.</div>";
    box.appendChild(h);
  }

  function drawPreview(canvasId, blob) {
    var canvas = $(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var img = new Image();
    var url = URL.createObjectURL(blob);
    img.onload = function() {
      try {
        var scale = Math.min(140 / img.width, 140 / img.height);
        var w = img.width * scale, h = img.height * scale;
        ctx.clearRect(0, 0, 140, 140);
        ctx.drawImage(img, (140 - w) / 2, (140 - h) / 2, w, h);
        canvas._img = img;
      } catch (e) {}
      try { URL.revokeObjectURL(url); } catch (e) {}
    };
    img.onerror = function() { try { URL.revokeObjectURL(url); } catch (e) {} };
    img.src = url;
  }

  /* ===== Download, stats, voice ===== */
  function fsDownload(blob, filename, cb) {
    var url = URL.createObjectURL(blob);
    try {
      if (typeof chrome !== "undefined" && chrome.downloads && chrome.downloads.download) {
        chrome.downloads.download({ url: url, filename: filename, saveAs: false }, function() {
          setTimeout(function() { try { URL.revokeObjectURL(url); } catch (e) {} }, 2000);
          if (cb) cb();
        });
        return;
      }
    } catch (e) {}
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { try { URL.revokeObjectURL(url); } catch (e) {} }, 1000);
    if (cb) cb();
  }

  function fsFilename(portalId, type, ext) {
    var idMap = { "passport-seva": "Passport", "upsc": "UPSC", "sarathi-vahan": "Sarathi", "ssc": "SSC_CGL", "ibps": "IBPS_PO", "sbi-po": "SBI_PO", "rrb": "RRB", "epfo-uan": "EPFO", "indian-visa": "IndianVisa", "e-visa": "eVisa", "jkbopee": "JKBOPEE", "uidai-aadhaar": "Aadhaar", "nsp": "NSP", "e-shram": "eShram", "income-tax": "IncomeTax", "gst": "GST", "csc-digital-seva": "CSC", "custom-manual": "Custom", "generic-doc": "Document" };
    var base = idMap[portalId] || String(portalId || "DocBridge").replace(/[^a-z0-9]/gi, "_");
    var t = (type || "document").charAt(0).toUpperCase() + (type || "document").slice(1).toLowerCase();
    return base + "_" + t + "_Compliant." + (ext || "jpg");
  }

  function bumpStats() {
    try {
      if (typeof chrome === "undefined" || !chrome.storage) return;
      chrome.storage.local.get("docbridge_stats", function(d) {
        var s = (d && d.docbridge_stats) || { processed: 0 };
        s.processed = (s.processed || 0) + 1;
        chrome.storage.local.set({ docbridge_stats: s }, function() {
          var el = $("fs-stat-processed");
          if (el) el.textContent = s.processed;
        });
      });
    } catch (e) {}
  }

  function speakResult(result) {
    try {
      if (!("speechSynthesis" in window)) return;
      var ok = result.optimized.withinLimit;
      speak(ok ? "Your document is ready and within the portal's limits." : "Your document is ready, but check the size before uploading.");
    } catch (e) {}
  }
  function speak(text) {
    // Opt-in only: never narrate unless assistive mode was explicitly enabled.
    if (!voiceEnabled) return;
    try {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      u.lang = "en-IN";
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* ===== Misc UI ===== */
  function showProcessing(text) {
    var box = $("fs-result");
    box.hidden = false;
    box.innerHTML = "";
    var p = document.createElement("div");
    p.className = "fs-processing";
    p.innerHTML = "<div class=\"fs-spinner\"></div><div class=\"fs-processing-text\">" + esc(text) + "</div>";
    box.appendChild(p);
  }
  function showError(text) {
    var el = $("fs-error");
    el.hidden = false;
    el.textContent = text;
  }
  function hideError() { $("fs-error").hidden = true; }

  function initHelp() {
    var toggle = false;
    $("fs-help").onclick = function() {
      toggle = !toggle;
      $("fs-help-card").hidden = !toggle;
    };
  }

  function init() {
    var preset = queryParam("preset");
    var type = queryParam("type");

    // Seed storage seen flag so the popup can show "resumes" messaging if needed
    try { chrome.storage.local.set({ docbridge_fullscreen_seen: { t: Date.now() } }); } catch (e) {}

    if (preset) {
      var found = (typeof DOCBRIDGE_PORTALS !== "undefined" ? DOCBRIDGE_PORTALS : []).filter(function(p) { return p.id === preset; })[0];
      if (found) {
        var idx = 0;
        found.uploads.forEach(function(u, i) { if (u.type === type) idx = i; });
        selectUpload(found, idx);
      }
    }
    if (!activePortal) {
      var generic = (typeof DOCBRIDGE_PORTALS !== "undefined" ? DOCBRIDGE_PORTALS : []).filter(function(p) { return p.id === "generic-doc"; })[0];
      if (generic) selectUpload(generic, 0);
    }
    updateContextLabel();

    $("fs-preset-search").addEventListener("input", function() { renderSearch(this.value); });
    $("fs-preset-search").addEventListener("focus", function() { renderSearch(this.value); });
    $("fs-output-format").addEventListener("change", function() {
      var picked = this.value;
      var u = activeUpload();
      var formats = u ? outputFormatsFor(u.constraint) : ["jpeg", "png", "pdf"];
      if (formats.indexOf(picked) < 0) picked = formats[0];
      outputFormat = picked;
      var hint = $("fs-format-hint");
      hint.textContent = picked === "pdf"
        ? "Converts to a PDF page \u2014 great for document uploads."
        : "Output will be a " + formatLabel(picked) + " image, compliant with the portal above.";
    });

    try {
      chrome.storage.local.get("docbridge_stats", function(d) {
        var s = (d && d.docbridge_stats) || { processed: 0 };
        var el = $("fs-stat-processed");
        if (el) el.textContent = s.processed || 0;
      });
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function() {
    initHelp();
    initDrop();
    init();
    initVoice();
    setStep(1);
  });
})();