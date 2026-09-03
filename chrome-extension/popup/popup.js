var activePortal=null;
var activeUploadIndex=0;

function renderChips(portal){
  var c=document.getElementById('preset-chips');
  var hint=document.getElementById('preset-hint');
  c.innerHTML='';
  if(!portal||!portal.uploads){hint.textContent='';return}
  portal.uploads.forEach(function(u,i){
    var b=document.createElement('button');
    b.className='popup-chip'+(i===activeUploadIndex?' active':'');
    var label=u.type.charAt(0).toUpperCase()+u.type.slice(1);
    var kb=u.constraint.max_kb ? (u.constraint.min_kb?u.constraint.min_kb+'–'+u.constraint.max_kb+'KB': '<'+u.constraint.max_kb+'KB') : '';
    var dims=u.constraint.width_px&&u.constraint.height_px? ' '+u.constraint.width_px+'×'+u.constraint.height_px : '';
    b.textContent=label+' ('+kb+dims+')';
    b.onclick=function(){ activeUploadIndex=i; persistSelection(portal,u); renderChips(portal); };
    c.appendChild(b);
  });
  var sel=portal.uploads[activeUploadIndex];
  hint.textContent= sel? getConstraintSummary(sel.constraint):'';
  document.getElementById('stat-saved').textContent= sel? sel.type : '—';
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
  b.textContent='ℹ️ Portal Not Auto-Indexed: Select from 50+ Sarkari Presets or Custom KB/Pixel Mode.';
  renderChips(null);
}

function fillPortalTags(){
  var list=document.getElementById('portal-list');
  if(!list) return;
  list.innerHTML='';
  var all=(typeof DOCBRIDGE_PORTALS!=='undefined'?DOCBRIDGE_PORTALS:[]).filter(function(p){return p.id.indexOf('mock-')!==0});
  all.forEach(function(p){
    var tag=document.createElement('span');
    tag.className='popup-portal-tag'+(activePortal&&activePortal.id===p.id?' active':'');
    tag.textContent=p.name;
    tag.onclick=function(){ activePortal=p; activeUploadIndex=0; showDetected(p); renderChips(p); renderDropdown(document.getElementById('preset-search').value||''); };
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
        if(matchDomain(u.hostname, p.domains) && matchUrlPatterns(u.pathname, p.urlPatterns)){ matched=p; break; }
      }
      if(matched){ activePortal=matched; activeUploadIndex=0; showDetected(matched); renderChips(matched); }
      else { activePortal=null; showCustomFallback(); }
      fillPortalTags();
    }catch(e){ urlEl.textContent=url||'Unknown'; showCustomFallback(); fillPortalTags(); }
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

function initCustom(){
  var s=document.getElementById('preset-search');
  s.addEventListener('input',function(){ renderDropdown(this.value); });
  s.addEventListener('focus',function(){ renderDropdown(this.value); });
  document.getElementById('custom-apply').onclick=function(){
    var maxKB=parseInt(document.getElementById('custom-maxkb').value,10);
    var minKB=parseInt(document.getElementById('custom-minkb').value,10);
    var w=parseInt(document.getElementById('custom-w').value,10);
    var h=parseInt(document.getElementById('custom-h').value,10);
    if(!maxKB||maxKB<1){ document.getElementById('custom-summary').textContent='Enter Max KB'; return; }
    var constraint={format:'jpeg', bg_color:'white'};
    if(maxKB) constraint.max_kb=maxKB;
    if(minKB) constraint.min_kb=minKB;
    if(w) constraint.width_px=w;
    if(h) constraint.height_px=h;
    if(w&&h) constraint.aspect_ratio=w/h;
    var customPortal={id:'custom-manual', name:'Custom Sarkari Spec', uploads:[{type:'photo', hint:getConstraintSummary(constraint), constraint:constraint}]};
    activePortal=customPortal; activeUploadIndex=0; showDetected(customPortal); renderChips(customPortal); persistSelection(customPortal, customPortal.uploads[0]);
    document.getElementById('custom-summary').textContent='✓ '+getConstraintSummary(constraint);
  };
  renderDropdown('');
}

chrome.storage.local.get(['docbridge_stats','docbridge_nudge_enabled','docbridge_selected'],function(data){
  var stats=data.docbridge_stats||{processed:0};
  document.getElementById('stat-processed').textContent=stats.processed||0;
  document.getElementById('stat-portals').textContent=(typeof DOCBRIDGE_PORTALS!=='undefined'?DOCBRIDGE_PORTALS.filter(function(p){return p.id.indexOf('mock-')!==0}).length:0);
  document.getElementById('toggle-nudge').checked=data.docbridge_nudge_enabled!==false;
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
document.addEventListener('click',function(e){
  var dd=document.getElementById('preset-dropdown');
  var s=document.getElementById('preset-search');
  if(!dd.contains(e.target) && e.target!==s){ dd.innerHTML=''; }
});
detectActiveTab();
initCustom();
fillPortalTags();
