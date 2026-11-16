/* Offline copy of the trip page. Online: always fetch the newest page and refresh the copy.
   No signal: serve the saved copy. Fonts are cached the first time they load. */
var CACHE = "trip-202611162240";
var SHELL = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-512.png"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  var req = e.request, url = new URL(req.url);
  if(req.method !== "GET") return;
  var fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if(url.origin !== location.origin && !fonts) return;            /* expenses and maps go straight to the network */
  if(fonts){
    e.respondWith(caches.match(req).then(function(hit){ return hit || fetch(req).then(function(res){ var copy=res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); return res; }); }));
    return;
  }
  e.respondWith(fetch(req).then(function(res){
    if(res.ok){ var copy=res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
    return res;
  }).catch(function(){
    return caches.match(req, {ignoreSearch:true}).then(function(hit){ return hit || caches.match("index.html"); });
  }));
});
