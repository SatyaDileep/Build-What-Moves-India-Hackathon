// DocBridge Processing Panel
(function() {
  "use strict";

  window.addEventListener("docbridge-panel-init", function(e) {
    showPanel(e.detail.portal, e.detail.upload);
  });

  function showPanel(portal, upload) {
    if (document.getElementById("docbridge-panel")) return;

    var constraint = upload.constraint;
    var constraintSummary = getConstraintSummary(constraint);

    // Build panel DOM programmatically to avoid HTML quoting issues
    var panel = document.createElement("div");
    panel.id = "docbridge-panel";

    var overlay = document.createElement("div");
    overlay.className = "db-panel-overlay";

    var panelBox = document.createElement("div");
    panelBox.className = "db-panel";

    // Header
    var header = document.createElement("div");
    header.className = "db-panel-header";

    var titleBlock = document.createElement("div");
    titleBlock.className = "db-panel-title";
    var shield = document.createElement("span");
    shield.className = "db-panel-shield";
    shield.textContent = "\u2724 DocBridge";
    var portalName = document.createElement("span");
    portalName.className = "db-panel-portal";
    portalName.textContent = portal.name;
    titleBlock.appendChild(shield);
    titleBlock.appendChild(portalName);

    var closeBtn = document.createElement("button");
    closeBtn.id = "db-panel-close";
    closeBtn.className = "db-panel-close-btn";
    closeBtn.textContent = "\u2715";

    header.appendChild(titleBlock);
    header.appendChild(closeBtn);

    // Requirements bar
    var reqBar = document.createElement("div");
    reqBar.className = "db-panel-requirements";
    var reqLabel = document.createElement("div");
    reqLabel.className = "db-panel-req-label";
    reqLabel.textContent = "Portal requirements:";
    var reqValue = document.createElement("div");
    reqValue.className = "db-panel-req-value";
    reqValue.textContent = constraintSummary;
    reqBar.appendChild(reqLabel);
    reqBar.appendChild(reqValue);

    // DOP Toggle (UPSC/PSC)
    var showDOP = /upsc|psc|ssc|rrb/i.test(portal.id) || /upsc|ssc/i.test(portal.name);
    var dopWrap = document.createElement("div");
    dopWrap.className = "db-dop-wrap";
    dopWrap.style.display = showDOP ? "block" : "none";
    var dopLabel = document.createElement("label");
    dopLabel.className = "db-dop-toggle";
    var dopCheck = document.createElement("input");
    dopCheck.type = "checkbox"; dopCheck.id = "db-dop-check";
    var dopText = document.createElement("span");
    dopText.textContent = "Stamp Name & Date (UPSC/PSC) — optional";
    dopLabel.appendChild(dopCheck); dopLabel.appendChild(dopText);
    var dopFields = document.createElement("div");
    dopFields.id = "db-dop-fields";
    dopFields.className = "db-dop-fields";
    dopFields.style.display = "none";
    var dopName = document.createElement("input");
    dopName.id = "db-dop-name"; dopName.placeholder = "Candidate Name";
    dopName.className = "db-dop-input";
    var dopDate = document.createElement("input");
    dopDate.id = "db-dop-date"; dopDate.type = "date";
    dopDate.className = "db-dop-input";
    dopDate.valueAsDate = new Date();
    dopFields.appendChild(dopName); dopFields.appendChild(dopDate);
    dopCheck.onchange = function(){ dopFields.style.display = this.checked ? "flex" : "none"; };
    dopWrap.appendChild(dopLabel); dopWrap.appendChild(dopFields);

    // Dropzone
    var dropzone = document.createElement("div");
    dropzone.id = "db-panel-drop";
    dropzone.className = "db-panel-dropzone";

    var dropIcon = document.createElement("div");
    dropIcon.className = "db-drop-icon";
    dropIcon.textContent = "\u2601";
    var dropText = document.createElement("div");
    dropText.className = "db-drop-text";
    dropText.textContent = "Drop your photo here";
    var dropSub = document.createElement("div");
    dropSub.className = "db-drop-subtext";
    dropSub.textContent = "or";

    var browseBtn = document.createElement("label");
    browseBtn.className = "db-btn-secondary";
    browseBtn.setAttribute("for", "db-file-input");
    browseBtn.textContent = "Browse files";

    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "db-file-input";
    fileInput.accept = "image/jpeg,image/jpg,image/png";
    fileInput.style.display = "none";

    dropzone.appendChild(dropIcon);
    dropzone.appendChild(dropText);
    dropzone.appendChild(dropSub);
    dropzone.appendChild(browseBtn);
    dropzone.appendChild(fileInput);

    // Result area (hidden initially)
    var resultDiv = document.createElement("div");
    resultDiv.id = "db-panel-result";
    resultDiv.className = "db-panel-result";
    resultDiv.style.display = "none";

    // Footer
    var footer = document.createElement("div");
    footer.className = "db-panel-footer";
    var privacy = document.createElement("span");
    privacy.className = "db-privacy-badge";
    privacy.textContent = "\u{1f512} Processed 100% on your device \u2014 your photo never leaves Chrome";
    footer.appendChild(privacy);

    // Assemble panel
    panelBox.appendChild(header);
    panelBox.appendChild(reqBar);
    panelBox.appendChild(dopWrap);
    panelBox.appendChild(dropzone);
    panelBox.appendChild(resultDiv);
    panelBox.appendChild(footer);
    overlay.appendChild(panelBox);
    panel.appendChild(overlay);
    document.body.appendChild(panel);

    // Event handlers
    closeBtn.onclick = function() { panel.remove(); };
    overlay.onclick = function(e) { if (e.target === overlay) panel.remove(); };

    dropzone.ondragover = function(e) {
      e.preventDefault();
      dropzone.classList.add("db-dropzone-hover");
    };
    dropzone.ondragleave = function() {
      dropzone.classList.remove("db-dropzone-hover");
    };
    dropzone.ondrop = function(e) {
      e.preventDefault();
      dropzone.classList.remove("db-dropzone-hover");
      if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0], constraint);
      }
    };
    fileInput.onchange = function() {
      if (this.files.length > 0) {
        handleFile(this.files[0], constraint);
      }
    };
  }

  function handleFile(file, constraint) {
    var dropzone = document.getElementById("db-panel-drop");
    var resultDiv = document.getElementById("db-panel-result");

    // Reject non-image files
    if (!isImageFile(file)) {
      dropzone.style.display = "none";
      resultDiv.style.display = "block";
      resultDiv.innerHTML = "";
      var errDiv = document.createElement("div");
      errDiv.className = "db-result-error";
      var errIcon = document.createElement("div");
      errIcon.className = "db-result-error-icon";
      errIcon.textContent = "\u26a0";
      var errText = document.createElement("div");
      errText.textContent = "This portal requires a JPEG photo. PDF processing is coming in v2.";
      var errHint = document.createElement("div");
      errHint.className = "db-result-error-hint";
      errHint.textContent = "Please select a JPEG or JPG file.";
      var retryBtn = document.createElement("button");
      retryBtn.className = "db-btn-secondary";
      retryBtn.textContent = "Try another file";
      retryBtn.style.marginTop = "12px";
      errDiv.appendChild(errIcon);
      errDiv.appendChild(errText);
      errDiv.appendChild(errHint);
      errDiv.appendChild(retryBtn);
      resultDiv.appendChild(errDiv);
      retryBtn.onclick = function() {
        resultDiv.style.display = "none";
        dropzone.style.display = "block";
        resultDiv.innerHTML = "";
        fileInput = document.getElementById("db-file-input");
        if (fileInput) fileInput.value = "";
      };
      return;
    }

    // Show processing state
    dropzone.style.display = "none";
    resultDiv.style.display = "block";
    resultDiv.innerHTML = "";
    var procDiv = document.createElement("div");
    procDiv.className = "db-processing";
    var spinner = document.createElement("div");
    spinner.className = "db-processing-spinner";
    var procText = document.createElement("div");
    procText.className = "db-processing-text";
    procText.textContent = "Processing your photo...";
    procDiv.appendChild(spinner);
    procDiv.appendChild(procText);
    resultDiv.appendChild(procDiv);

    // Apply DOP stamp if checked
    var effConstraint = Object.assign({}, constraint);
    var dopChk = document.getElementById("db-dop-check");
    if (dopChk && dopChk.checked) {
      var nm = (document.getElementById("db-dop-name")||{}).value || "";
      var dt = (document.getElementById("db-dop-date")||{}).value || "";
      var stamp = [nm.trim(), dt.trim()].filter(Boolean).join("  |  ");
      if (stamp) effConstraint.stampText = stamp;
    }

    // Process
    DocBridgeProcessor.processImage(file, effConstraint).then(function(result) {
      showResult(result, file.name);
    }).catch(function(err) {
      resultDiv.innerHTML = "";
      var errDiv = document.createElement("div");
      errDiv.className = "db-result-error";
      var errIcon = document.createElement("div");
      errIcon.className = "db-result-error-icon";
      errIcon.textContent = "\u26a0";
      var errText = document.createElement("div");
      errText.textContent = "Could not process this image.";
      var errHint = document.createElement("div");
      errHint.className = "db-result-error-hint";
      errHint.textContent = err.message || "Unknown error";
      var retryBtn = document.createElement("button");
      retryBtn.id = "db-result-retry";
      retryBtn.className = "db-btn-secondary";
      retryBtn.textContent = "Try another file";
      retryBtn.style.marginTop = "12px";
      errDiv.appendChild(errIcon);
      errDiv.appendChild(errText);
      errDiv.appendChild(errHint);
      errDiv.appendChild(retryBtn);
      resultDiv.appendChild(errDiv);
      retryBtn.onclick = function() {
        resultDiv.style.display = "none";
        document.getElementById("db-panel-drop").style.display = "block";
        resultDiv.innerHTML = "";
      };
    });
  }

  function showResult(result, filename) {
    var resultDiv = document.getElementById("db-panel-result");
    var orig = result.original;
    var opt = result.optimized;
    var constraint = result.constraint;

    var reduction = orig.size_kb > 0 ? Math.round((1 - opt.size_kb / orig.size_kb) * 100) : 0;
    var statusClass = opt.withinLimit ? "db-status-success" : "db-status-warning";
    var statusText = opt.withinLimit
      ? "\u2713 Ready to upload \u2014 " + formatFileSize(opt.size_kb)
      : "\u26a0 Still over limit \u2014 " + formatFileSize(opt.size_kb);
    var origPixels = orig.width * orig.height;
    var optPixels = opt.width * opt.height;
    var dropPct = origPixels>0 ? Math.round((1 - optPixels/origPixels)*100) : 0;
    var targetKB = constraint.max_kb || 100;
    var needsClarityNudge = targetKB < 20 && dropPct > 60;

    resultDiv.innerHTML = "";

    var resultContainer = document.createElement("div");
    resultContainer.className = "db-result";

    var metrics = document.createElement("div");
    metrics.className = "db-metrics";
    var mOrig = document.createElement("div");
    mOrig.className = "db-metric";
    mOrig.innerHTML = "<span>Original</span><strong>" + formatFileSize(orig.size_kb) + " \u00b7 " + orig.width + "\u00d7" + orig.height + "px</strong>";
    var mOpt = document.createElement("div");
    mOpt.className = "db-metric";
    mOpt.innerHTML = "<span>Optimized</span><strong>" + formatFileSize(opt.size_kb) + " \u00b7 " + opt.width + "\u00d7" + opt.height + "px " + (opt.withinLimit?"\u2713":"") + "</strong>";
    metrics.appendChild(mOrig); metrics.appendChild(mOpt);

    var tabs = document.createElement("div");
    tabs.className = "db-tabs";
    var tabBefore = document.createElement("button");
    tabBefore.className = "db-tab active"; tabBefore.textContent = "Before";
    var tabAfter = document.createElement("button");
    tabAfter.className = "db-tab"; tabAfter.textContent = "After";
    tabs.appendChild(tabBefore); tabs.appendChild(tabAfter);

    var previewRow = document.createElement("div");
    previewRow.className = "db-result-preview zoomable";

    var origCard = document.createElement("div");
    origCard.className = "db-result-card";
    origCard.id = "db-card-orig";
    var origLabel = document.createElement("div");
    origLabel.className = "db-result-card-label";
    origLabel.textContent = "Original — hover to zoom 2×";
    var origCanvas = document.createElement("canvas");
    origCanvas.id = "db-preview-orig";
    origCanvas.className = "db-zoom-canvas";
    origCanvas.width = 140;
    origCanvas.height = 140;
    var origMeta = document.createElement("div");
    origMeta.className = "db-result-card-meta";
    origMeta.textContent = formatFileSize(orig.size_kb) + " \u00b7 " + orig.width + "\u00d7" + orig.height;
    origCard.appendChild(origLabel);
    origCard.appendChild(origCanvas);
    origCard.appendChild(origMeta);

    var arrow = document.createElement("div");
    arrow.className = "db-result-arrow";
    arrow.textContent = "\u2192";

    var optCard = document.createElement("div");
    optCard.className = "db-result-card";
    optCard.id = "db-card-opt";
    var optLabel = document.createElement("div");
    optLabel.className = "db-result-card-label";
    optLabel.textContent = "Optimized — hover to zoom 2×";
    var optCanvas = document.createElement("canvas");
    optCanvas.id = "db-preview-opt";
    optCanvas.className = "db-zoom-canvas";
    optCanvas.width = 140;
    optCanvas.height = 140;
    var optMeta = document.createElement("div");
    optMeta.className = "db-result-card-meta";
    optMeta.textContent = formatFileSize(opt.size_kb) + " \u00b7 " + opt.width + "\u00d7" + opt.height;
    optCard.appendChild(optLabel);
    optCard.appendChild(optCanvas);
    optCard.appendChild(optMeta);

    previewRow.appendChild(origCard);
    previewRow.appendChild(arrow);
    previewRow.appendChild(optCard);

    tabBefore.onclick = function(){ tabBefore.classList.add("active"); tabAfter.classList.remove("active"); origCard.style.display="block"; optCard.style.display="block"; arrow.style.display="block"; };
    tabAfter.onclick = function(){ tabAfter.classList.add("active"); tabBefore.classList.remove("active"); };

    var reductionBadge = document.createElement("div");
    reductionBadge.className = "db-result-reduction";
    reductionBadge.textContent = reduction > 0 ? reduction + "% smaller \u00b7 " + dropPct + "% pixels reduced" : "No size change";

    var statusBar = document.createElement("div");
    statusBar.className = "db-result-status " + statusClass;
    statusBar.textContent = statusText;

    resultContainer.appendChild(metrics);
    resultContainer.appendChild(tabs);
    resultContainer.appendChild(previewRow);
    resultContainer.appendChild(reductionBadge);
    resultContainer.appendChild(statusBar);

    if (needsClarityNudge) {
      var nudge = document.createElement("div");
      nudge.className = "db-clarity-nudge";
      nudge.innerHTML = "<strong>\u26a0 High-Compression Alert</strong><br>Compressing to &lt;20KB may reduce sharpness (" + dropPct + "% pixel drop). Please inspect signature strokes at 2× zoom below to confirm legibility before saving.";
      resultContainer.appendChild(nudge);
    } else if (opt.warning) {
      var warningDiv = document.createElement("div");
      warningDiv.className = "db-result-warning";
      warningDiv.textContent = "\u2139 " + opt.warning;
      resultContainer.appendChild(warningDiv);
    } else if (needsClarityNudge && opt.warning) {
      var both = document.createElement("div");
      both.className = "db-result-warning";
      both.textContent = "\u2139 " + opt.warning;
      resultContainer.appendChild(both);
    }

    // Action buttons
    var actions = document.createElement("div");
    actions.className = "db-result-actions";

    var downloadBtn = document.createElement("button");
    downloadBtn.id = "db-result-download";
    downloadBtn.className = "db-btn-primary";
    downloadBtn.textContent = "Download Optimized Photo";

    var againBtn = document.createElement("button");
    againBtn.id = "db-result-again";
    againBtn.className = "db-btn-ghost";
    againBtn.textContent = "Process another";

    actions.appendChild(downloadBtn);
    actions.appendChild(againBtn);
    resultContainer.appendChild(actions);

    resultDiv.appendChild(resultContainer);

    // Draw previews + enable zoom
    drawPreview("db-preview-orig", orig.blob);
    drawPreview("db-preview-opt", opt.blob);
    enableZoom("db-preview-orig");
    enableZoom("db-preview-opt");

    var filenameClean = getDeterministicFilename(portal, result.constraint, filename, opt);

    // Download handler
    downloadBtn.onclick = function() {
      downloadBtn.textContent = "Saving…";
      downloadBtn.disabled = true;
      triggerDownload(opt.blob, filenameClean, function(){
        downloadBtn.textContent = "✓ Saved";
        showHandoffGuide(filenameClean);
        chrome.storage.local.get("docbridge_stats", function(d) {
          var s = d.docbridge_stats || { processed: 0 };
          s.processed = (s.processed || 0) + 1;
          chrome.storage.local.set({ docbridge_stats: s });
        });
        setTimeout(function(){ downloadBtn.textContent = "Download Optimized Photo"; downloadBtn.disabled=false; }, 1800);
      });
    };

    // Process another handler
    againBtn.onclick = function() {
      resultDiv.style.display = "none";
      var dz = document.getElementById("db-panel-drop");
      dz.style.display = "block";
      resultDiv.innerHTML = "";
      var fi = document.getElementById("db-file-input");
      if (fi) fi.value = "";
    };
  }

  function drawPreview(canvasId, blob) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var img = new Image();
    var url = URL.createObjectURL(blob);
    img.onload = function() {
      var scale = Math.min(140 / img.width, 140 / img.height);
      var w = img.width * scale;
      var h = img.height * scale;
      ctx.clearRect(0,0,140,140);
      ctx.drawImage(img, (140 - w) / 2, (140 - h) / 2, w, h);
      canvas._img = img; canvas._imgUrl = url;
    };
    img.src = url;
  }

  function enableZoom(canvasId){
    var c=document.getElementById(canvasId);
    if(!c) return;
    c.addEventListener("mouseenter", function(){
      if(!c._img) return;
      c.style.transform="scale(2)";
      c.style.zIndex="10";
      c.style.transformOrigin="center center";
      c.style.boxShadow="0 4px 20px rgba(0,0,0,.25)";
    });
    c.addEventListener("mouseleave", function(){
      c.style.transform="scale(1)";
      c.style.zIndex="1";
      c.style.boxShadow="none";
    });
    c.addEventListener("click", function(){
      var isZoomed=c.style.transform==="scale(2)";
      c.style.transform=isZoomed?"scale(1)":"scale(2)";
    });
  }

  function getDeterministicFilename(portal, constraint, originalName, opt){
    var idMap = { 'passport-seva':'Passport', 'upsc':'UPSC', 'sarathi-vahan':'Sarathi', 'ssc':'SSC_CGL', 'ibps':'IBPS_PO', 'sbi-po':'SBI_PO', 'rrb':'RRB', 'epfo-uan':'EPFO', 'indian-visa':'IndianVisa', 'e-visa':'eVisa', 'jkbopee':'JKBOPEE', 'uidai-aadhaar':'Aadhaar', 'nsp':'NSP', 'e-shram':'eShram', 'income-tax':'IncomeTax', 'gst':'GST', 'csc-digital-seva':'CSC', 'custom-manual':'Custom' };
    var base = idMap[portal.id] || portal.id.replace(/[^a-z0-9]/gi,'_').toUpperCase();
    var type = constraint && constraint.type ? constraint.type : 'photo';
    var t = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    if (t.toLowerCase()==='photo') t='Photo';
    if (t.toLowerCase()==='signature') t='Signature';
    if (t.toLowerCase()==='thumb') t='Thumb';
    return base + '_' + t + '_Compliant.jpg';
  }

  function triggerDownload(blob, filename, cb){
    var url = URL.createObjectURL(blob);
    try {
      if (typeof chrome !== 'undefined' && chrome.downloads && chrome.downloads.download) {
        chrome.downloads.download({ url: url, filename: filename, saveAs: false }, function(id){
          if (chrome.runtime.lastError) {
            fallbackDownload(url, filename);
          }
          setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);
          if (cb) cb();
        });
        return;
      }
    } catch(e) {}
    fallbackDownload(url, filename);
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
    if (cb) cb();
  }

  function fallbackDownload(url, filename){
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function downloadBlob(blob, filename) { triggerDownload(blob, filename); }

  function showHandoffGuide(filename){
    if (document.getElementById("db-handoff")) return;
    var guide = document.createElement("div");
    guide.id = "db-handoff";
    guide.className = "db-handoff";
    guide.innerHTML = '<div class="db-handoff-title">✓ Saved to Downloads</div><div class="db-handoff-file">' + filename + '</div><div class="db-handoff-steps"><div class="db-step"><span class="db-step-num">1</span><span>Saved to your Downloads folder: <strong>' + filename + '</strong></span></div><div class="db-step"><span class="db-step-num">2</span><span>Click <strong>“Choose File”</strong> on the portal and select this file.</span></div></div>';
    var container = document.querySelector(".db-result") || document.getElementById("db-panel-result");
    if (container) container.appendChild(guide);
    showShareBar();
  }

  function showShareBar(){
    if (document.getElementById("db-sharebar")) return;
    var bar = document.createElement("div");
    bar.id = "db-sharebar";
    bar.className = "db-sharebar";
    bar.innerHTML = '<div class="db-share-title">Share DocBridge</div><div class="db-share-btns"><button class="db-share-btn wa" data-share="wa">Share on WhatsApp</button><button class="db-share-btn li" data-share="li">Share on LinkedIn</button><button class="db-share-btn x" data-share="x">Share on X</button></div><button class="db-feedback-link">💬 Found an issue? Send Direct Feedback to Developer</button>';
    var container = document.querySelector(".db-result") || document.getElementById("db-panel-result");
    if (container) container.appendChild(bar);
    var wa = bar.querySelector('[data-share="wa"]');
    var li = bar.querySelector('[data-share="li"]');
    var x = bar.querySelector('[data-share="x"]');
    function getShare(){ return (typeof DocBridgeShare !== 'undefined') ? DocBridgeShare : { whatsapp:function(){return "https://api.whatsapp.com/send?text="+encodeURIComponent("Never face SSC/UPSC upload rejections again! Check out DocBridge: https://chromewebstore.google.com/detail/docbridge");}, linkedin:function(){return "https://www.linkedin.com/sharing/share-offsite/?url="+encodeURIComponent("https://chromewebstore.google.com/detail/docbridge");}, x:function(){return "https://twitter.com/intent/tweet?text="+encodeURIComponent("Formatting documents for Indian Govt exams used to be painful. DocBridge fixes it on-device!")+"&url="+encodeURIComponent("https://chromewebstore.google.com/detail/docbridge");}, open:function(u){window.open(u,"_blank","noopener");} }; }
    wa.onclick = function(){ getShare().open(getShare().whatsapp()); };
    li.onclick = function(){ getShare().open(getShare().linkedin()); };
    x.onclick = function(){ getShare().open(getShare().x()); };
    bar.querySelector(".db-feedback-link").onclick = function(){ openFeedbackModal(); };
  }

  function openFeedbackModal(){
    if (document.getElementById("db-feedback-modal")) return;
    var overlay = document.createElement("div");
    overlay.id = "db-feedback-modal";
    overlay.className = "db-feedback-overlay";
    overlay.innerHTML = '<div class="db-feedback-box"><div class="db-feedback-header"><strong>Send Feedback</strong><button class="db-feedback-close">✕</button></div><label class="db-feedback-label">Issue Type<select id="db-fb-type"><option>Portal Spec Changed</option><option>Conversion Quality</option><option>New Site Request</option><option>General Feedback</option></select></label><label class="db-feedback-label">Message<textarea id="db-fb-msg" rows="3" placeholder="Describe the issue…"></textarea></label><div class="db-feedback-meta" id="db-fb-meta"></div><div class="db-feedback-actions"><button class="db-btn-ghost" id="db-fb-cancel">Cancel</button><button class="db-btn-primary" id="db-fb-send">Send Feedback</button></div></div>';
    document.body.appendChild(overlay);
    var meta = {
      domain: location.hostname,
      url: location.href,
      preset: (typeof activePortal !== 'undefined' && activePortal ? activePortal.name : "") + " / " + (typeof activeUploadIndex !== 'undefined' ? activeUploadIndex : ""),
      constraint: (typeof constraint !== 'undefined' && constraint ? getConstraintSummary(constraint) : ""),
      resolution: ""
    };
    try {
      var orig = document.getElementById("db-preview-orig");
      var opt = document.getElementById("db-preview-opt");
      meta.resolution = (orig? orig.width+"x"+orig.height : "") + " → " + (opt? opt.width+"x"+opt.height : "");
    } catch(e) {}
    document.getElementById("db-fb-meta").textContent = "Diagnostics: " + meta.domain + " · " + meta.preset + " · " + meta.resolution;
    overlay.querySelector(".db-feedback-close").onclick = function(){ overlay.remove(); };
    document.getElementById("db-fb-cancel").onclick = function(){ overlay.remove(); };
    overlay.onclick = function(e){ if(e.target===overlay) overlay.remove(); };
    document.getElementById("db-fb-send").onclick = function(){
      var type = document.getElementById("db-fb-type").value;
      var msg = document.getElementById("db-fb-msg").value;
      if (typeof DocBridgeFeedback !== 'undefined') DocBridgeFeedback.send(type, msg, meta);
      else {
        var body = "Issue: "+type+"\nMessage: "+msg+"\nDomain: "+meta.domain+"\nURL: "+meta.url+"\nPreset: "+meta.preset;
        window.location.href = "mailto:support@yourdomain.com?subject="+encodeURIComponent("[DocBridge Feedback] "+type)+"&body="+encodeURIComponent(body);
      }
      overlay.remove();
    };
  }
})();
