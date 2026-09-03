var DocBridgeShare = {
  STORE_URL: "https://chromewebstore.google.com/detail/docbridge",
  whatsapp: function() {
    var text = "Never face SSC/UPSC upload rejections again! Check out DocBridge to resize photos and signatures 100% privately: " + this.STORE_URL;
    return "https://api.whatsapp.com/send?text=" + encodeURIComponent(text);
  },
  linkedin: function() {
    return "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(this.STORE_URL);
  },
  x: function() {
    var text = "Formatting documents for Indian Govt exams used to be painful. DocBridge fixes it on-device with zero privacy leaks!";
    return "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(this.STORE_URL);
  },
  open: function(url) { window.open(url, "_blank", "noopener"); }
};
