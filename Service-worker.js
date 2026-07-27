/* ==========================================
   English Buddy
   Service Worker
   Version 1.0
========================================== */

const CACHE_NAME = "english-buddy-v1.0.0";

const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./manifest.json",

    "./css/style.css",

    "./js/app.js"

];

// ------------------------------
// Install
// ------------------------------

self.addEventListener("install", event => {

    console.log("Installing Service Worker...");

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            return cache.addAll(FILES_TO_CACHE);

        })

    );

    self.skipWaiting();

});

// ------------------------------
// Activate
// ------------------------------

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if(key !== CACHE_NAME){

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

// ------------------------------
// Fetch
// ------------------------------

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            if(response){

                return response;

            }

            return fetch(event.request)

            .then(networkResponse => {

                return caches.open(CACHE_NAME)

                .then(cache => {

                    cache.put(event.request, networkResponse.clone());

                    return networkResponse;

                });

            })

            .catch(() => {

                return caches.match("./index.html");

            });

        })

    );

});

// ------------------------------
// Background Sync
// ------------------------------

self.addEventListener("sync", event => {

    console.log("Background Sync:", event.tag);

});

// ------------------------------
// Push Notification (Future Use)
// ------------------------------

self.addEventListener("push", event => {

    const options = {

        body: "Time to practice English! 📘",

        icon: "assets/icons/icon-192.png",

        badge: "assets/icons/icon-96.png"

    };

    event.waitUntil(

        self.registration.showNotification(

            "English Buddy",

            options

        )

    );

});
