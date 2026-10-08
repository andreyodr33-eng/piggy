const CACHE_NAME = "piggy-v1";
self.addEventListener("install", (event) => {
self.skipWaiting();

event.waitUntil(

    caches.open(CACHE_NAME)
        .then((cache) => {

            return cache.addAll([
                "./",
                "./index.html",
                "./app.js",
                "./style.css",
                "./manifest.json"
            ]);

        })

);
});
self.addEventListener("activate", (event) => {
event.waitUntil(

    caches.keys().then((keys) => {

        return Promise.all(

            keys.map((key) => {

                if (key !== CACHE_NAME) {

                    return caches.delete(key);

                }

            })

        );

    })

);

self.clients.claim();
});
self.addEventListener("fetch", (event) => {
if (event.request.method !== "GET") {
    return;
}

event.respondWith(

    caches.match(event.request)
        .then((cached) => {

            if (cached) {
                return cached;
            }

            return fetch(event.request)
                .then((response) => {

                    const clone =
                        response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {

                            cache.put(
                                event.request,
                                clone
                            );

                        });

                    return response;

                });

        })

);
});
