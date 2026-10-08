const CACHE_NAME = "abcphonics-v4";
const CORE_FILES = [ "./", "./index.html", "./manifest.json", "./icons/icon-32.png", "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png" ];
self.addEventListener("install", (event) => {
event.waitUntil(

    caches.open(CACHE_NAME)
        .then((cache) => {

            return cache.addAll(CORE_FILES);

        })

);

self.skipWaiting();
});
self.addEventListener("activate", (event) => {
event.waitUntil(

    caches.keys()
        .then((keys) => {

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
        .then((cachedResponse) => {

            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then((networkResponse) => {

                    if (
                        networkResponse &&
                        networkResponse.status === 200
                    ) {

                        const copy =
                            networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {

                                cache.put(
                                    event.request,
                                    copy
                                );

                            });

                    }

                    return networkResponse;

                });

        })

);
});
