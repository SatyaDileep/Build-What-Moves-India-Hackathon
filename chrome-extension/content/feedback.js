var DocBridgeFeedback = {
  MAILTO: "support@yourdomain.com",
  WEBHOOK_URL: "",
  buildBody: function(issueType, message, meta) {
    var lines = [
      "Issue Type: " + issueType,
      "Message: " + (message || "(none)"),
      "",
      "--- Diagnostics ---",
      "Domain: " + (meta.domain || location.hostname),
      "URL: " + (meta.url || location.href),
      "Preset: " + (meta.preset || "unknown"),
      "Constraint: " + (meta.constraint || ""),
      "Resolution: " + (meta.resolution || ""),
      "UserAgent: " + navigator.userAgent
    ];
    return lines.join("\n");
  },
  send: function(issueType, message, meta) {
    var body = this.buildBody(issueType, message, meta);
    var subject = "[DocBridge Feedback] " + issueType;
    var mailto = "mailto:" + this.MAILTO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    if (this.WEBHOOK_URL) {
      try {
        fetch(this.WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ issueType: issueType, message: message, meta: meta, body: body })
        }).catch(function(){});
      } catch(e) {}
    }
    window.location.href = mailto;
  }
};
