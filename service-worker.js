const staticCacheName = "Matris 1.0";
const filesToCache = [
	// Pages
	"index.html",
	"offline.html",

	// Manifest
	"manifest.json",

	// Icons
	"assets/icons/icon-72x72.png",
	"assets/icons/icon-96x96.png",
	"assets/icons/icon-128x128.png",
	"assets/icons/icon-144x144.png",
	"assets/icons/icon-152x152.png",
	"assets/icons/icon-192x192.png",
	"assets/icons/icon-384x384.png",
	"assets/icons/icon-512x512.png",
	"assets/icons/favicon.png",

	// Estilo
	"assets/style/style.min.css",

	// JavaScript
	"assets/javascript/main.min.js",

	// Imagens
	"assets/icons/logo.jpg",

	// Fonts
	"assets/fonts/ibm-plex-monobold.woff2",
	"assets/fonts/ibm-plex-monobold.woff",
	"assets/fonts/ibm-plex-monobold.ttf",
];

// Cache on install
this.addEventListener("install", (event) => {
	this.skipWaiting();
	event.waitUntil(
		caches.open(staticCacheName).then((cache) => {
			return cache.addAll(filesToCache);
		})
	);
});

// Clear cache on activate
this.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((cacheName) => cacheName !== staticCacheName)
					.map((cacheName) => caches.delete(cacheName))
			);
		})
	);
});

// Serve from Cache
this.addEventListener("fetch", (event) => {
	event.respondWith(
		caches
			.match(event.request)
			.then((response) => {
				return response || fetch(event.request);
			})
			.catch(() => {
				return caches.match("offline.html");
			})
	);
});
