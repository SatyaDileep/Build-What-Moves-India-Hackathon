var activePortal=null;
var activeUploadIndex=0;
var activeSiteIsGov=false;

// Launch the full-screen converter workspace in a NEW TAB (not a separate
// window). Used on non-sarkari sites and for standalone mode.
function launchFullscreen(portal, type){
  var params=[];
  if(portal && portal.id) params.push('preset='+encodeURIComponent(portal.id));
  if(type) params.push('type='+encodeURIComponent(type));
  var url=chrome.runtime.getURL('fullscreen/fullscreen.html'+(params.length?'?'+params.join('&'):''));
  try{
    if(chrome.tabs && chrome.tabs.create){
      chrome.tabs.create({url:url, active:true});
      return;
    }
  }catch(e){}
  try{
    if(chrome.windows && chrome.windows.create){
      chrome.windows.create({url:url, type:'normal', state:'maximized', focused:true});
      return;
    }
  }catch(e){}
  try{ window.open(url,'_blank'); }catch(e){}
}

function renderChips(portal){
  var c=document.getElementById('preset-chips');
  var hint=document.getElementById('preset-hint');
  c.innerHTML='';
  if(!portal||!portal.uploads){hint.textContent='';updateCta();return}
  portal.uploads.forEach(function(u,i){
    var b=document.createElement('button');
    b.type='button';
    b.className='popup-chip'+(i===activeUploadIndex?' active':'');
    b.setAttribute('aria-pressed', i===activeUploadIndex ? 'true' : 'false');
    var label=u.type.charAt(0).toUpperCase()+u.type.slice(1);
    var kb=u.constraint.max_kb ? (u.constraint.min_kb?u.constraint.min_kb+'–'+u.constraint.max_kb+'KB': '<'+u.constraint.max_kb+'KB') : '';
    var dims=u.constraint.width_px&&u.constraint.height_px? ' '+u.constraint.width_px+'×'+u.constraint.height_px : '';
    b.textContent=label+' ('+kb+dims+')';
    b.onclick=function(){ activeUploadIndex=i; persistSelection(portal,u); renderChips(portal); };
    c.appendChild(b);
  });
  var sel=portal.uploads[activeUploadIndex];
  hint.textContent= sel? getConstraintSummary(sel.constraint):'';
  updateCta();
}

function updateCta(){
  var btn=document.getElementById('cta-open');
  if(!btn) return;
  if(activePortal && activePortal.uploads && activePortal.uploads[activeUploadIndex]){
    var u=activePortal.uploads[activeUploadIndex];
    var label=u.type.charAt(0).toUpperCase()+u.type.slice(1);
    if(activeSiteIsGov){
      btn.textContent='Open DocBridge ' + label + ' on this page →';
    } else {
      btn.textContent='Open Full-Screen DocBridge '+label+' converter →';
    }
    btn.disabled=false;
  } else {
    btn.textContent='Pick a document type above →';
    btn.disabled=true;
  }
}

function persistSelection(portal, upload){
  try{ chrome.storage.local.set({docbridge_selected:{portalId:portal.id, type:upload.type, constraint:upload.constraint}})}catch(e){}
}

function showDetected(portal){
  var b=document.getElementById('detected-banner');
  if(portal){ b.className='popup-detected show'; b.textContent='🇮🇳 Detected: '+portal.name; }
  else { b.className='popup-detected'; b.textContent=''; }
}

function showCustomFallback(){
  var b=document.getElementById('detected-banner');
  b.className='popup-detected show';
  b.style.background='#EFF6FF'; b.style.borderColor='#BFDBFE';
  var n=(typeof DOCBRIDGE_PORTALS!=='undefined'?DOCBRIDGE_PORTALS.filter(function(p){return p.id.indexOf('mock-')!==0}).length:0);
  b.textContent='ℹ️ This page isn\u2019t a known upload form. Pick from ' + n + ' Sarkari presets below, or define a custom spec.';
  renderChips(null);
}

function fillPortalTags(){
  var list=document.getElementById('portal-list');
  if(!list) return;
  list.innerHTML='';
  var all=(typeof DOCBRIDGE_PORTALS!=='undefined'?DOCBRIDGE_PORTALS:[]).filter(function(p){return p.id.indexOf('mock-')!==0});
  all.forEach(function(p){
    var tag=document.createElement('button');
    tag.type='button';
    tag.className='popup-portal-tag'+(activePortal&&activePortal.id===p.id?' active':'');
    tag.setAttribute('aria-pressed', (activePortal&&activePortal.id===p.id)?'true':'false');
    tag.textContent=p.name;
    tag.onclick=function(){ activePortal=p; activeUploadIndex=0; showDetected(p); renderChips(p); persistSelection(p, p.uploads[0]); renderDropdown(document.getElementById('preset-search').value||''); };
    list.appendChild(tag);
  });
}

function detectActiveTab(){
  var urlEl=document.getElementById('context-url');
  function finalize(url){
    try{
      var u=new URL(url);
      urlEl.textContent=u.hostname;
      var matched=null;
      for(var i=0;i<DOCBRIDGE_PORTALS.length;i++){
        var p=DOCBRIDGE_PORTALS[i];
        if(matchDomain(u.hostname, p.domains)){ matched=p; break; }
      }
      activeSiteIsGov=!!matched && matched.domains.length>0;
      if(matched){ activePortal=matched; activeUploadIndex=0; showDetected(matched); renderChips(matched); }
      else { activePortal=null; showCustomFallback(); }
      fillPortalTags();
    }catch(e){ urlEl.textContent=url||'Unknown'; activeSiteIsGov=false; showCustomFallback(); fillPortalTags(); }
  }
  try{
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
      if(chrome.runtime.lastError||!tabs||!tabs[0]||!tabs[0].url){ finalize(''); return; }
      finalize(tabs[0].url);
    });
  }catch(e){
    try{ chrome.storage.local.get('docbridge_selected',function(d){
      if(d.docbridge_selected){
        var pid=d.docbridge_selected.portalId;
        var found=DOCBRIDGE_PORTALS.find(function(p){return p.id===pid});
        if(found){ activePortal=found; activeUploadIndex=found.uploads.findIndex(function(u){return u.type===d.docbridge_selected.type}); if(activeUploadIndex<0) activeUploadIndex=0; showDetected(found); renderChips(found);}
      }
      finalize('');
    })}catch(err){ finalize(''); }
  }
}

function buildPresetOptions(){
  var opts=[];
  DOCBRIDGE_PORTALS.forEach(function(p){
    if(p.id.indexOf('mock-')===0) return;
    p.uploads.forEach(function(u){
      opts.push({portal:p, upload:u, label:p.name+' — '+(u.type.charAt(0).toUpperCase()+u.type.slice(1))+' | '+u.hint});
    });
  });
  return opts;
}
var PRESET_OPTIONS=buildPresetOptions();

function renderDropdown(q){
  var dd=document.getElementById('preset-dropdown');
  var query=(q||'').toLowerCase().trim();
  var filtered=query? PRESET_OPTIONS.filter(function(o){return o.label.toLowerCase().indexOf(query)>=0}): PRESET_OPTIONS.slice(0,12);
  dd.innerHTML='';
  if(!filtered.length){ var e=document.createElement('div'); e.className='popup-dd-empty'; e.textContent='No presets match.'; dd.appendChild(e); return; }
  filtered.slice(0,30).forEach(function(o){
    var row=document.createElement('button');
    row.className='popup-dd-row';
    row.textContent=o.label;
    row.onclick=function(){
      activePortal=o.portal;
      activeUploadIndex=o.portal.uploads.indexOf(o.upload);
      showDetected(o.portal); renderChips(o.portal); persistSelection(o.portal,o.upload);
      document.getElementById('preset-search').value=o.portal.name+' '+o.upload.type;
      dd.innerHTML='';
    };
    dd.appendChild(row);
  });
}

function readCustomInputs(){
  function num(id){ var v=parseInt(document.getElementById(id).value,10); return isNaN(v)?null:v; }
  return { maxKB:num('custom-maxkb'), minKB:num('custom-minkb'), w:num('custom-w'), h:num('custom-h') };
}
function validateCustom(v){
  var errs=[];
  var fields={};
  if(v.maxKB==null||v.maxKB<1||v.maxKB>1024){ errs.push('Max KB is required (1–1024).'); fields.max=true; }
  if(v.minKB!=null&&(v.minKB<0||v.minKB>1024)){ errs.push('Min KB must be 0–1024.'); fields.min=true; }
  if(v.minKB!=null&&v.maxKB!=null&&v.minKB>v.maxKB){ errs.push('Min KB can\u2019t exceed Max KB.'); fields.min=true; fields.max=true; }
  if((v.w==null)!==(v.h==null)){ errs.push('Width and height go together — fill both or neither.'); fields.w=true; fields.h=true; }
  if(v.w!=null&&(v.w<10||v.w>3000)){ errs.push('Width must be 10–3000 px.'); fields.w=true; }
  if(v.h!=null&&(v.h<10||v.h>3000)){ errs.push('Height must be 10–3000 px.'); fields.h=true; }
  return { errs:errs, fields:fields };
}
function paintCustomErrors(fields){
  var map={'custom-maxkb':fields.max,'custom-minkb':fields.min,'custom-w':fields.w,'custom-h':fields.h};
  Object.keys(map).forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.classList.toggle('invalid', !!map[id]);
  });
}
function initCustom(){
  var s=document.getElementById('preset-search');
  s.addEventListener('input',function(){ renderDropdown(this.value); });
  s.addEventListener('focus',function(){ renderDropdown(this.value); });
  var ids=['custom-maxkb','custom-minkb','custom-w','custom-h'];
  ids.forEach(function(id){
    document.getElementById(id).addEventListener('input',function(){
      var v=readCustomInputs();
      var r=validateCustom(v);
      var errBox=document.getElementById('custom-error');
      if(r.errs.length){ errBox.style.display='block'; errBox.textContent=r.errs[0]; }
      else { errBox.style.display='none'; errBox.textContent=''; }
      paintCustomErrors(r.fields);
      document.getElementById('custom-apply').disabled = r.errs.length>0;
    });
  });
  document.getElementById('custom-apply').onclick=function(){
    var v=readCustomInputs();
    var r=validateCustom(v);
    paintCustomErrors(r.fields);
    var errBox=document.getElementById('custom-error');
    if(r.errs.length){ errBox.style.display='block'; errBox.textContent=r.errs.join(' '); document.getElementById('custom-summary').textContent=''; return; }
    errBox.style.display='none'; errBox.textContent='';
    var constraint={format:'jpeg', bg_color:'white', max_kb:v.maxKB};
    if(v.minKB!=null) constraint.min_kb=v.minKB;
    if(v.w!=null) constraint.width_px=v.w;
    if(v.h!=null) constraint.height_px=v.h;
    if(v.w!=null&&v.h!=null) constraint.aspect_ratio=v.w/v.h;
    var customPortal={id:'custom-manual', name:'Custom Sarkari Spec', uploads:[{type:'photo', hint:getConstraintSummary(constraint), constraint:constraint}]};
    activePortal=customPortal; activeUploadIndex=0; showDetected(customPortal); renderChips(customPortal); persistSelection(customPortal, customPortal.uploads[0]);
    document.getElementById('custom-summary').textContent='✓ '+getConstraintSummary(constraint);
  };
  document.getElementById('custom-apply').disabled=true;
  renderDropdown('');
}
function initCta(){
  var btn=document.getElementById('cta-open');
  var status=document.getElementById('cta-status');
  if(!btn) return;
  btn.onclick=function(){
    var u=activeConstraint();
    if(!activeSiteIsGov || !u){
      // Non-sarkari site or standalone intent → full-screen workspace.
      launchFullscreen(u?u.portal:activePortal, u?u.upload.type:null);
      return;
    }
    status.style.display='block';
    try{
      chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        if(chrome.runtime.lastError||!tabs||!tabs[0]||!tabs[0].id){ status.textContent='Couldn\u2019t reach this tab. Open a gov portal page and try again.'; return; }
        var tab=tabs[0];
        if(!/^https?:\/\//i.test(tab.url||'')){ status.textContent='Open a website tab first (this page can\u2019t run DocBridge).'; return; }
        btn.disabled=true; btn.textContent='Opening…';
        try{
          chrome.tabs.sendMessage(tab.id,{type:'DOCBRIDGE_OPEN_PANEL'},function(){
            if(chrome.runtime.lastError){ status.textContent='Reload the page once, then click again — the helper loads on page open.'; }
            else { status.textContent='✓ DocBridge panel requested. Look at the page behind this popup.'; }
            updateCta();
          });
        }catch(e){ status.textContent='Couldn\u2019t message the page. Reload it and try again.'; updateCta(); }
      });
    }catch(e){ status.textContent='Couldn\u2019t reach this tab. Try again.'; }
  };
}

chrome.storage.local.get(['docbridge_stats','docbridge_nudge_enabled','docbridge_assist_mode','docbridge_selected'],function(data){
  var stats=data.docbridge_stats||{processed:0};
  var sp=document.getElementById('stat-processed'); if(sp) sp.textContent=stats.processed||0;
  document.getElementById('toggle-nudge').checked=data.docbridge_nudge_enabled!==false;
  document.getElementById('toggle-assist').checked=data.docbridge_assist_mode==='assistive';
  if(data.docbridge_selected){
    var pid=data.docbridge_selected.portalId;
    var found=(typeof DOCBRIDGE_PORTALS!=='undefined'?DOCBRIDGE_PORTALS.find(function(p){return p.id===pid}):null);
    if(found && !activePortal){
      activePortal=found;
      activeUploadIndex=found.uploads.findIndex(function(u){return u.type===data.docbridge_selected.type});
      if(activeUploadIndex<0) activeUploadIndex=0;
    }
  }
});
document.getElementById('toggle-nudge').addEventListener('change',function(){ chrome.storage.local.set({docbridge_nudge_enabled:this.checked}); });
document.getElementById('toggle-assist').addEventListener('change',function(){ chrome.storage.local.set({docbridge_assist_mode:this.checked?'assistive':'standard'}); });
document.addEventListener('click',function(e){
  var dd=document.getElementById('preset-dropdown');
  var s=document.getElementById('preset-search');
  if(!dd.contains(e.target) && e.target!==s){ dd.innerHTML=''; }
});
function activeConstraint(){
  if(activePortal&&activePortal.uploads&&activePortal.uploads[activeUploadIndex])
    return { upload:activePortal.uploads[activeUploadIndex], portal:activePortal };
  return null;
}
function initStandalone(){
  var drop=document.getElementById('standalone-drop');
  if(!drop) return;
  var input=document.getElementById('standalone-file');
  function open(){
    var u=activeConstraint();
    launchFullscreen(u?u.portal:null, u?u.upload.type:null);
  }
  drop.onclick=open;
  drop.onkeydown=function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } };
  // Dragging a file anywhere onto the zone also launches the workspace — the
  // big screen is where the file lands and gets prepared.
  ['dragover','dragenter'].forEach(function(ev){ drop.addEventListener(ev,function(e){ e.preventDefault(); drop.classList.add('drag'); }); });
  ['dragleave','drop'].forEach(function(ev){ drop.addEventListener(ev,function(e){ e.preventDefault(); drop.classList.remove('drag'); }); });
}

function initOpenAiKey(){
  var el=document.getElementById('openai-key');
  if(!el) return;
  function paintStatus(){
    var st=document.getElementById('ai-status');
    if(!st) return;
    var v=(el.value||'').trim();
    if(!v){ st.textContent='AI background removal is off — add a key to enable it (per-use confirmation always).'; return; }
    try{
      if(chrome.permissions&&chrome.permissions.contains){
        chrome.permissions.contains({origins:['https://api.openai.com/*']},function(granted){
          st.textContent=granted
            ?'✓ AI background removal ready — nothing is sent until you confirm, each time.'
            :'Key saved — OpenAI access will be requested on first AI use.';
        });
      } else {
        st.textContent='Key saved — AI background removal will ask before sending anything.';
      }
    }catch(e){ st.textContent='Key saved.'; }
  }
  try{ chrome.storage.local.get('docbridge_openai_key',function(d){ if(d&&d.docbridge_openai_key) el.value=d.docbridge_openai_key; paintStatus(); }); }catch(e){}
  el.addEventListener('change',function(){
    var v=(el.value||'').trim();
    try{ chrome.storage.local.set({docbridge_openai_key:v}); }catch(e){}
    if(v){ try{ if(chrome.permissions&&chrome.permissions.request) chrome.permissions.request({origins:['https://api.openai.com/*']},function(){ paintStatus(); }); else paintStatus(); }catch(e){ paintStatus(); } }
    else paintStatus();
  });
}
detectActiveTab();
initCustom();
initCta();
initStandalone();
initOpenAiKey();
fillPortalTags();
