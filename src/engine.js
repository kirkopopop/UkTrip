var ICON_GO = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5"/></svg>';
var ICON_ROUTE = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="4" cy="12" r="2"/><circle cx="12" cy="4" r="2"/><path d="M6 12h3.5a2.5 2.5 0 0 0 0-5h-3a2.5 2.5 0 0 1 0-5H10"/></svg>';
var ICON_CAL = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><rect x="2.5" y="3.5" width="13" height="12" rx="2"/><path d="M2.5 7.5h13M6 2v3M12 2v3"/></svg>';

var cur = 0, view = "plan";
var svg = document.getElementById("svg"), mapEl = document.getElementById("map");
var vb = {x:0,y:0,w:4,h:3}, proj = null, focusIdx = -1;
function store(k,v){ try{ if(v===undefined) return localStorage.getItem(k); localStorage.setItem(k,v);}catch(e){ return null; } }
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];}); }
function makeProj(lat0, lon0){ var kx = 111.320*Math.cos(lat0*Math.PI/180); return function(ll){ return [ (ll[1]-lon0)*kx, -(ll[0]-lat0)*KM_LAT ]; }; }
function distKm(a,b){ var kx = 111.320*Math.cos(a[0]*Math.PI/180); return Math.hypot((a[1]-b[1])*kx, (a[0]-b[0])*KM_LAT); }

/* ---------- saved on this phone: ticks, picks, tickets, view choices ---------- */
var SKEY = TRIP.key+"-state";
var S = (function(){ var o=null; try{ o=JSON.parse(store(SKEY)||"null"); }catch(e){} if(!o||typeof o!=="object") o={}; o.picks=o.picks||{}; o.ticks=o.ticks||{}; o.tickets=o.tickets||[]; return o; })();
CHECK.forEach(function(c){ if(S.ticks[c[0]]==null){ var v=store(TRIP.key+"-"+c[0]); if(v!=null) S.ticks[c[0]] = v==="1"?1:0; } });
function save(){ store(SKEY, JSON.stringify(S)); }
function isDone(id){ var v=S.ticks[id]; if(v!=null) return !!v; var c=CHECK.find(function(x){return x[0]===id;}); return !!(c&&c[4]); }
var toastT = 0;
function toast(msg){ var t=document.getElementById("toast"); t.textContent=msg; t.hidden=false; clearTimeout(toastT); toastT=setTimeout(function(){ t.hidden=true; },4200); }

/* ---------- time, in the destination's time zone ---------- */
function tmin(t){ var m=/(\d{1,2}):(\d{2})/.exec(t||""); return m ? (+m[1])*60+(+m[2]) : null; }
function hhmm(n){ n=((n%1440)+1440)%1440; return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0"); }
function dur(n){ if(n<60) return n+" min"; var h=Math.floor(n/60), m=n%60; return h+" h"+(m?" "+m+" min":""); }
/* Add ?now=2026-11-20T13:10 to the address to preview how the page looks at that moment of the trip. */
function nowTrip(){
  var q=new URLSearchParams(location.search).get("now"), m=q&&/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/.exec(q);
  if(m) return {iso:m[1], min:(+m[2])*60+(+m[3])};
  try{
    var p={}; new Intl.DateTimeFormat("en-GB",{timeZone:TRIP.tz,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date()).forEach(function(x){ p[x.type]=x.value; });
    return {iso:p.year+"-"+p.month+"-"+p.day, min:((+p.hour)%24)*60+(+p.minute)};
  }catch(e){ var d=new Date(); return {iso:d.toISOString().slice(0,10), min:d.getUTCHours()*60+d.getUTCMinutes()}; }
}
function todayIndex(){ var n=nowTrip(); return DAYS.findIndex(function(d){ return d.iso===n.iso; }); }
function phase(){ var n=nowTrip(); return n.iso<DAYS[0].iso ? "before" : n.iso>DAYS[DAYS.length-1].iso ? "after" : "during"; }
function daysTo(){ return Math.round((Date.parse(DAYS[0].iso)-Date.parse(nowTrip().iso))/864e5); }

/* countdown */
function drawCount(){
  var el = document.getElementById("count"), ph = phase(), d = daysTo(), txt;
  if(ph==="before") txt = d<=1 ? "Starts tomorrow" : "Starts in "+d+" days";
  else if(ph==="during") txt = "Day "+(todayIndex()+1)+" of "+DAYS.length;
  else txt = "Trip complete";
  el.innerHTML = ICON_CAL + "<span>"+txt+"</span>";
}

/* stamps */
var tabs = document.getElementById("tabs");
DAYS.forEach(function(d,i){
  var b = document.createElement("button");
  var num = d.date.match(/\d+/)[0], wd = d.tab.split(" ")[0];
  b.type="button"; b.className="stamp"; b.setAttribute("role","tab"); b.id="tab-"+d.id;
  b.innerHTML = '<span class="stamp-in"><b>'+num+'</b><em>'+wd+' · Nov</em><span>'+esc(d.place)+'</span></span>';
  b.addEventListener("click", function(){ go(d.id); });
  tabs.appendChild(b);
});

function postmark(d){
  var city = d.mark || d.city.toUpperCase();
  var num = d.date.match(/\d+/)[0];
  return '<svg class="postmark thump" viewBox="0 0 120 120" aria-hidden="true">'+
    '<defs><path id="pm-top" d="M20 60a40 40 0 0 1 80 0"/><path id="pm-bot" d="M26 62a34 34 0 0 0 68 0"/></defs>'+
    '<circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" stroke-width="2.6"/>'+
    '<path d="M34 80h52M38 85h44" stroke="currentColor" stroke-width="1.4"/>'+
    '<text><textPath href="#pm-top" startOffset="50%" text-anchor="middle">'+city+'</textPath></text>'+
    '<text><textPath href="#pm-bot" startOffset="50%" text-anchor="middle" dominant-baseline="hanging">· '+d.iso.slice(0,4)+' ·</textPath></text>'+
    '<text class="big" x="60" y="61" text-anchor="middle">'+num+'</text>'+
    '<text x="60" y="75" text-anchor="middle">NOV · '+d.tab.split(" ")[0].toUpperCase()+'</text>'+
    '</svg>';
}

/* ---------- stops: type, booking state, travel legs ---------- */
var narrowMQ = window.matchMedia("(max-width:960px)");
var compact = S.compact!=null ? !!S.compact : narrowMQ.matches;
var MODES = {walk:["🚶","walk"], tube:["🚇","by Tube"], train:["🚆","by train"], bus:["🚌","by coach"], taxi:["🚕","by taxi"]};
var TRICON = {train:"🚆", bus:"🚌", plane:"✈️"};
function kindOf(s){ return s.k||"core"; }
function stopBooked(s){ return s.chk ? isDone(s.chk) : !!s.booked; }
function shortName(x){ return String(x).replace(/^\d+\.\s*/,""); }
/* A leg is how you get to a stop from the one before. Written legs come from the plan;
   if there is none and both stops are on the map and close, a walking time is estimated. */
function legFor(d,i){
  var s=d.stops[i]; if(s.go) return s.go;
  var p=d.stops[i-1];
  if(p && p.ll && s.ll){ var km=distKm(p.ll,s.ll); if(km>0.05 && km<1.7) return {m:"walk", min:Math.max(2,Math.round(km*1.3/4.8*60)), auto:true}; }
  return null;
}
function legLine(d,i){
  var s=d.stops[i], g=legFor(d,i); if(!g) return null;
  var m=MODES[g.m]||MODES.walk, t=tmin(s.t);
  var lv = g.leave || (t!=null && (g.min>=8 || kindOf(s)==="fixed") ? hhmm(t-g.min) : null);
  return {icon:m[0], text:(g.auto||g.est?"~":"")+g.min+" min "+m[1], leave:lv, note:g.txt||""};
}
function legHtml(d,i){
  var L=legLine(d,i); if(!L) return "";
  if(compact){
    var fixed = kindOf(d.stops[i])==="fixed" && L.leave;
    return '<li class="leg"><span></span><span class="legdot" aria-hidden="true"></span><div class="legtx"><span>'+L.icon+' '+esc(L.text.replace(/ (walk|by .*)$/,""))+(fixed?' · <b>leave '+L.leave+'</b>':'')+'</span></div></li>';
  }
  return '<li class="leg"><span></span><span class="legdot" aria-hidden="true"></span><div class="legtx"><span class="legm">'+L.icon+' '+esc(L.text)+'</span>'+
    (L.leave?'<span class="legl">leave by '+L.leave+'</span>':'')+(L.note?'<span class="legd">'+esc(L.note)+'</span>':'')+'</div></li>';
}
function metaHtml(s){
  var k=kindOf(s), meta="", pi = s.pick ? S.picks[s.pick] : null;
  if(k==="fixed") meta += '<span class="tag fixed">Fixed time</span>';
  if(k==="opt") meta += '<span class="tag opt">Optional</span>';
  if(s.who) meta += '<span class="tag solo">'+esc(s.who)+' solo</span>';
  if(s.pick) meta += (pi!=null && s.subs[pi]) ? '<span class="tag picked">Picked: '+esc(shortName(s.subs[pi][0]))+'</span>' : '<span class="tag book">Pick one</span>';
  if(s.fee) meta += '<span class="tag '+(s.fee[1]==="free"?"free":"fee")+'">'+esc(s.fee[0])+'</span>';
  if(stopBooked(s)) meta += '<span class="tag booked">Booked ✓</span>';
  else if(s.chk||s.book) meta += '<a class="tag book" href="#tips" data-goto="tips">Book ahead</a>';
  return meta;
}
function subsHtml(s){
  if(!s.subs) return "";
  var pi = s.pick ? S.picks[s.pick] : null;
  return '<ul class="subs">'+s.subs.map(function(x,xi){
    var cls = s.pick ? (pi===xi ? "chosen" : pi!=null ? "dim" : "") : "";
    return '<li class="'+cls+'"><div><b>'+esc(x[0])+'</b> <span>'+esc(x[1])+'</span> <a class="dir" href="'+gq(x[2])+'" target="_blank" rel="noopener">Map'+ICON_GO+'</a>'+
      (s.pick?'<button type="button" class="choose" data-pick="'+esc(s.pick)+'" data-x="'+xi+'" aria-pressed="'+(pi===xi)+'">'+(pi===xi?"Picked ✓":"Pick this")+'</button>':'')+'</div></li>';
  }).join("")+'</ul>';
}
function pinHtml(s,i){
  return (!s.off && s.ll) ? '<button type="button" class="pin" data-i="'+i+'" aria-label="Show stop '+s._n+' on the map">'+s._n+'</button>'
                          : '<span class="pin off'+(s.tr?" tr":"")+'" aria-hidden="true">'+(s.tr?(TRICON[s.tr]||""):"")+'</span>';
}
/* Compact view: one calm row per stop. Everything else lives in the detail sheet. */
function rowHtml(d,s,i,mark){
  var k=kindOf(s), bits=[], pi = s.pick ? S.picks[s.pick] : null;
  if(mark[i]) bits.push('<span class="s-now">'+mark[i]+'</span>');
  if(k==="fixed") bits.push('<span class="s-fix">Fixed</span>');
  if(k==="opt") bits.push('Optional');
  if(s.pick) bits.push((pi!=null && s.subs[pi]) ? esc(shortName(s.subs[pi][0])) : '<span class="s-do">Pick one</span>');
  if(stopBooked(s)) bits.push('<span class="s-ok">Booked ✓</span>');
  else if(s.chk||s.book) bits.push('<span class="s-do">To book</span>');
  return '<li class="stop row k-'+k+(s.who?" solo":"")+(mark[i]?" is-"+mark[i].toLowerCase():"")+'" id="s-'+i+'"><span class="t">'+esc(s.t)+'</span>'+pinHtml(s,i)+
    '<div class="what"><button type="button" class="hd" data-open="'+i+'" aria-haspopup="dialog"><span class="hd-tx"><strong>'+esc(s.n)+'</strong>'+
    (bits.length?'<span class="sl">'+bits.join(" · ")+'</span>':'')+'</span><i class="chev" aria-hidden="true"></i></button></div></li>';
}
function stopHtml(d,s,i,mark){
  if(compact) return rowHtml(d,s,i,mark);
  var meta = metaHtml(s);
  return '<li class="stop open k-'+kindOf(s)+(s.who?" solo":"")+'" id="s-'+i+'"><span class="t">'+esc(s.t)+'</span>'+pinHtml(s,i)+
    '<div class="what"><div class="hd"><strong>'+esc(s.n)+'</strong></div>'+
    '<p>'+esc(s.p)+'</p>'+subsHtml(s)+
    (meta?'<div class="meta">'+meta+'</div>':'')+
    (s.q?'<div class="links"><a class="dir" href="'+gq(s.q)+'" target="_blank" rel="noopener">Google Maps'+ICON_GO+'</a></div>':'')+
    (s.more?'<details class="more"><summary>More</summary><div class="txt">'+s.more+'</div></details>':'')+'</div></li>';
}

/* ---------- detail sheet ---------- */
var sheetEl = document.getElementById("sheet"), sheetBg = document.getElementById("sheetBg"), sheetIdx = -1, sheetFrom = null;
function sheetHtml(d,i){
  var s=d.stops[i], L=legLine(d,i), meta=metaHtml(s), mapped=!s.off&&s.ll;
  return '<div class="sh-top"><span class="sh-t'+(kindOf(s)==="fixed"?" fix":"")+'">'+esc(s.t)+'</span><button type="button" class="sh-x" data-close aria-label="Close">✕</button></div>'+
    '<h3 id="sheetTitle">'+esc(s.n)+'</h3>'+(meta?'<div class="meta">'+meta+'</div>':'')+
    (L?'<div class="sh-box"><small>Getting there</small><b>'+L.icon+' '+esc(L.text)+(L.leave?' · leave by '+L.leave:'')+'</b>'+(L.note?'<span>'+esc(L.note)+'</span>':'')+'</div>':'')+
    '<p>'+esc(s.p)+'</p>'+subsHtml(s)+
    (s.more?'<div class="sh-box more-box"><small>Good to know</small>'+s.more+'</div>':'')+
    '<div class="sh-act">'+(s.q?'<a class="routebtn" href="'+gq(s.q)+'" target="_blank" rel="noopener">'+ICON_ROUTE+'Open in Google Maps</a>':'')+(mapped?'<button type="button" class="chipbtn" data-onmap="'+i+'">Show on the map</button>':'')+'</div>'+
    '<div class="sh-nav"><button type="button" class="chipbtn" data-step="-1"'+(i===0?" disabled":"")+'>← Earlier</button><span>'+(i+1)+' of '+d.stops.length+'</span><button type="button" class="chipbtn" data-step="1"'+(i===d.stops.length-1?" disabled":"")+'>Later →</button></div>';
}
function drawSheet(){ sheetEl.innerHTML = sheetHtml(DAYS[cur], sheetIdx); sheetEl.scrollTop = 0; }
function openSheet(i){
  var was = sheetIdx>=0; sheetIdx = i; drawSheet();
  var hid = document.getElementById("s-"+i); if(hid && hid.classList.contains("past") && !pastOpen){ pastOpen=true; renderDay(); }
  document.querySelectorAll(".stop.focus").forEach(function(x){ x.classList.remove("focus"); });
  var li=document.getElementById("s-"+i); if(li) li.classList.add("focus");
  if(was) return;
  sheetFrom = document.activeElement;
  sheetBg.hidden = false; sheetEl.hidden = false; document.documentElement.classList.add("sheet-open");
  try{ history.pushState({sheet:1}, ""); }catch(e){}
  var x = sheetEl.querySelector("[data-close]"); if(x) x.focus();
}
function hideSheet(){
  if(sheetIdx<0) return;
  var li=document.getElementById("s-"+sheetIdx);
  sheetIdx = -1; sheetBg.hidden = true; sheetEl.hidden = true; document.documentElement.classList.remove("sheet-open");
  if(li) li.scrollIntoView({block:"nearest"});
  if(sheetFrom && sheetFrom.focus) try{ sheetFrom.focus({preventScroll:true}); }catch(e){}
}
function closeSheet(){ if(sheetIdx<0) return; if(history.state && history.state.sheet) history.back(); else hideSheet(); }
window.addEventListener("popstate", hideSheet);
sheetBg.addEventListener("click", closeSheet);
document.addEventListener("keydown", function(e){ if(e.key==="Escape") closeSheet(); });
sheetEl.addEventListener("click", function(e){
  var b = e.target.closest("[data-close]"); if(b){ closeSheet(); return; }
  b = e.target.closest("[data-step]"); if(b){ openSheet(sheetIdx + (+b.dataset.step)); return; }
  b = e.target.closest(".choose"); if(b){ var id=b.dataset.pick, x=+b.dataset.x, keep=sheetIdx; if(S.picks[id]===x) delete S.picks[id]; else S.picks[id]=x; save(); push("p:"+id, S.picks[id]); renderDay(); sheetIdx=keep; drawSheet(); return; }
  b = e.target.closest("[data-goto]"); if(b){ e.preventDefault(); var to=b.dataset.goto; hideSheet(); go(to); window.scrollTo(0,0); return; }
  b = e.target.closest("[data-onmap]"); if(b){ var n=+b.dataset.onmap; hideSheet(); focusStop(n, true); }
});

/* ---------- spare time and rain ideas ---------- */
var CITYNAME = {}; DAYS.forEach(function(d){ (d.cities||[d.city]).forEach(function(c){ CITYNAME[c]=c.charAt(0).toUpperCase()+c.slice(1); }); });
var spareF = {indoor:false, quick:false}, spareOpen = false, pastOpen = false;
function refPoint(d){
  var n=nowTrip(), pts=d.stops.filter(function(s){ return s.ll; });
  if(d.iso===n.iso){ var nx=d.stops.filter(function(s){ return s.ll && tmin(s.t)!=null && tmin(s.t)>=n.min-45; })[0]; if(nx) return {ll:nx.ll, name:nx.n}; }
  if(!pts.length) return null;
  return {ll:[pts.reduce(function(a,s){return a+s.ll[0];},0)/pts.length, pts.reduce(function(a,s){return a+s.ll[1];},0)/pts.length], name:null};
}
function spareItem(x, km){
  return '<li><div class="sp-tx"><b>'+esc(x[0])+'</b> <span>'+esc(x[2])+'. '+esc(x[3])+'</span></div><div class="meta">'+
    '<span class="tag '+(x[4]?"picked":"free")+'">'+(x[4]?"Indoors":"Outdoors")+'</span><span class="tag fee">allow ~'+dur(x[5])+'</span>'+
    (km!=null?'<span class="tag fee">'+(km<15?"~"+(km<1?Math.round(km*10)*100+" m":km.toFixed(1)+" km")+" away":esc(CITYNAME[x[1]]||x[1]))+'</span>':'')+
    '<a class="dir" href="'+gq(x[7])+'" target="_blank" rel="noopener">Map'+ICON_GO+'</a></div></li>';
}
function spareHtml(d){
  var cities = d.cities||[d.city], ref = refPoint(d);
  var items = SPARE.filter(function(x){ return cities.indexOf(x[1])>=0 && (!spareF.indoor||x[4]) && (!spareF.quick||x[5]<=60); })
    .map(function(x){ return {x:x, km:(ref&&x[6])?distKm(ref.ll,x[6]):null}; })
    .sort(function(a,b){ return (a.km==null?1e9:a.km)-(b.km==null?1e9:b.km); });
  var body = 
    '<p class="sub">Nearest first'+(ref&&ref.name?', measured from '+esc(ref.name):ref?", measured from today's stops":"")+'.</p>'+
    '<div class="pick"><button type="button" data-sf="indoor" aria-pressed="'+spareF.indoor+'">Indoors only</button><button type="button" data-sf="quick" aria-pressed="'+spareF.quick+'">An hour or less</button></div>'+
    (items.length?'<ul class="sparelist">'+items.map(function(o){ return spareItem(o.x,o.km); }).join("")+'</ul>':'<p class="empty">Nothing matches those filters.</p>');
  return compact ? '<details class="spare"'+(spareOpen?" open":"")+'><summary><h3>Spare time or a change of plan</h3></summary>'+body+'</details>'
                 : '<section class="spare"><h3>Spare time or a change of plan</h3>'+body+'</section>';
}

/* ---------- the day ---------- */
function renderDay(){
  var d = DAYS[cur], n = nowTrip(), autoOpen = {};
  if(d.iso===n.iso){ var f=findNow(); if(f){ if(f.curI>=0) autoOpen[f.curI]="Now"; if(f.nextI>=0) autoOpen[f.nextI]="Next"; } }
  document.getElementById("dayhead").innerHTML = '<div><div class="date">'+d.date+' · '+esc(d.place)+'</div><h2>'+esc(d.title)+'</h2>'+
    '<p class="intro" id="intro">'+esc(d.intro)+'</p>'+
    '<details class="more rain"><summary><span class="wide-only">If it rains</span><span class="phone-only">About the day and the rain plan</span></summary><div class="txt"><p class="phone-only">'+esc(d.intro)+'</p>'+
    (d.rain||[]).map(function(r,ri){ return '<p>'+(ri===0?'<b>If it rains:</b> ':'')+esc(r)+'</p>'; }).join("")+'</div></details>'+
    '</div>'+postmark(d);
  var k = 0;
  d.stops.forEach(function(s){ s._n = (!s.off && s.ll) ? ++k : null; });
  var h = '<ol class="stops">', cb = document.getElementById("cmpBtn");
  cb.textContent = compact ? "Show all details" : "Compact view";
  /* on the day itself, stops that are over fold away so the list starts at "now" */
  var pastN = 0; if(compact && d.iso===n.iso){ var fn=findNow(); if(fn && fn.curI>0) pastN = fn.curI; }
  if(pastN) h += '<li class="pastbar"><button type="button" data-past>'+(pastOpen?"Hide":"Show")+' '+pastN+' earlier '+(pastN===1?"stop":"stops")+'</button></li>';
  d.stops.forEach(function(s,i){
    var part = legHtml(d,i) + stopHtml(d,s,i,autoOpen);
    h += i<pastN ? part.replace(/<li class="/g,'<li class="past ') : part;
  });
  h += '</ol><p class="legend">'+(compact?"Tap a stop for the details. ":"")+'<span class="tag fixed">Fixed</span> times can\'t move. <span class="tag opt">Optional</span> stops go first if you are running late.</p>' + spareHtml(d);
  var list = document.getElementById("list"); list.innerHTML = h; list.classList.toggle("compact", compact); list.classList.toggle("hide-past", !!pastN && !pastOpen);
  var pts = d.stops.filter(function(s){ return s.ll && !s.off; });
  var row = document.getElementById("maprow");
  if(pts.length>1){
    var o = pts[0], de = pts[pts.length-1], w = pts.slice(1,-1).slice(0,8);
    var url = "https://www.google.com/maps/dir/?api=1&travelmode=walking&origin="+o.ll.join(",")+"&destination="+de.ll.join(",")+(w.length?"&waypoints="+w.map(function(s){return s.ll.join(",");}).join("%7C"):"");
    row.innerHTML = '<a class="routebtn" href="'+url+'" target="_blank" rel="noopener">'+ICON_ROUTE+'Open the route in Google Maps</a>';
  } else row.innerHTML = "";
  drawMapToggle();
}
document.getElementById("list").addEventListener("click", function(e){
  var b = e.target.closest(".pin[data-i]"); if(b){ focusStop(+b.dataset.i, true); return; }
  b = e.target.closest(".choose"); if(b){ var id=b.dataset.pick, x=+b.dataset.x; if(S.picks[id]===x) delete S.picks[id]; else S.picks[id]=x; save(); push("p:"+id, S.picks[id]); renderDay(); return; }
  b = e.target.closest("[data-goto]"); if(b){ e.preventDefault(); go(b.dataset.goto); window.scrollTo(0,0); return; }
  b = e.target.closest("[data-sf]"); if(b){ spareF[b.dataset.sf]=!spareF[b.dataset.sf]; spareOpen=true; var y=window.scrollY; renderDay(); window.scrollTo(0,y); return; }
  b = e.target.closest("[data-open]"); if(b){ openSheet(+b.dataset.open); return; }
  b = e.target.closest("[data-past]"); if(b){ pastOpen=!pastOpen; renderDay(); return; }
});
document.getElementById("cmpBtn").addEventListener("click", function(){ compact=!compact; S.compact=compact; save(); renderDay(); });

/* ---------- now and next ---------- */
function findNow(){
  var n=nowTrip(), di=DAYS.findIndex(function(d){ return d.iso===n.iso; }); if(di<0) return null;
  var st=DAYS[di].stops, curI=-1, nextI=-1, fixI=-1;
  st.forEach(function(s,i){ var t=tmin(s.t); if(t==null) return; if(t<=n.min) curI=i; else if(nextI<0) nextI=i; });
  if(nextI>=0) for(var i=nextI;i<st.length;i++){ if(kindOf(st[i])==="fixed"){ fixI=i; break; } }
  return {n:n, di:di, curI:curI, nextI:nextI, fixI:fixI};
}
function jumpTo(di,i){
  if(view!=="plan" || cur!==di) go(DAYS[di].id);
  setTimeout(function(){
    var li=document.getElementById("s-"+i); if(!li) return;
    li.scrollIntoView({block:"center",behavior:"smooth"});
    if(compact) openSheet(i); else li.classList.add("focus");
  }, 120);
}
function updateNow(){
  drawCount();
  var el=document.getElementById("nowcard"), ph=phase(), h="";
  el.classList.toggle("slim", ph!=="during");
  if(ph==="before"){
    var todo=CHECK.filter(function(c){ return !isDone(c[0]); }).length, d=daysTo();
    h = '<a class="now-strip" href="#tips" data-goto="tips"><b>'+(d<=1?"Starts tomorrow":"Starts in "+d+" days")+'</b><span>'+(todo?todo+(todo===1?" thing":" things")+" still to sort out":"everything is booked")+'</span><i aria-hidden="true"></i></a>';
  } else if(ph==="after"){
    h = '<a class="now-strip" href="#money" data-goto="money"><b>Trip complete</b><span>settle up the expenses</span><i aria-hidden="true"></i></a>';
  } else {
    var f=findNow(), dd=DAYS[f.di], st=dd.stops;
    h = '<div class="now-top"><span>'+esc(dd.tab)+' · '+hhmm(f.n.min)+' local time</span><span>Day '+(f.di+1)+' of '+DAYS.length+'</span></div>';
    h += '<div class="now-rows">';
    if(f.curI>=0) h += '<button type="button" class="now-row" data-d="'+f.di+'" data-i="'+f.curI+'"><small>Now · since '+esc(st[f.curI].t)+'</small><b>'+esc(st[f.curI].n)+'</b></button>';
    if(f.nextI>=0){
      var s=st[f.nextI], L=legLine(dd,f.nextI), wait=tmin(s.t)-f.n.min;
      h += '<button type="button" class="now-row next" data-d="'+f.di+'" data-i="'+f.nextI+'"><small>Next · '+esc(s.t)+' · in '+dur(wait)+(kindOf(s)==="fixed"?" · fixed time":kindOf(s)==="opt"?" · optional":"")+'</small><b>'+esc(s.n)+'</b>'+
        (L?'<span>'+L.icon+' '+esc(L.text)+(L.leave?' · leave by '+L.leave:'')+'</span>':'')+'</button>';
      if(f.fixI>=0 && f.fixI!==f.nextI){ var fx=st[f.fixI]; h += '<button type="button" class="now-row fix" data-d="'+f.di+'" data-i="'+f.fixI+'"><small>Next fixed time · in '+dur(tmin(fx.t)-f.n.min)+'</small><b>'+esc(fx.t)+' '+esc(fx.n)+'</b></button>'; }
      h += '</div>';
      if(s.q) h += '<div class="now-act"><a class="routebtn" href="'+gq(s.q)+'" target="_blank" rel="noopener">'+ICON_ROUTE+'Directions to the next stop</a></div>';
    } else {
      var nd=DAYS[f.di+1];
      h += '<div class="now-main"><small>Next</small><b>That\'s today done</b>'+(nd?'<span>Tomorrow starts at '+esc(nd.stops[0].t)+': '+esc(nd.stops[0].n)+'</span>':'')+'</div></div>';
    }
  }
  el.innerHTML = h;
}
document.getElementById("nowcard").addEventListener("click", function(e){
  var b=e.target.closest(".now-row"); if(b){ jumpTo(+b.dataset.d, +b.dataset.i); return; }
  b=e.target.closest("[data-goto]"); if(b){ e.preventDefault(); go(b.dataset.goto); window.scrollTo(0,0); }
});
setInterval(function(){ if(!document.hidden) updateNow(); }, 60000);
document.addEventListener("visibilitychange", function(){ if(!document.hidden) updateNow(); });

/* ---------- map: folded away on phones, and it never steals a scroll ---------- */
var mapWrap = document.getElementById("mapwrap"), mapToggle = document.getElementById("mapToggle"), lockBtn = document.getElementById("mapLock"), doneBtn = document.getElementById("mapDone");
var mapOpen = S.mapOpen!=null ? !!S.mapOpen : false;
var coarse = window.matchMedia("(pointer:coarse)").matches;
function mapShown(){ return !narrowMQ.matches || mapOpen; }
function drawMapToggle(){
  var n = DAYS[cur].stops.filter(function(s){ return s.ll && !s.off; }).length;
  mapWrap.hidden = !mapShown();
  mapToggle.textContent = (mapOpen?"Hide the map":"Show the map")+" · "+n+" stops";
  mapToggle.setAttribute("aria-expanded", mapOpen);
}
function lockMap(on){ if(!coarse) return; mapEl.classList.toggle("locked",on); lockBtn.hidden=!on; doneBtn.hidden=on; }
mapToggle.addEventListener("click", function(){ mapOpen=!mapOpen; S.mapOpen=mapOpen; save(); drawMapToggle(); if(mapOpen) requestAnimationFrame(fit); });
lockBtn.addEventListener("click", function(){ lockMap(false); });
doneBtn.addEventListener("click", function(){ lockMap(true); });
if(coarse){ lockMap(true); if("IntersectionObserver" in window) new IntersectionObserver(function(en){ if(!en[0].isIntersecting) lockMap(true); },{threshold:0.2}).observe(mapEl); }

/* ---------- map ---------- */
var NS = "http://www.w3.org/2000/svg";
function el(tag, attrs, parent){ var e=document.createElementNS(NS,tag); for(var a in attrs) e.setAttribute(a,attrs[a]); if(parent) parent.appendChild(e); return e; }
var baseG = null, overG = null;
function buildBase(){
  var d = DAYS[cur], B = BASE[d.city];
  while(svg.firstChild) svg.removeChild(svg.firstChild);
  el("rect",{x:-200,y:-200,width:400,height:400,class:"landbg"},svg);
  baseG = el("g",{transform:"scale(0.01)"},svg);
  if(B){
    el("path",{class:"park",d:B.park},baseG);
    el("path",{class:"water",d:B.water},baseG);
    if(B.river) el("path",{class:"river",d:B.river},baseG);
    el("path",{class:"rd r-min",d:B.r_min},baseG);
    el("path",{class:"rd c-pri",d:B.r_pri},baseG);
    el("path",{class:"rd r-ter",d:B.r_ter},baseG);
    el("path",{class:"rd r-pri",d:B.r_pri},baseG);
    el("path",{class:"rail",d:B.rail},baseG);
  }
  overG = el("g",{},svg);
}
function dayBounds(){
  var xs=[], ys=[];
  DAYS[cur].stops.forEach(function(s){ if(s.ll && !s.off){ var p=proj(s.ll); xs.push(p[0]); ys.push(p[1]); } });
  return {x0:Math.min.apply(0,xs), x1:Math.max.apply(0,xs), y0:Math.min.apply(0,ys), y1:Math.max.apply(0,ys)};
}
function fit(){
  var b = dayBounds(), W = mapEl.clientWidth||600, H = mapEl.clientHeight||500;
  var narrow = W < 520, top = narrow ? 58 : 70, bot = narrow ? 34 : 44, side = narrow ? 26 : 56;
  var aw = Math.max(W-2*side, 80), ah = Math.max(H-top-bot, 80);
  var k = Math.max(Math.max(b.x1-b.x0,0.4)/aw, Math.max(b.y1-b.y0,0.4)/ah);
  vb.w = W*k; vb.h = H*k;
  vb.x = (b.x0+b.x1)/2 - vb.w/2;
  vb.y = b.y0 - top*k - (ah*k - (b.y1-b.y0))/2;
  var B = BASE[DAYS[cur].city];
  if(B){ var bx=B.box[0]/100, by=B.box[1]/100, bw=B.box[2]/100, bh=B.box[3]/100;
    if(vb.h<=bh){ if(vb.y<by) vb.y=Math.min(by, b.y0-30*k); if(vb.y+vb.h>by+bh) vb.y=Math.max(by+bh-vb.h, b.y1+30*k-vb.h); }
    if(vb.w<=bw){ if(vb.x<bx) vb.x=Math.min(bx, b.x0-30*k); if(vb.x+vb.w>bx+bw) vb.x=Math.max(bx+bw-vb.w, b.x1+30*k-vb.w); } }
  draw();
}
function pxKm(){ return vb.w/(mapEl.clientWidth||600); }
function draw(){
  var d = DAYS[cur];
  svg.setAttribute("viewBox", vb.x+" "+vb.y+" "+vb.w+" "+vb.h);
  svg.classList.toggle("far", vb.w > 7);
  while(overG.firstChild) overG.removeChild(overG.firstChild);
  var px = pxKm();
  (AREAS[d.city]||[]).forEach(function(a){
    var p = proj([a[1],a[2]]);
    var t = el("text",{x:p[0],y:p[1],"font-size":11.5*px,"text-anchor":"middle",class:"lbl-a","stroke-width":3.5*px},overG);
    t.textContent = a[0];
  });
  var mp = d.stops.filter(function(s){ return s.ll && !s.off; }).map(function(s){ return proj(s.ll); });
  if(mp.length>1) el("path",{d:"M"+mp.map(function(p){return p[0]+" "+p[1];}).join(" L"),class:"route","stroke-width":3},overG);
  var R = 12*px;
  d.stops.forEach(function(s,i){
    if(!s.ll || s.off) return;
    var p = proj(s.ll), gm = el("g",{class:"mk"+(s.who?" solo":""),tabindex:"0",role:"button","aria-label":s._n+". "+s.n},overG);
    if(i===focusIdx){
      el("circle",{cx:p[0],cy:p[1],r:R*1.6,class:"ring","stroke-width":2.2,"vector-effect":"non-scaling-stroke"},gm);
      var lb = el("text",{x:p[0]+R*1.9,y:p[1]+4.5*px,"font-size":13*px,class:"pinlbl","stroke-width":4*px},gm);
      lb.textContent = s.n.length>34 ? s.n.slice(0,32)+"…" : s.n;
    }
    el("circle",{cx:p[0],cy:p[1],r:R,class:"d",stroke:"#fff","stroke-width":2.2*px},gm);
    var t = el("text",{x:p[0],y:p[1]+4.4*px,"font-size":12.5*px,"text-anchor":"middle",class:"num"},gm);
    t.textContent = s._n;
    var ttl = el("title",{},gm); ttl.textContent = s._n+". "+s.n+" · "+s.t;
    gm.addEventListener("click",function(){ focusStop(i,false); });
    gm.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); focusStop(i,false);} });
  });
  var target = 100*px, nice=[0.1,0.2,0.25,0.5,1,2,5], km = nice[0];
  for(var n=0;n<nice.length;n++){ if(nice[n]<=target) km=nice[n]; }
  document.getElementById("scale").innerHTML = (km<1? (km*1000)+" m" : km+" km") + '<i style="width:'+(km/px)+'px"></i>';
}
function focusStop(i, fromList){
  focusIdx = i;
  document.querySelectorAll(".stop.focus").forEach(function(x){ x.classList.remove("focus"); });
  var li = document.getElementById("s-"+i);
  if(li){ li.classList.add("focus"); if(!fromList) li.scrollIntoView({block:"center",behavior:"smooth"}); }
  var s = DAYS[cur].stops[i];
  if(fromList && s.ll){
    if(!mapShown()){ mapOpen=true; S.mapOpen=true; save(); drawMapToggle(); fit(); }
    var p = proj(s.ll), inside = p[0]>vb.x+vb.w*0.1 && p[0]<vb.x+vb.w*0.8 && p[1]>vb.y+vb.h*0.12 && p[1]<vb.y+vb.h*0.9;
    if(!inside){ vb.x = p[0]-vb.w/2; vb.y = p[1]-vb.h/2; }
    if(narrowMQ.matches) mapEl.scrollIntoView({block:"center",behavior:"smooth"});
  }
  draw();
}
function zoom(f, cx, cy){
  if(cx===undefined){ cx = vb.x+vb.w/2; cy = vb.y+vb.h/2; }
  var nw = Math.min(Math.max(vb.w*f, 0.35), 9), k = nw/vb.w;
  vb.x = cx-(cx-vb.x)*k; vb.y = cy-(cy-vb.y)*k; vb.w = nw; vb.h = vb.h*k;
  draw();
}
document.getElementById("zin").addEventListener("click",function(){ zoom(1/1.5); });
document.getElementById("zout").addEventListener("click",function(){ zoom(1.5); });
document.getElementById("fit").addEventListener("click",fit);
svg.addEventListener("wheel",function(e){
  e.preventDefault();
  var r = svg.getBoundingClientRect(), cx = vb.x+(e.clientX-r.left)/r.width*vb.w, cy = vb.y+(e.clientY-r.top)/r.height*vb.h;
  zoom(e.deltaY>0?1.15:1/1.15, cx, cy);
},{passive:false});
var ptrs = {}, last = null, pinch0 = null, raf = 0;
function sched(){ if(!raf) raf = requestAnimationFrame(function(){ raf=0; draw(); }); }
svg.addEventListener("pointerdown",function(e){
  if(e.target.closest && e.target.closest(".mk")) return;
  svg.setPointerCapture(e.pointerId); ptrs[e.pointerId]={x:e.clientX,y:e.clientY}; svg.classList.add("dragging");
  last = {x:e.clientX,y:e.clientY}; pinch0 = null;
});
svg.addEventListener("pointermove",function(e){
  if(!ptrs[e.pointerId]) return;
  ptrs[e.pointerId]={x:e.clientX,y:e.clientY};
  var ids = Object.keys(ptrs), r = svg.getBoundingClientRect();
  if(ids.length===2){
    var a=ptrs[ids[0]], b=ptrs[ids[1]], dist=Math.hypot(a.x-b.x,a.y-b.y);
    if(pinch0){ var cx = vb.x+((a.x+b.x)/2-r.left)/r.width*vb.w, cy = vb.y+((a.y+b.y)/2-r.top)/r.height*vb.h; var nw=Math.min(Math.max(vb.w*pinch0/dist,0.35),9),k=nw/vb.w; vb.x=cx-(cx-vb.x)*k; vb.y=cy-(cy-vb.y)*k; vb.w=nw; vb.h*=k; sched(); }
    pinch0 = dist; return;
  }
  if(last){ vb.x -= (e.clientX-last.x)/r.width*vb.w; vb.y -= (e.clientY-last.y)/r.height*vb.h; last={x:e.clientX,y:e.clientY}; svg.setAttribute("viewBox", vb.x+" "+vb.y+" "+vb.w+" "+vb.h); }
});
function up(e){ delete ptrs[e.pointerId]; if(!Object.keys(ptrs).length){ svg.classList.remove("dragging"); last=null; pinch0=null; draw(); } }
svg.addEventListener("pointerup",up); svg.addEventListener("pointercancel",up);

/* ---------- bookings ---------- */
var cl = document.getElementById("checklist");
function drawChecks(){
  cl.innerHTML = CHECK.map(function(c){
    var on = isDone(c[0]);
    return '<div class="chk'+(on?" done":"")+'"><input type="checkbox" id="c-'+c[0]+'"'+(on?" checked":"")+'><label for="c-'+c[0]+'">'+esc(c[1])+(c[2]?'<small>'+esc(c[2])+'</small>':'')+'</label><span class="when">'+(on?"Done ✓":esc(c[3]))+'</span></div>';
  }).join("");
  var todo = CHECK.filter(function(c){ return !isDone(c[0]); });
  document.getElementById("progress").textContent = (CHECK.length-todo.length)+" of "+CHECK.length+" done";
  document.getElementById("bar").style.width = (100*(CHECK.length-todo.length)/CHECK.length)+"%";
  document.getElementById("nextup").textContent = todo.length ? "Still to do: "+todo.map(function(c){ return c[1].split(",")[0]; }).join("; ")+"." : "Everything is booked.";
}
cl.addEventListener("change", function(e){
  var i=e.target; if(i.type!=="checkbox") return;
  S.ticks[i.id.slice(2)] = i.checked?1:0; save(); push("t:"+i.id.slice(2), S.ticks[i.id.slice(2)]); drawChecks(); updateNow();
});

/* ---------- calendar file with the fixed times ---------- */
function icsText(t){ return String(t||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"); }
function icsTime(iso,min){ var d=new Date(iso+"T00:00:00Z"); d.setUTCMinutes(min-TRIP.utcOffsetMin); return d.toISOString().replace(/[-:]/g,"").slice(0,15)+"Z"; }
function icsFold(l){ var out=[]; while(l.length>72){ out.push(l.slice(0,72)); l=" "+l.slice(72); } out.push(l); return out.join("\r\n"); }
function buildIcs(){
  var L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//"+TRIP.key+"//trip plan//EN","CALSCALE:GREGORIAN"], stamp=new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z";
  DAYS.forEach(function(d){ d.stops.forEach(function(s,i){
    if(kindOf(s)!=="fixed") return; var t=tmin(s.t); if(t==null) return;
    var nx=d.stops[i+1], e = nx && tmin(nx.t)!=null ? Math.min(tmin(nx.t), t+120) : t+60; if(e<=t) e=t+30;
    L.push("BEGIN:VEVENT","UID:"+TRIP.key+"-"+d.id+"-"+i+"@trip","DTSTAMP:"+stamp,"DTSTART:"+icsTime(d.iso,t),"DTEND:"+icsTime(d.iso,e),"SUMMARY:"+icsText(s.n),"DESCRIPTION:"+icsText(s.p));
    if(s.q) L.push("LOCATION:"+icsText(s.q));
    L.push("END:VEVENT");
  }); });
  L.push("END:VCALENDAR");
  return L.map(icsFold).join("\r\n")+"\r\n";
}
document.getElementById("icsBtn").addEventListener("click", function(){
  var a=document.createElement("a"), url=URL.createObjectURL(new Blob([buildIcs()],{type:"text/calendar"}));
  a.href=url; a.download=TRIP.key+"-fixed-times.ics"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(url); },4000);
});

/* ---------- tickets and references: kept on this phone, never in the page ---------- */
function safeUrl(u){ u=String(u||"").trim(); if(!u) return ""; if(!/^https?:\/\//i.test(u)){ if(/^[\w-]+(\.[\w-]+)+(\/|$)/.test(u)) u="https://"+u; else return ""; } return u.slice(0,400); }
function drawTix(){
  var list=document.getElementById("tixList");
  document.getElementById("tixCount").textContent = S.tickets.length ? S.tickets.length+" saved" : "";
  list.innerHTML = S.tickets.length ? S.tickets.map(function(t){
    return '<div class="tix"><div class="tix-tx"><b>'+esc(t.title)+'</b>'+(t.ref?'<span class="ref">'+esc(t.ref)+'</span>':'')+(t.note?'<small>'+esc(t.note)+'</small>':'')+'</div><div class="tix-act">'+
      (t.ref?'<button type="button" class="btn ghost" data-copy="'+esc(t.id)+'">Copy</button>':'')+
      (t.url?'<a class="btn ghost" href="'+esc(t.url)+'" target="_blank" rel="noopener">Open</a>':'')+
      '<button type="button" class="btn ghost del" data-del="'+esc(t.id)+'">Remove</button></div></div>';
  }).join("") : '<p class="empty">Nothing saved yet. Add the sleeper, the hotels and anything with a code.</p>';
}
document.getElementById("tixNames").innerHTML = CHECK.map(function(c){ return '<option value="'+esc(c[1].split(",")[0])+'">'; }).join("");
document.getElementById("tixForm").addEventListener("submit", function(e){
  e.preventDefault();
  var g=function(id){ return document.getElementById(id).value.trim(); }, title=g("tixTitle"); if(!title) return;
  var nt={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6), title:title.slice(0,80), ref:g("tixRef").slice(0,80), url:safeUrl(g("tixUrl")), note:g("tixNote").slice(0,160)};
  S.tickets.push(nt); save(); push("x:"+nt.id, nt); drawTix(); e.target.reset(); toast(syncOn()?"Saved and shared.":"Saved on this phone.");
});
document.getElementById("tixList").addEventListener("click", function(e){
  var b=e.target.closest("[data-copy]");
  if(b){ var t=S.tickets.find(function(x){ return x.id===b.dataset.copy; }); if(t&&navigator.clipboard) navigator.clipboard.writeText(t.ref).then(function(){ toast("Copied."); },function(){}); return; }
  b=e.target.closest("[data-del]");
  if(b){ if(!b.classList.contains("armed")){ b.classList.add("armed"); b.textContent="Tap to confirm"; setTimeout(function(){ b.classList.remove("armed"); b.textContent="Remove"; },3500); return; }
    S.tickets=S.tickets.filter(function(x){ return x.id!==b.dataset.del; }); save(); push("x:"+b.dataset.del, null); drawTix(); }
});

/* ---------- send ticks, picks and tickets to the other phone (in the link itself, not on a server) ---------- */
function b64e(str){ return btoa(unescape(encodeURIComponent(str))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""); }
function b64d(s){ s=s.replace(/-/g,"+").replace(/_/g,"/"); while(s.length%4) s+="="; return decodeURIComponent(escape(atob(s))); }
function shareLink(){ return location.origin+location.pathname+"#sync="+b64e(JSON.stringify({v:1,p:S.picks,t:S.ticks,x:S.tickets})); }
document.getElementById("shareBtn").addEventListener("click", function(){
  var url=shareLink(), msg=document.getElementById("shareMsg");
  if(navigator.share){ navigator.share({title:TRIP.name, text:"Trip plan: my ticks, picks and tickets", url:url}).catch(function(){}); return; }
  (navigator.clipboard?navigator.clipboard.writeText(url):Promise.reject()).then(function(){ msg.textContent="Link copied. Send it to the other phone in a private message."; },function(){ msg.textContent=url; });
});
function applySync(str){
  var o=null; try{ o=JSON.parse(b64d(str)); }catch(e){}
  if(!o||typeof o!=="object"){ toast("That shared link didn't work."); return; }
  if(!window.confirm("Copy the shared ticks, picks and tickets onto this phone?")) return;
  var str80=function(v,n){ return String(v==null?"":v).slice(0,n||80); };
  Object.keys(o.p||{}).forEach(function(k){ if(typeof o.p[k]==="number") S.picks[str80(k,40)]=o.p[k]; });
  Object.keys(o.t||{}).forEach(function(k){ S.ticks[str80(k,40)]=o.t[k]?1:0; });
  (Array.isArray(o.x)?o.x:[]).slice(0,60).forEach(function(t){
    if(!t||!t.id) return;
    var c={id:str80(t.id,40), title:str80(t.title), ref:str80(t.ref), url:safeUrl(t.url), note:str80(t.note,160)}, i=S.tickets.findIndex(function(x){ return x.id===c.id; });
    if(i>=0) S.tickets[i]=c; else S.tickets.push(c);
  });
  save(); queueAll(); toast("Updated from the shared link.");
}

/* ---------- every spare-time idea, by city ---------- */
(function(){
  var by={}; SPARE.forEach(function(x){ (by[x[1]]=by[x[1]]||[]).push(x); });
  document.getElementById("spareAll").innerHTML = Object.keys(by).map(function(c){ return '<h3>'+esc(CITYNAME[c]||c)+'</h3><ul class="sparelist">'+by[c].map(function(x){ return spareItem(x,null); }).join("")+'</ul>'; }).join("");
})();


/* ---------- shared expenses (Supabase RPC, trip-code protected) ---------- */
var SB = "https://iggxntoqfywensvwulod.supabase.co/rest/v1/rpc/", SBK = "sb_publishable_1RdETP5Xyo5HaVqGJAwidw_5jjMPuYO";
var CATS = [["food","🍔","Food"],["drinks","🍺","Drinks"],["transport","🚆","Transport"],["tickets","🎟️","Tickets"],["stay","🛏️","Stay"],["shopping","🛍️","Shopping"],["other","•","Other"]];
var TRIPDAYS = DAYS.map(function(d){ return [d.iso, d.tab]; });
var M = {code:store(TRIP.key+"-code")||"", names:TRIP.people.slice(), items:[], payer:0, split:0.5, cat:"food", day:null, timer:null, busy:false};
function rpc(fn, body){
  return fetch(SB+fn,{method:"POST",headers:{"apikey":SBK,"Content-Type":"application/json"},body:JSON.stringify(body)}).then(function(r){
    return r.text().then(function(tx){ var j=null; try{ j=tx?JSON.parse(tx):null; }catch(e){} if(!r.ok){ var m=(j&&j.message)||("Error "+r.status); throw new Error(m); } return j; });
  });
}
function gbp(n){ return "£"+(Math.round(n*100)/100).toFixed(2).replace(/\.00$/,""); }
function todayISO(){ var d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function defaultDay(){ var t=todayISO(); return TRIPDAYS.some(function(d){return d[0]===t;}) ? t : DAYS[0].iso; }
function dayLabel(iso){ var f=TRIPDAYS.find(function(d){return d[0]===iso;}); if(f) return f[1]; var d=new Date(iso+"T12:00:00"); return d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}); }
function pick(el, opts, val, on){
  el.innerHTML = opts.map(function(o){ return '<button type="button" data-v="'+esc(o[0])+'" aria-pressed="'+(String(o[0])===String(val))+'">'+o[1]+'</button>'; }).join("");
  el.querySelectorAll("button").forEach(function(b){ b.addEventListener("click",function(){ on(b.dataset.v); }); });
}
function drawPickers(){
  var n=M.names, other=n[1-M.payer];
  pick(document.getElementById("mPayer"), [[0,esc(n[0])],[1,esc(n[1])]], M.payer, function(v){ M.payer=+v; drawPickers(); });
  pick(document.getElementById("mSplit"), [[0.5,"Split 50/50"],[1,esc(other)+" owes it all"],[0,"Just "+esc(n[M.payer])+"'s"]], M.split, function(v){ M.split=+v; drawPickers(); });
  pick(document.getElementById("mCat"), CATS.map(function(c){return [c[0],c[1]+" "+c[2]];}), M.cat, function(v){ M.cat=v; drawPickers(); });
  pick(document.getElementById("mDay"), TRIPDAYS, M.day, function(v){ M.day=v; drawPickers(); });
}
function drawMoney(){
  var n=M.names, net=0, tot=0, share=[0,0], paid=[0,0];
  M.items.forEach(function(e){ var a=+e.amount, o=a*(+e.other_share), p=e.paid_by; tot+=a; paid[p]+=a; share[1-p]+=o; share[p]+=a-o; net += p===0 ? o : -o; });
  var bal = Math.abs(net)<0.005 ? '<b>All square</b>' : '<b>'+esc(n[net>0?1:0])+' owes '+esc(n[net>0?0:1])+' <span class="amt">'+gbp(Math.abs(net))+'</span></b>';
  document.getElementById("mBal").innerHTML = '<small>Balance</small>'+bal+'<div class="tot"><span>Total '+gbp(tot)+'</span><span>'+esc(n[0])+' paid '+gbp(paid[0])+' · share '+gbp(share[0])+'</span><span>'+esc(n[1])+' paid '+gbp(paid[1])+' · share '+gbp(share[1])+'</span></div>';
  var html="", lastDay=null, byDay={};
  M.items.forEach(function(e){ byDay[e.spent_on]=(byDay[e.spent_on]||0)+(+e.amount); });
  M.items.forEach(function(e){
    if(e.spent_on!==lastDay){ lastDay=e.spent_on; html += '<div class="xday"><span>'+esc(dayLabel(e.spent_on))+'</span><span>'+gbp(byDay[e.spent_on])+'</span></div>'; }
    var c=CATS.find(function(x){return x[0]===e.category;})||CATS[6], sh=+e.other_share, p=e.paid_by;
    var how = sh===0.5 ? "split 50/50" : sh===1 ? n[1-p]+" owes it all" : sh===0 ? "not split" : Math.round(sh*100)+"% for "+n[1-p];
    html += '<div class="xrow"><span class="ic" aria-hidden="true">'+c[1]+'</span><div class="d"><b>'+esc(e.description)+'</b><span>'+esc(n[p])+' paid · '+esc(how)+'</span></div><div class="r"><b>'+gbp(+e.amount)+'</b><button type="button" class="del" data-id="'+e.id+'">Delete</button></div></div>';
  });
  var list=document.getElementById("mList");
  list.innerHTML = html || '<p class="empty">Nothing yet. The first round is on whoever adds it.</p>';
  list.querySelectorAll(".del").forEach(function(b){ b.addEventListener("click",function(){
    if(!b.classList.contains("armed")){ b.classList.add("armed"); b.textContent="Tap to confirm"; setTimeout(function(){ b.classList.remove("armed"); b.textContent="Delete"; },3500); return; }
    b.disabled=true; rpc("uktrip_delete",{p_code:M.code,p_id:+b.dataset.id}).then(load).catch(showErr);
  }); });
  drawBudget();
  drawPickers();
}
/* planned against spent, per person, from the shares in the expense list */
function drawBudget(){
  var n=M.names, by={}, known={};
  M.items.forEach(function(e){ var a=+e.amount, o=a*(+e.other_share), p=e.paid_by, c=e.category; by[c]=by[c]||[0,0]; by[c][1-p]+=o; by[c][p]+=a-o; });
  var rows = BUDGET.map(function(b){
    var v=[0,0]; b[1].forEach(function(c){ known[c]=1; if(by[c]){ v[0]+=by[c][0]; v[1]+=by[c][1]; } });
    var plan = b[2]===b[3] ? "~"+gbp(b[3]) : gbp(b[2])+"–"+b[3];
    return '<div class="bud"><div class="bud-h"><b>'+esc(b[0])+'</b><span>planned '+plan+' each</span></div>'+[0,1].map(function(i){
      var pct=Math.min(100,Math.round(100*v[i]/b[3])), over=v[i]>b[3];
      return '<div class="bud-r'+(over?" over":"")+'"><span>'+esc(n[i])+'</span><i><u style="width:'+pct+'%"></u></i><b>'+gbp(v[i])+'</b></div>';
    }).join("")+'</div>';
  }).join("");
  var extra=[0,0]; Object.keys(by).forEach(function(c){ if(!known[c]){ extra[0]+=by[c][0]; extra[1]+=by[c][1]; } });
  document.getElementById("mBudget").innerHTML = '<h2>Plan against spent</h2><p class="sub">Each person\'s share so far. Add pre-paid bookings (sleeper, hotels) as expenses to see the full picture.</p>'+rows+
    (extra[0]+extra[1]>0?'<p class="sub">Outside the plan (shopping, other): '+esc(n[0])+' '+gbp(extra[0])+' · '+esc(n[1])+' '+gbp(extra[1])+'</p>':'');
}
function showErr(e){ var el=document.getElementById("mErr"); el.textContent=e.message||String(e); el.hidden=false; }
function stamp(){ var d=new Date(); document.getElementById("mSync").textContent="Synced "+d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}); }
function load(){
  if(!M.code) return Promise.resolve();
  return rpc("uktrip_list",{p_code:M.code}).then(function(j){
    M.names=j.names||M.names; M.items=j.expenses||[]; store(TRIP.key+"-code",M.code); pull();
    document.getElementById("mLock").hidden=true; document.getElementById("mApp").hidden=false; drawMoney(); stamp();
  }).catch(function(e){
    if(/wrong trip code/.test(e.message)){ M.code=""; store(TRIP.key+"-code",""); document.getElementById("mApp").hidden=true; document.getElementById("mLock").hidden=false; var le=document.getElementById("mLockErr"); le.textContent="That code didn't work. Check it and try again."; le.hidden=false; }
    else { document.getElementById("mSync").textContent="Offline: showing the last list"; }
  });
}
function openMoney(){
  if(!M.day) M.day=defaultDay();
  document.getElementById("mLock").hidden=!!M.code; if(!M.code){ document.getElementById("mApp").hidden=true; }
  load(); clearInterval(M.timer); M.timer=setInterval(function(){ if(view==="money" && !document.hidden) load(); },20000);
}
document.getElementById("mLockForm").addEventListener("submit",function(e){ e.preventDefault(); M.code=document.getElementById("mCode").value.trim().toUpperCase(); document.getElementById("mLockErr").hidden=true; load(); });
document.getElementById("mForm").addEventListener("submit",function(e){
  e.preventDefault(); if(M.busy) return;
  var desc=document.getElementById("mDesc").value.trim(), amt=parseFloat(document.getElementById("mAmt").value.replace(",","."));
  if(!desc){ showErr(new Error("Add a short description.")); return; }
  if(!(amt>0)){ showErr(new Error("Enter an amount in pounds.")); return; }
  document.getElementById("mErr").hidden=true; M.busy=true; document.getElementById("mAdd").disabled=true;
  rpc("uktrip_add",{p_code:M.code,p_description:desc,p_amount:amt,p_currency:"GBP",p_paid_by:M.payer,p_other_share:M.split,p_category:M.cat,p_spent_on:M.day}).then(function(){
    document.getElementById("mDesc").value=""; document.getElementById("mAmt").value=""; return load();
  }).catch(showErr).then(function(){ M.busy=false; document.getElementById("mAdd").disabled=false; });
});
document.getElementById("mRename").addEventListener("click",function(){
  var f=document.getElementById("mRenameForm");
  if(f){ f.remove(); return; }
  f=document.createElement("form"); f.id="mRenameForm"; f.className="row2"; f.style.gridTemplateColumns="1fr 1fr auto";
  f.innerHTML='<input class="fld" value="'+esc(M.names[0])+'" maxlength="20" aria-label="First name"><input class="fld" value="'+esc(M.names[1])+'" maxlength="20" aria-label="Second name"><button class="btn" type="submit">Save</button>';
  this.closest(".mcard").appendChild(f);
  f.addEventListener("submit",function(ev){ ev.preventDefault(); var v=[].map.call(f.querySelectorAll("input"),function(i){return i.value.trim();});
    rpc("uktrip_set_names",{p_code:M.code,p_names:v}).then(function(){ f.remove(); return load(); }).catch(showErr); });
});
document.getElementById("mShare").addEventListener("click",function(){
  var url=location.origin+location.pathname+"?code="+encodeURIComponent(M.code)+"#money", b=this;
  (navigator.clipboard?navigator.clipboard.writeText(url):Promise.reject()).then(function(){ b.textContent="Link copied"; },function(){ b.textContent=url; }).then(function(){ setTimeout(function(){ b.textContent="Copy invite link"; },4000); });
});
(function(){ var q=new URLSearchParams(location.search).get("code"); if(q){ M.code=q.trim().toUpperCase(); store(TRIP.key+"-code",M.code); history.replaceState(null,"",location.pathname+location.hash); } })();
document.addEventListener("visibilitychange",function(){ if(!document.hidden && view==="money") load(); });

/* ---------- live sync: ticks, picks and tickets shared through the trip code ----------
   Each change is one key: "t:<check id>" tick, "p:<pick id>" pick, "x:<ticket id>" ticket (null = removed).
   Changes queue on the phone and go up one by one, so nothing is lost without signal.
   Every 20 s (while the page is open) the shared copy comes down; queued keys win until they are sent. */
var SYNC = {flushing:false, last:null, err:""};
function syncOn(){ return !!M.code; }
function push(k, v){ S.pending = S.pending||{}; S.pending[k] = (v===undefined ? null : v); save(); flush(); drawSync(); }
function queueAll(){
  S.pending = S.pending||{};
  Object.keys(S.ticks).forEach(function(k){ S.pending["t:"+k] = S.ticks[k]; });
  Object.keys(S.picks).forEach(function(k){ S.pending["p:"+k] = S.picks[k]; });
  S.tickets.forEach(function(t){ S.pending["x:"+t.id] = t; });
  save(); flush();
}
function flush(){
  if(!syncOn() || SYNC.flushing) return;
  var keys = Object.keys(S.pending||{}); if(!keys.length){ drawSync(); return; }
  var k = keys[0], v = S.pending[k], sent = JSON.stringify(v);
  SYNC.flushing = true;
  rpc("uktrip_state_set", {p_code:M.code, p_key:k, p_value:v}).then(function(){
    if(S.pending && JSON.stringify(S.pending[k])===sent) delete S.pending[k];
    save(); SYNC.flushing = false; SYNC.err = ""; flush();
  }).catch(function(e){ SYNC.flushing = false; syncErr(e); });
}
function cleanTicket(v, id){ var s=function(x,n){ return String(x==null?"":x).slice(0,n||80); }; return {id:s(id,40), title:s(v.title), ref:s(v.ref), url:safeUrl(v.url), note:s(v.note,160)}; }
function applyRemote(j){
  var before = JSON.stringify([S.ticks,S.picks,S.tickets]), pend = S.pending||{};
  Object.keys(j||{}).forEach(function(k){
    if(Object.prototype.hasOwnProperty.call(pend,k)) return;
    var v = j[k] ? j[k].v : null, kind = k.charAt(0), id = k.slice(2);
    if(!id || k.charAt(1)!==":") return;
    if(kind==="t") S.ticks[id] = v ? 1 : 0;
    else if(kind==="p"){ if(typeof v==="number") S.picks[id] = v; else delete S.picks[id]; }
    else if(kind==="x"){
      var i = S.tickets.findIndex(function(x){ return x.id===id; });
      if(v && typeof v==="object"){ var c = cleanTicket(v,id); if(i>=0) S.tickets[i]=c; else S.tickets.push(c); }
      else if(i>=0) S.tickets.splice(i,1);
    }
  });
  if(JSON.stringify([S.ticks,S.picks,S.tickets])!==before){ save(); refreshShared(); }
}
function refreshShared(){
  drawChecks(); drawTix(); updateNow();
  if(view==="plan"){ var keep = sheetIdx, y = window.scrollY; renderDay(); window.scrollTo(0,y); if(keep>=0){ sheetIdx = keep; drawSheet(); } }
}
function pull(){
  if(!syncOn() || document.hidden) return;
  SYNC.at = Date.now();
  if(S.syncCode!==M.code){ S.syncCode = M.code; queueAll(); }
  rpc("uktrip_state_get", {p_code:M.code}).then(function(j){
    applyRemote(j); SYNC.last = new Date(); SYNC.err = ""; drawSync(); flush();
  }).catch(syncErr);
}
function syncErr(e){
  SYNC.err = /wrong trip code/.test(e && e.message) ? "code" : "offline";
  if(SYNC.err==="code"){ M.code = ""; store(TRIP.key+"-code",""); }
  drawSync();
}
function drawSync(){
  var on = syncOn(), n = Object.keys(S.pending||{}).length, t;
  if(!on) t = SYNC.err==="code" ? 'The trip code didn\'t work. <a href="#money" data-goto="money">Enter it again</a> to share with the other phone.'
                                 : 'Only on this phone. <a href="#money" data-goto="money">Enter the trip code</a> to share ticks, picks and tickets with the other phone.';
  else if(SYNC.err==="offline") t = "No connection. "+(n?n+(n===1?" change":" changes")+" will be shared when you're back online.":"Showing the last shared copy.");
  else if(n) t = "Sharing "+n+(n===1?" change":" changes")+"…";
  else t = "Shared with the other phone"+(SYNC.last?" · updated "+SYNC.last.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}):"")+".";
  document.querySelectorAll(".syncline").forEach(function(el){ el.innerHTML = t; el.classList.toggle("on", on && !SYNC.err); });
  document.getElementById("tixPrivacy").textContent = on ? "Shared between both phones through the trip code. They never appear on the public page." : "Saved on this phone. They never appear on the public page.";
  document.getElementById("shareBox").hidden = on;
}
document.addEventListener("click", function(e){ var a = e.target.closest(".syncline [data-goto]"); if(a){ e.preventDefault(); go(a.dataset.goto); window.scrollTo(0,0); } });
setInterval(pull, 20000);
document.addEventListener("visibilitychange", function(){ if(!document.hidden){ pull(); flush(); } });
window.addEventListener("online", function(){ pull(); flush(); });

/* ---------- routing ---------- */
function go(id){ if(location.hash!=="#"+id) location.hash = id; else route(); }
var lastCity = null;
function route(){
  var h = (location.hash||"").slice(1);
  if(h.indexOf("sync=")===0){ applySync(h.slice(5)); history.replaceState(null,"",location.pathname+location.search+"#tips"); h="tips"; }
  if(h==="tips"){ view="tips"; drawChecks(); drawTix(); }
  else if(h==="money"){ view="money"; }
  else {
    view="plan"; var i = DAYS.findIndex(function(d){return d.id===h;});
    if(i<0 && !h){ var ti=todayIndex(); if(ti>=0) i=ti; }
    cur = i<0 ? cur : i;
  }
  document.getElementById("planView").style.display = view==="plan"?"flex":"none";
  document.getElementById("tipsView").hidden = view!=="tips";
  document.getElementById("moneyView").hidden = view!=="money";
  document.getElementById("vMoney").setAttribute("aria-pressed", view==="money");
  if(view==="money") openMoney(); else clearInterval(M.timer);
  document.getElementById("vPlan").setAttribute("aria-pressed", view==="plan");
  document.getElementById("vTips").setAttribute("aria-pressed", view==="tips");
  updateNow();
  if(typeof SYNC!=="undefined" && Date.now()-(SYNC.at||0)>4000) pull();  /* switching day or tab also checks for the other phone's changes */
  if(view==="plan"){
    DAYS.forEach(function(d,i){ var t=document.getElementById("tab-"+d.id); t.setAttribute("aria-selected", i===cur); t.tabIndex = i===cur?0:-1; });
    var st = document.getElementById("tab-"+DAYS[cur].id); if(tabs.scrollWidth>tabs.clientWidth) tabs.scrollTo({left:st.offsetLeft-18,behavior:"smooth"});
    var d = DAYS[cur], c = CENTERS[d.city];
    proj = makeProj(c[0], c[1]); focusIdx = -1;
    renderDay();
    if(lastCity!==d.city || !baseG){ buildBase(); lastCity=d.city; }
    requestAnimationFrame(fit);
  }
}
tabs.addEventListener("keydown",function(e){
  if(e.key!=="ArrowRight" && e.key!=="ArrowLeft") return;
  var n = (cur + (e.key==="ArrowRight"?1:DAYS.length-1))%DAYS.length; go(DAYS[n].id); document.getElementById("tab-"+DAYS[n].id).focus();
});
document.getElementById("vPlan").addEventListener("click",function(){ go(DAYS[cur].id); });
document.getElementById("vTips").addEventListener("click",function(){ go("tips"); });
document.getElementById("vMoney").addEventListener("click",function(){ go("money"); });
document.querySelectorAll("#tipsView [data-goto]").forEach(function(a){ a.addEventListener("click",function(e){ e.preventDefault(); go(a.dataset.goto); window.scrollTo(0,0); }); });
window.addEventListener("hashchange", route);
var rt; window.addEventListener("resize",function(){ clearTimeout(rt); rt=setTimeout(function(){ if(view==="plan"){ drawMapToggle(); fit(); } },150); });
drawChecks(); drawTix(); drawSync();
route();
pull();

/* ---------- works without signal once it has been opened ---------- */
if("serviceWorker" in navigator && (location.protocol==="https:" || location.hostname==="localhost")){
  navigator.serviceWorker.register("sw.js").then(function(){ var o=document.getElementById("offline"); if(o) o.textContent="Saved on this phone: the plan opens without signal."; }).catch(function(){});
}
