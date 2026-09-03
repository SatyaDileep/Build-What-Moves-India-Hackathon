// DocBridge Nudge Banner
(function() {
  "use strict";

  window.addEventListener("docbridge-nudge-init", function(e) {
    showNudge(e.detail.portal, e.detail.upload);
  });

  function showNudge(portal, upload) {
    if (document.getElementById("docbridge-nudge")) return;

    var nudge = document.createElement("div");
    nudge.id = "docbridge-nudge";

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
    title.innerHTML = "DocBridge can prepare this photo for <strong>" + escapeHtml(portal.name) + "</strong>";
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
      openPanel(portal, upload);
    };

    btnDismiss.onclick = function() {
      nudge.remove();
    };

    btnDontShow.onclick = function() {
      var key = "docbridge_dismissed_" + window.location.hostname;
      var obj = {};
      obj[key] = true;
      chrome.storage.local.set(obj);
      nudge.remove();
    };
  }

  function openPanel(portal, upload) {
    var existing = document.getElementById("docbridge-nudge");
    if (existing) existing.remove();

    // Load panel.js as a web-accessible resource
    var script = document.createElement("script");
    script.src = chrome.runtime.getURL("content/panel.js");
    script.onload = function() {
      this.remove();
      window.dispatchEvent(new CustomEvent("docbridge-panel-init", {
        detail: { portal: portal, upload: upload }
      }));
    };
    (document.head || document.documentElement).appendChild(script);
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
