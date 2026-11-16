# Les Rencontres Territoire Engagé Transition écologique

Création d'une plateforme d'inscriptions à des rencontres de l'ADEME partout en France sur les thématiques Climat Air Energie et Economie Circulaire.
## Tests

`npm test` (Vitest) appelle les handlers des routes API avec une base, un SMTP et un réseau simulés (`tests/setup.js`) : pas de base ni de variable d'environnement à fournir. `tests/api-guards.test.js` tient la matrice d'accès de toutes les routes protégées : une nouvelle route protégée s'y ajoute en une ligne.
