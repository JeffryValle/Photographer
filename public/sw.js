//? Service Worker para caché de sesión
const CACHE_NAME = 'photographer-session-cache';
const IMAGE_CACHE = 'photographer-images';

//? Instalar el service worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

//? Activar y limpiar cachés viejos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

//? Interceptar peticiones
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Solo cachear imágenes
    if (request.destination === 'image') {
        event.respondWith(
            caches.open(IMAGE_CACHE).then((cache) => {
                return cache.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(request).then((response) => {
                        // Solo cachear respuestas válidas
                        if (response.status === 200) {
                            cache.put(request, response.clone());
                        }
                        return response;
                    });
                });
            })
        );
    }
});

//? Limpiar caché cuando no hay clientes activos
self.addEventListener('message', (event) => {
    if (event.data === 'clearCache') {
        event.waitUntil(
            caches.delete(IMAGE_CACHE).then(() => {
                console.log('Caché de imágenes limpiado');
            })
        );
    }
});
