// DocBridge AI module (BYOK) — cloud background removal for white-background
// slots, paid for by the citizen's own key from any of 3 providers:
// OpenAI (gpt-image-1), Google Gemini (Flash Image), Stability AI (SD3).
//
// Privacy contract (mirrors the web app's consent-gated AI verify):
// NOTHING leaves the device until the citizen explicitly confirms, per use.
// Keys live only in chrome.storage.local (this browser), one slot per
// provider. The on-device parametric cleanup stays the default; this module
// is strictly opt-in.
var DocBridgeAI = (function() {
  "use strict";

  var PROVIDERS = {
    openai: {
      label: "OpenAI", model: "gpt-image-1",
      keyName: "docbridge_openai_key", origin: "https://api.openai.com/*",
      placeholder: "sk-…", keyUrl: "https://platform.openai.com/api-keys"
    },
    gemini: {
      label: "Google Gemini", model: "gemini-2.5-flash-image",
      keyName: "docbridge_gemini_key", origin: "https://generativelanguage.googleapis.com/*",
      placeholder: "AIza…", keyUrl: "https://aistudio.google.com/apikey"
    },
    stability: {
      label: "Stability AI", model: "sd3.5-large",
      keyName: "docbridge_stability_key", origin: "https://api.stability.ai/*",
      placeholder: "sk-…", keyUrl: "https://platform.stability.ai/account/keys"
    }
  };
  var PROVIDER_ORDER = ["openai", "gemini", "stability"];
  var PROVIDER_STORE = "docbridge_ai_provider";
  var DEFAULT_PROVIDER = "openai";

  var PROMPT = "Edit this ID photograph: keep the person exactly identical (same face, clothing, pose and framing), replace the entire background with a flat pure-white (#FFFFFF) studio background with no shadows, objects, watermarks or text. Clean passport-photo style.";

  function providerDef(p) {
    return PROVIDERS[p] || PROVIDERS[DEFAULT_PROVIDER];
  }

  function listProviders() { return PROVIDER_ORDER.slice(); }

  function getProvider() {
    return new Promise(function(res) {
      try {
        chrome.storage.local.get(PROVIDER_STORE, function(d) {
          var p = d && d[PROVIDER_STORE];
          res(PROVIDERS[p] ? p : DEFAULT_PROVIDER);
        });
      } catch (e) { res(DEFAULT_PROVIDER); }
    });
  }

  function setProvider(p) {
    return new Promise(function(res) {
      try {
        if (!PROVIDERS[p]) p = DEFAULT_PROVIDER;
        var o = {};
        o[PROVIDER_STORE] = p;
        chrome.storage.local.set(o, function() { res(p); });
      } catch (e) { res(DEFAULT_PROVIDER); }
    });
  }

  function getKey(provider) {
    var def = providerDef(provider);
    return new Promise(function(res) {
      try {
        chrome.storage.local.get(def.keyName, function(d) {
          var k = d && d[def.keyName] ? String(d[def.keyName]).trim() : "";
          res(k || null);
        });
      } catch (e) { res(null); }
    });
  }

  function saveKey(provider, k) {
    var def = providerDef(provider);
    return new Promise(function(res) {
      try {
        var o = {};
        o[def.keyName] = k;
        chrome.storage.local.set(o, function() { res(true); });
      } catch (e) { res(false); }
    });
  }

  // Best-effort permission request. Returns true/false where the
  // chrome.permissions API exists (popup, fullscreen page), null inside
  // content scripts where it is unavailable — callers must degrade honestly.
  function requestPermission(provider) {
    var def = providerDef(provider);
    return new Promise(function(res) {
      try {
        if (chrome.permissions && chrome.permissions.request) {
          chrome.permissions.request({ origins: [def.origin] }, function(g) { res(!!g); });
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

  function b64ToBlob(b64, mime) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime || "image/png" });
  }

  function blobToB64(blob) {
    return new Promise(function(res, rej) {
      try {
        var r = new FileReader();
        r.onload = function() {
          var s = String(r.result || "");
          var i = s.indexOf("base64,");
          res(i >= 0 ? s.slice(i + 7) : s);
        };
        r.onerror = function() { rej(new Error("Could not read that image.")); };
        r.readAsDataURL(blob);
      } catch (e) { rej(new Error("Could not read that image.")); }
    });
  }

  // ---- Provider implementations (each: Blob in, PNG/JPEG Blob out) ----

  async function openaiRemove(srcBlob, key, signal) {
    var fd = new FormData();
    fd.append("model", PROVIDERS.openai.model);
    fd.append("prompt", PROMPT);
    fd.append("size", "1024x1536");
    fd.append("image", blobToFile(srcBlob, "source.png"));
    var r = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key },
      body: fd,
      signal: signal
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
    return b64ToBlob(b64, "image/png");
  }

  async function geminiRemove(srcBlob, key, signal) {
    var def = PROVIDERS.gemini;
    var b64 = await blobToB64(srcBlob);
    var mime = (srcBlob.type && srcBlob.type.indexOf("image/") === 0) ? srcBlob.type : "image/png";
    var r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + def.model + ":generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      signal: signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }, { inline_data: { mime_type: mime, data: b64 } }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
      })
    });
    if (!r.ok) {
      var gmsg = "Gemini returned " + r.status + ". Your on-device file is untouched.";
      if (r.status === 400) {
        try {
          var gj = await r.json();
          var gdetail = gj && gj.error && gj.error.message ? String(gj.error.message) : "";
          gmsg = gdetail && gdetail.indexOf("API key") >= 0
            ? "Gemini rejected this key (400). Check it in Settings — nothing was changed."
            : "Gemini refused this image: " + (gdetail || "bad request").slice(0, 160);
        } catch (e) {}
      }
      else if (r.status === 404) gmsg = "Gemini model name changed (404). Update DocBridge or try another provider.";
      else if (r.status === 429) gmsg = "Gemini is rate-limiting (429). Wait a minute and try again.";
      throw new Error(gmsg);
    }
    var gdata = await r.json();
    var parts = gdata && gdata.candidates && gdata.candidates[0] && gdata.candidates[0].content && gdata.candidates[0].content.parts;
    var out = null;
    if (parts) {
      for (var i = 0; i < parts.length; i++) {
        var inl = parts[i].inlineData || parts[i].inline_data;
        if (inl && inl.data) { out = { mime: inl.mimeType || inl.mime_type || "image/png", data: inl.data }; break; }
      }
    }
    if (!out) throw new Error("Gemini returned no image. Try the on-device cleanup instead.");
    return b64ToBlob(out.data, out.mime);
  }

  async function stabilityRemove(srcBlob, key, signal) {
    var def = PROVIDERS.stability;
    var fd = new FormData();
    fd.append("prompt", PROMPT);
    fd.append("mode", "image-to-image");
    fd.append("model", def.model);
    fd.append("strength", "0.45");
    fd.append("output_format", "png");
    fd.append("init_image", blobToFile(srcBlob, "source.png"));
    var r = await fetch("https://api.stability.ai/v2beta/stable-image/generate/sd3", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Accept": "image/*" },
      body: fd,
      signal: signal
    });
    if (!r.ok) {
      var smsg = "Stability AI returned " + r.status + ". Your on-device file is untouched.";
      if (r.status === 401) smsg = "Stability AI rejected this key (401). Check it in Settings — nothing was changed.";
      else if (r.status === 402) smsg = "Stability AI: out of credits (402). Top up, or try another provider.";
      else if (r.status === 429) smsg = "Stability AI is rate-limiting (429). Wait a minute and try again.";
      else if (r.status === 422) smsg = "Stability AI refused this image (422). Try a clearer photo, or another provider.";
      throw new Error(smsg);
    }
    var blob = await r.blob();
    if (!blob || !blob.size) throw new Error("Stability AI returned no image. Try the on-device cleanup instead.");
    return blob.type ? blob : new Blob([blob], { type: "image/png" });
  }

  var REMOVERS = { openai: openaiRemove, gemini: geminiRemove, stability: stabilityRemove };

  function providerLabel(p) { return providerDef(p).label; }

  async function removeBackground(srcBlob, provider, key) {
    var p = PROVIDERS[provider] ? provider : DEFAULT_PROVIDER;
    var ctrl = new AbortController();
    var timer = setTimeout(function() { try { ctrl.abort(); } catch (e) {} }, 120000);
    try {
      return await REMOVERS[p](srcBlob, key, ctrl.signal);
    } catch (e) {
      if (e && e.name === "AbortError") throw new Error("AI took too long (over 2 minutes). Your on-device file is untouched — try again or use on-device cleanup.");
      if (e instanceof TypeError) throw new Error("Could not reach " + providerLabel(p) + " from here (network or site permission). Open the Full-Screen converter — it can request access — or check your key.");
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }

  // Full pipeline: cloud cutout, then OUR engine re-fits it to the portal's
  // exact pixel box + KB band, so an AI result can never silently break spec.
  // The citizen's original is preserved for honest before/after.
  async function cleanupToSpec(userFile, constraint, provider) {
    var p = PROVIDERS[provider] ? provider : DEFAULT_PROVIDER;
    var key = await getKey(p);
    if (!key) { var err = new Error("NO_KEY"); err.code = "NO_KEY"; throw err; }
    await requestPermission(p);
    var aiBlob = await removeBackground(userFile, p, key);
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
  // opts: { provider:string, providerHasKey:function(p)->Promise<bool>,
  //         onConfirm:function(provider, typedKeyOrNull), onCancel:function() }
  function buildConsentCard(opts) {
    var card = document.createElement("div");
    card.className = "db-ai-consent";

    var title = document.createElement("div");
    title.className = "db-ai-consent-title";
    title.textContent = "\uD83E\uDD16 Send this photo to AI?";
    card.appendChild(title);

    var provRow = document.createElement("label");
    provRow.className = "db-ai-keyrow";
    var provLabel = document.createElement("span");
    provLabel.textContent = "AI provider (your own key)";
    var provSel = document.createElement("select");
    provSel.className = "db-ai-keyinput";
    PROVIDER_ORDER.forEach(function(p) {
      var o = document.createElement("option");
      o.value = p;
      o.textContent = PROVIDERS[p].label + " · " + PROVIDERS[p].model;
      provSel.appendChild(o);
    });
    provSel.value = PROVIDERS[opts.provider] ? opts.provider : DEFAULT_PROVIDER;
    provRow.appendChild(provLabel);
    provRow.appendChild(provSel);
    card.appendChild(provRow);

    var list = document.createElement("ul");
    list.className = "db-ai-consent-list";
    var bullets = list;
    function paintBullets() {
      bullets.innerHTML = "";
      [
        "Only this image leaves your device — sent to " + providerLabel(provSel.value) + " using YOUR key.",
        "Your key stays in this browser. Nothing is sent until you confirm.",
        "No zero-retention: " + providerLabel(provSel.value) + " processes this photo under its own data policy — retention and safety review may apply.",
        "Your on-device file above stays valid either way."
      ].forEach(function(t) {
        var li = document.createElement("li");
        li.textContent = t;
        bullets.appendChild(li);
      });
    }
    paintBullets();
    card.appendChild(list);

    var keyRow = document.createElement("label");
    keyRow.className = "db-ai-keyrow";
    keyRow.style.display = "none";
    var keyLabel = document.createElement("span");
    keyRow.appendChild(keyLabel);
    var keyInput = document.createElement("input");
    keyInput.type = "password";
    keyInput.autocomplete = "off";
    keyInput.className = "db-ai-keyinput";
    keyRow.appendChild(keyInput);
    card.appendChild(keyRow);

    var status = document.createElement("div");
    status.className = "db-ai-consent-status";
    status.style.display = "none";
    card.appendChild(status);

    function refreshKeyRow() {
      var def = providerDef(provSel.value);
      keyLabel.textContent = def.label + " API key (stored only in this browser) — get one at " + def.keyUrl;
      keyInput.placeholder = def.placeholder;
      opts.providerHasKey(provSel.value).then(function(has) {
        keyRow.style.display = has ? "none" : "flex";
        keyInput.value = "";
      });
      paintBullets();
    }
    provSel.onchange = refreshKeyRow;
    refreshKeyRow();

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
      var needKey = keyRow.style.display !== "none";
      var k = needKey ? (keyInput.value || "").trim() : null;
      if (needKey && !k) {
        status.style.display = "block";
        status.textContent = "Paste your " + providerLabel(provSel.value) + " key first — or use the on-device cleanup, which needs no key.";
        try { keyInput.focus(); } catch (e) {}
        return;
      }
      go.disabled = true;
      go.textContent = "AI is recomposing the background…";
      status.style.display = "block";
      status.textContent = "Sending this image to " + providerLabel(provSel.value) + " now (this can take up to a minute)…";
      opts.onConfirm(provSel.value, k);
    };

    actions.appendChild(cancel);
    actions.appendChild(go);
    card.appendChild(actions);
    card._status = status;
    card._go = go;
    return card;
  }

  return {
    listProviders: listProviders,
    providerLabel: providerLabel,
    providerDef: providerDef,
    getProvider: getProvider,
    setProvider: setProvider,
    getKey: getKey,
    saveKey: saveKey,
    requestPermission: requestPermission,
    removeBackground: removeBackground,
    cleanupToSpec: cleanupToSpec,
    buildConsentCard: buildConsentCard
  };
})();
