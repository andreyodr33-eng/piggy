const CACHE_NAME = "abcphonics-v6";
const CORE_FILES = [ 
    "./", 
    "./index.html",
    "./manifest.json",
    "./icons/icon-32.png",
    "./icons/icon-180.png",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];
const CARD_FILES = [ "S", "A", "T", "I2", "I", "P", "N", "C", "K", "E",
                    "H", "R", "M", "D", "G", "O", "U", "L", "F", "B",
                    "J", "Z", "W", "V", "Y", "X"
                   ].flatMap(name => [
                       `./letters/${name}.png,` 
                       `./icons/icon-${name}.png`
                   ]).concat([ 
                       "ai", "oa", "ie", "ee", "or", "ng", "oo2", "oo",
                       "ch", "sh", "th2", "th", "qu", "ou", "oi", "ue",
                       "er", "ar"
                   ].flatMap(name => [ 
                       `./letters/${name}.png,` 
                       `./icons/icon-${name}.png`
                   ]));
const SOUND_FILES = [ "s", "a", "t", "i", "p", "n", "h", "c", "k", "e", 
                     "r", "m", "d", "g", "o", "u", "l", "f", "b", "ai",
                     "j", "oa", "ie", "ee", "or", "z", "w", "ng", "v",
                     "oo", "oo2", "y", "x", "ch", "sh", "th", "th2", 
                     "qu", "ou", "oi", "ue", "er", "ar"
                    ].map(name => `./sounds/${name}.wav`);
const ALL_FILES = [
    ...CORE_FILES,
    ...CARD_FILES,
    ...SOUND_FILES
];
self.addEventListener("install", event => { 
    event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => cache.addAll(ALL_FILES))
          .then(() => self.skipWaiting())
    );
});
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
         .then(keys => Promise.all(
             keys 
             .filter(key => key === "abcphonics-v4")
             .map(key => caches.delete(key))
         ))
        .then(() => self.clients.claim())
    );
});
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") { 
        return;
    }
event.respondWith(
    caches.open(CACHE_NAME)
        .then(cache => cache.match(event.request))
        .then(response => {
            return response || fetch(event.request);
        })
);
});
