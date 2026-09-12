// DocBridge Nudge Banner
(function() {
  "use strict";

  window.addEventListener("docbridge-nudge-init", function(e) {
    showNudge(e.detail.portal, e.detail.upload, e.detail.autoOpen);
  });

  function showNudge(portal, uploads, autoOpen) {
    if (document.getElementById("docbridge-nudge")) return;

    // Handle array of uploads (photo, signature, etc.) - show the first one in hint
    var upload = Array.isArray(uploads) ? uploads[0] : uploads;

    var nudge = document.createElement("div");
    nudge.id = "docbridge-nudge";
    if (autoOpen) nudge.className = "db-assistive";

    // Build inner HTML carefully to avoid quoting issues
    var inner = document.createElement("div");
    inner.className = "db-nudge-inner";

    var top = document.createElement("div");
    top.className = "db-nudge-top";
    var shield = document.createElement("span");
    shield.className = "db-nudge-shield";
    shield.textContent = "\u2724";
    var title = document.createElement("span");
    title.className = "db-nudge-title";
    // If multiple upload types, show generic message
    if (Array.isArray(uploads) && uploads.length > 1) {
      var types = uploads.map(function(u) { return u.type; }).join(", ");
      title.innerHTML = "DocBridge can prepare <strong>" + types + "</strong> for <strong>" + escapeHtml(portal.name) + "</strong>";
    } else {
      title.innerHTML = "DocBridge can prepare this " + upload.type + " for <strong>" + escapeHtml(portal.name) + "</strong>";
    }
    top.appendChild(shield);
    top.appendChild(title);

    var hint = document.createElement("div");
    hint.className = "db-nudge-hint";
    hint.textContent = upload.hint;

    var actions = document.createElement("div");
    actions.className = "db-nudge-actions";

    var btnOpen = document.createElement("button");
    btnOpen.id = "db-nudge-open";
    btnOpen.className = "db-btn-primary";
    btnOpen.textContent = "Open DocBridge";

    var btnDismiss = document.createElement("button");
    btnDismiss.id = "db-nudge-dismiss";
    btnDismiss.className = "db-btn-ghost";
    btnDismiss.textContent = "Dismiss";

    var btnDontShow = document.createElement("button");
    btnDontShow.id = "db-nudge-dontshow";
    btnDontShow.className = "db-btn-ghost db-btn-small";
    btnDontShow.textContent = "Don\u2019t show on this site";

    actions.appendChild(btnOpen);
    actions.appendChild(btnDismiss);
    actions.appendChild(btnDontShow);

    inner.appendChild(top);
    inner.appendChild(hint);
    inner.appendChild(actions);
    nudge.appendChild(inner);

    document.body.appendChild(nudge);

    // Event handlers
    btnOpen.onclick = function() {
      openPanel(portal, uploads);
    };

    function stopVoice(){ try { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); } catch(e) {} }
    btnDismiss.onclick = function() {
      stopVoice();
      nudge.remove();
    };

    btnDontShow.onclick = function() {
      stopVoice();
      var key = "docbridge_dismissed_" + window.location.hostname;
      var obj = {};
      obj[key] = true;
      try { chrome.storage.local.set(obj); } catch(e) {}
      nudge.remove();
    };

    // Assistive (elderly) mode: narrate the nudge and auto-open the panel so
    // the citizen never has to find or click the banner themselves.
    if (autoOpen) {
      var types = Array.isArray(uploads) ? uploads.map(function(u) { return u.type; }).join(" and ") : upload.type;
      speak("DocBridge Assist for " + portal.name + ". Opening " + types + " preparation for you. Choose DigiLocker or upload from your device, and DocBridge will do the rest.");
      setTimeout(function() { openPanel(portal, uploads); }, 1800);
    }
  }

  // Best-effort voice narration (opt-in per site via assistive mode). Never
  // throws — speechSynthesis may be unavailable or blocked.
  function speak(text) {
    try {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      u.pitch = 1;
      u.lang = "en-IN";
      window.speechSynthesis.speak(u);
    } catch (e) { /* voice is optional */ }
  }

  function openPanel(portal, uploads) {
    var existing = document.getElementById("docbridge-nudge");
    if (existing) existing.remove();
    if (document.getElementById("docbridge-panel")) return;
    // panel.js is a bundled content-script (same isolated world) — direct dispatch keeps chrome.* APIs.
    try {
      window.dispatchEvent(new CustomEvent("docbridge-panel-init", {
        detail: { portal: portal, uploads: uploads }
      }));
    } catch(e) {}
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
