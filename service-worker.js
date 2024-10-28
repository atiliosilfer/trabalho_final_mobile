// Define o nome da sua cache
const CACHE_NAME = 'cep-app-cache-v5';

 
// Lista de recursos a serem armazenados em cache
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './js/model/Item.js',
  './js/app/ItemManager.js',
  './js/client/ExchangeRate.js',
  './js/app/ExpenseApp.js',
  './image/icon.png',
  './image/iconb.png',
];
 
// Evento de instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
          .catch((error) => {
            console.error('Failed to cache one or more resources:', error);
          });
      })
  );
});
 
 
// Evento de ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
 
// Evento fetch
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('exchangerate-api.com')) {
    // Não cacheia as requisições para a API de câmbio
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});