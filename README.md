# Les Rencontres Territoire Engagé Transition écologique

Création d'une plateforme d'inscriptions à des rencontres de l'ADEME partout en France sur les thématiques Climat Air Energie et Economie Circulaire.

## Stockage des fichiers

Les PDF des sessions et les visuels des modules sont envoyés par l'administration vers un bucket Object Storage Scaleway (`lib/storage.js`, région `fr-par`), sous le préfixe `uploads/`.

| Variable | Rôle |
|---|---|
| `S3_BUCKET` | Nom du bucket (`tet-prod-rencontres` en production). Il entre dans l'URL publique des fichiers : `https://<S3_BUCKET>.s3.fr-par.scw.cloud/uploads/…` |
| `S3_ACCESS_KEY_ID` | Access key de la clé d'API Scaleway de l'application |
| `S3_SECRET_ACCESS_KEY` | Secret key associée |

La clé n'a besoin que de `s3:PutObject` sous `uploads/`. La lecture publique vient de la bucket policy, pas d'une ACL posée à l'envoi : un bucket sans cette policy accepte les envois mais sert des URL en 403.

Le bucket, sa policy et la clé de production sont déclarés dans le dépôt quartet (`infra/prod/rencontres.tf`).

## Tests

`npm test` (Vitest) appelle les handlers des routes API avec une base, un SMTP et un réseau simulés (`tests/setup.js`) : pas de base ni de variable d'environnement à fournir. `tests/api-guards.test.js` tient la matrice d'accès de toutes les routes protégées : une nouvelle route protégée s'y ajoute en une ligne.
