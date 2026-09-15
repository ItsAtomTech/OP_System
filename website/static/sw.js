const CACHE_NAME = 'orpr-cache-v1';
const STATIC_ASSETS = [
    '/',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});


// Notification Serction Goes here ================

// ==========================================
// Muku's Service Worker Notification Observer
// File: sw.js
// ==========================================

const NOTIF_CACHE_NAME = 'muku-notif-store-v1';
const NOTIF_KEY = 'prev_total_notifications';
const POLL_INTERVAL = 3000; // Polls every 5 seconds

// Read stored count from Cache Storage (persists across SW restarts)
async function getStoredCount() {
    try {
        const cache = await caches.open(NOTIF_CACHE_NAME);
        const response = await cache.match(NOTIF_KEY);
        if (response) {
            const text = await response.text();
            return parseInt(text, 10) || 0;
        }
    } catch (e) {
        console.error("Failed to read stored count:", e);
    }
    return 0;
}

// Save stored count to Cache Storage
async function setStoredCount(count) {
    try {
        const cache = await caches.open(NOTIF_CACHE_NAME);
        await cache.put(NOTIF_KEY, new Response(count.toString()));
    } catch (e) {
        console.error("Failed to save count:", e);
    }
}


// Main background checking logic
async function observeNewNotification() {
    try {
        // Querying your existing Flask route without modifying it
        const response = await fetch('/get_server_notifications', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) return;

        const res = await response.json();
        if (!res) return;

        const prevNotifications = await getStoredCount();

        // Check if a new notification arrived (higher count than before)
        if (prevNotifications !== 0 && prevNotifications < res.total_notifications) {
            console.log("A Notification detected by Service Worker");

            // Dispatch system level notification when app is closed/in background
            if (self.Notification && self.Notification.permission === 'granted') {
                self.registration.showNotification("New Notification!", {
                    body: "You have a new Notification!",
                    icon: "/static/icon.png",
                    badge: "/static/badge.png",
                    tag: "pwa-notification",
                    renotify: true,
                    data: {
                        unseen: res.unseen_notifications,
                        total: res.total_notifications
                    }
                });
            }
        }

        // Always update stored count to track state
        await setStoredCount(res.total_notifications);

    } catch (err) {
        console.error("Service worker notification check failed:", err);
    } finally {
        // Loop the check continuous in the background
        setTimeout(observeNewNotification, POLL_INTERVAL);
    }
}

// Start background check when Service Worker activates
self.addEventListener('activate', (event) => {
    event.waitUntil(
        self.clients.claim().then(() => {
            observeNewNotification();
        })
    );
});

// Handle clicking on the notification banner
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Focus open tab if available, or open new window
            for (const client of clientList) {
                if ('focus' in client) return client.focus();
            }
            if (self.clients.openWindow) return self.clients.openWindow('/');
        })
    );
});