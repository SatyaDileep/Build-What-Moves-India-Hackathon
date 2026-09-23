// DocBridge AI module (BYOK) — cloud background removal for white-background
// slots, paid for by the citizen's own OpenAI key.
//
// Privacy contract (mirrors the web app's consent-gated AI verify):
// NOTHING leaves the device until the citizen explicitly confirms, per use.
// The key lives only in chrome.storage.local (this browser). The on-device
// parametric cleanup stays the default; this module is strictly opt-in.
var DocBridgeAI = (function() {
  "use strict";

  var API_URL = "https://api.openai.com/v1/images/edits";
  var MODEL = "gpt-image-1";
  var KEY_NAME = "docbridge_openai_key";
  var ORIGIN = "https://api.openai.com/*";

  var PROMPT = "Edit this ID photograph: keep the person exactly identical (same face, clothing, pose and framing), replace the entire background with a flat pure-white (#FFFFFF) studio background with no shadows, objects, watermarks or text. Clean passport-photo style.";

  function getKey() {
    return new Promise(function(res) {
      try {
        chrome.storage.local.get(KEY_NAME, function(d) {
          var k = d && d[KEY_NAME] ? String(d[KEY_NAME]).trim() : "";
          res(k || null);
        });
      } catch (e) { res(null); }
    });
  }

  function saveKey(k) {
    return new Promise(function(res) {
      try {
        var o = {};
        o[KEY_NAME] = k;
        chrome.storage.local.set(o, function() { res(true); });
      } catch (e) { res(false); }
    });
  }

  // Best-effort permission request. Returns true/false where the
  // chrome.permissions API exists (popup, fullscreen page), null inside
  // content scripts where it is unavailable — callers must degrade honestly.
  function requestPermission() {
    return new Promise(function(res) {
      try {
        if (chrome.permissions && chrome.permissions.request) {
          chrome.permissions.request({ origins: [ORIGIN] }, function(g) { res(!!g); });
        } else {
          res(null);
        }
      } catch (e) { res(null); }
    });
  }

  function blobToFile(blob, name) {
    try { return new File([blob], name || "source.png", { type: blob.type || "image/png" }); }
    catch (e) { return blob; }
  }

  async function removeBackground(srcBlob, key) {
    var ctrl = new AbortController();
    var timer = setTimeout(function() { try { ctrl.abort(); } catch (e) {} }, 120000);
    try {
      var fd = new FormData();
      fd.append("model", MODEL);
      fd.append("prompt", PROMPT);
      fd.append("size", "1024x1536");
      fd.append("image", blobToFile(srcBlob, "source.png"));
      var r = await fetch(API_URL, {
        method: "POST",
        headers: { "Authorization": "Bearer " + key },
        body: fd,
        signal: ctrl.signal
      });
      if (!r.ok) {
        var msg = "OpenAI returned " + r.status + ". Your on-device file is untouched.";
        if (r.status === 401) msg = "OpenAI rejected this key (401). Check it in Settings — nothing was changed.";
        else if (r.status === 429) msg = "OpenAI is rate-limiting (429). Wait a minute and try again.";
        else if (r.status === 400) {
          try {
            var j = await r.json();
            var detail = j && j.error && j.error.message ? String(j.error.message) : "bad request";
            msg = "OpenAI refused this image: " + detail.slice(0, 160);
          } catch (e) {}
        }
        throw new Error(msg);
      }
      var data = await r.json();
      var b64 = data && data.data && data.data[0] && data.data[0].b64_json;
      if (!b64) throw new Error("OpenAI returned no image. Try the on-device cleanup instead.");
      var bin = atob(b64);
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new Blob([bytes], { type: "image/png" });
    } catch (e) {
      if (e && e.name === "AbortError") throw new Error("AI took too long (over 2 minutes). Your on-device file is untouched — try again or use on-device cleanup.");
      if (e instanceof TypeError) throw new Error("Could not reach OpenAI from here (network or site permission). Open the Full-Screen converter — it can request access — or check your key.");
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }

  // Full pipeline: cloud cutout, then OUR engine re-fits it to the portal's
  // exact pixel box + KB band, so an AI result can never silently break spec.
  // The citizen's original is preserved for honest before/after.
  async function cleanupToSpec(userFile, constraint) {
    var key = await getKey();
    if (!key) { var err = new Error("NO_KEY"); err.code = "NO_KEY"; throw err; }
    await requestPermission();
    var aiBlob = await removeBackground(userFile, key);
    var aiCanvas = await DocBridgeProcessor.fileToCanvas(aiBlob);
    var aiFile = blobToFile(aiBlob, "ai-background.png");
    var r = await DocBridgeProcessor.runOptimize(aiCanvas, aiFile, constraint, "jpeg", null);
    var ow = 0, oh = 0;
    try {
      var uc = await DocBridgeProcessor.fileToCanvas(userFile);
      ow = uc.width; oh = uc.height;
    } catch (e) {}
    r.original = { blob: userFile, size_kb: userFile.size / 1024, width: ow, height: oh, format: detectFileFormat(userFile) };
    r.optimized.aiCleaned = "cloud";
    var note = "AI-recomposed on white — inspect edges at 2× zoom before upload.";
    r.optimized.warning = r.optimized.warning ? r.optimized.warning + " " + note : note;
    return r;
  }

  // Shared consent card (db-ai-* classes live in styles/content.css, which
  // both the portal panel and the fullscreen page load).
  // opts: { hasKey:boolean, compact:boolean,
  //         onConfirm:function(key), onCancel:function() }
  function buildConsentCard(opts) {
    var card = document.createElement("div");
    card.className = "db-ai-consent";

    var title = document.createElement("div");
    title.className = "db-ai-consent-title";
    title.textContent = "\uD83E\uDD16 Send this photo to AI?";
    card.appendChild(title);

    var list = document.createElement("ul");
    list.className = "db-ai-consent-list";
    [
      "Only this image leaves your device — sent to OpenAI using YOUR key.",
      "Your key stays in this browser. Nothing is sent until you confirm.",
      "Your on-device file above stays valid either way."
    ].forEach(function(t) {
      var li = document.createElement("li");
      li.textContent = t;
      list.appendChild(li);
    });
    card.appendChild(list);

    var keyInput = null;
    if (!opts.hasKey) {
      var keyRow = document.createElement("label");
      keyRow.className = "db-ai-keyrow";
      var keyLabel = document.createElement("span");
      keyLabel.textContent = "OpenAI API key (stored only in this browser)";
      keyInput = document.createElement("input");
      keyInput.type = "password";
      keyInput.placeholder = "sk-…";
      keyInput.autocomplete = "off";
      keyInput.className = "db-ai-keyinput";
      keyRow.appendChild(keyLabel);
      keyRow.appendChild(keyInput);
      card.appendChild(keyRow);
    }

    var status = document.createElement("div");
    status.className = "db-ai-consent-status";
    status.style.display = "none";
    card.appendChild(status);

    var actions = document.createElement("div");
    actions.className = "db-ai-consent-actions";

    var cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "db-btn-ghost";
    cancel.textContent = "Not now";
    cancel.onclick = function() { opts.onCancel(); };

    var go = document.createElement("button");
    go.type = "button";
    go.className = "db-btn-primary";
    go.textContent = "Yes, enhance with AI";
    go.onclick = function() {
      var k = opts.hasKey ? null : (keyInput && keyInput.value || "").trim();
      if (!opts.hasKey && !k) {
        status.style.display = "block";
        status.textContent = "Paste your OpenAI key first — or use the on-device cleanup, which needs no key.";
        try { keyInput.focus(); } catch (e) {}
        return;
      }
      go.disabled = true;
      go.textContent = "AI is recomposing the background…";
      status.style.display = "block";
      status.textContent = "Sending this image to OpenAI now (this can take up to a minute)…";
      opts.onConfirm(k);
    };

    actions.appendChild(cancel);
    actions.appendChild(go);
    card.appendChild(actions);
    card._status = status;
    card._go = go;
    return card;
  }

  return {
    getKey: getKey,
    saveKey: saveKey,
    requestPermission: requestPermission,
    removeBackground: removeBackground,
    cleanupToSpec: cleanupToSpec,
    buildConsentCard: buildConsentCard,
    KEY_NAME: KEY_NAME
  };
})();
