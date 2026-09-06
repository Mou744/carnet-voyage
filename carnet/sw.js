/*
  Service worker du carnet de voyage.

  Principe : l'app est mise en cache intégralement à la première visite, puis
  servie depuis le cache en priorité. En voyage, aucune requête réseau n'est
  nécessaire — le réseau ne sert qu'à récupérer une éventuelle nouvelle version,
  en arrière-plan et sans jamais bloquer l'affichage.

  Les données (lieux, événements, photos) ne passent pas par ici : elles vivent
  dans IndexedDB, côté page.
*/

// Incrémenter cette version publie une mise à jour de l'app.
const VERSION = 'carnet-v3';

const FICHIERS = [
  './voyage.html',
  './manifest.webmanifest',
  './icone-192.png',
  './icone-512.png',
  './icone-maskable-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      // Chaque fichier est ajouté individuellement : un 404 sur une icône ne doit
      // pas faire échouer l'installation complète de l'app.
      .then((cache) => Promise.all(FICHIERS.map((f) => cache.add(f).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(noms.filter((n) => n !== VERSION).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;

  // On ne s'occupe que des GET de notre propre origine.
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((enCache) => {
      // Rafraîchissement silencieux : on met le cache à jour pour la prochaine
      // ouverture, mais on répond immédiatement avec la version locale.
      const reseau = fetch(req)
        .then((rep) => {
          if (rep && rep.ok && rep.type === 'basic') {
            const copie = rep.clone();
            caches.open(VERSION).then((c) => c.put(req, copie)).catch(() => {});
          }
          return rep;
        })
        .catch(() => null);

      if (enCache) return enCache;

      return reseau.then((rep) => {
        if (rep) return rep;
        // Hors ligne et rien en cache : on retombe sur la page principale
        // pour toute navigation, plutôt que sur l'écran d'erreur du navigateur.
        if (req.mode === 'navigate') return caches.match('./voyage.html');
        return new Response('Hors ligne', { status: 503, statusText: 'Hors ligne' });
      });
    })
  );
});

// La page peut demander l'activation immédiate d'une nouvelle version.
self.addEventListener('message', (e) => {
  if (e.data === 'activer-maintenant') self.skipWaiting();
});
