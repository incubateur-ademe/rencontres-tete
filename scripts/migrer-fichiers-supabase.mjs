// Copie vers le bucket Scaleway les fichiers encore servis par Supabase Storage
// et réécrit leurs URL dans MetasSession (urlsPDF, urlsPDFAval).
// À lancer une fois, avant la suppression du projet Supabase.
//
//   DATABASE_URL=… S3_BUCKET=… S3_ACCESS_KEY_ID=… S3_SECRET_ACCESS_KEY=… \
//     node scripts/migrer-fichiers-supabase.mjs [--apply]
//
// Sans --apply : simulation (vérifie que chaque fichier source existe, n'écrit
// rien). Rejouable : la clé de destination reprend le chemin d'origine, et une
// ligne déjà réécrite n'a plus d'URL Supabase.
import { PrismaClient } from '@prisma/client';
import { uploadPublic } from '../lib/storage.js';

const PREFIXE = 'https://eazuwwpllqueujyivlce.supabase.co/storage/v1/object/public/ademe/';
const URL_SUPABASE = new RegExp(PREFIXE.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&') + '[^"\\\\]+', 'g');
const COLONNES = ['urlsPDF', 'urlsPDFAval'];

const apply = process.argv.includes('--apply');
const prisma = new PrismaClient();
const copies = new Map(); // URL Supabase -> URL Scaleway, ou null si la copie a échoué

async function copier(ancienne) {
  if (copies.has(ancienne)) return copies.get(ancienne);
  let nouvelle = null;
  try {
    const key = decodeURIComponent(ancienne.slice(PREFIXE.length));
    // La bucket policy n'ouvre que uploads/ (écriture et lecture publique).
    if (!key.startsWith('uploads/')) throw new Error('hors de uploads/');
    const reponse = await fetch(ancienne, { method: apply ? 'GET' : 'HEAD' });
    if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
    nouvelle = apply
      // encodeURI laisse # et ? tels quels : ils couperaient l'URL avant la fin de la clé.
      ? encodeURI(await uploadPublic(key, Buffer.from(await reponse.arrayBuffer()), reponse.headers.get('content-type'))).replace(/[#?]/g, encodeURIComponent)
      : `(simulation) ${key}`;
    console.log(`ok     ${ancienne}`);
  } catch (erreur) {
    console.error(`ÉCHEC  ${ancienne} : ${erreur.message}`);
  }
  copies.set(ancienne, nouvelle);
  return nouvelle;
}

const lignes = await prisma.metasSession.findMany({ select: { id: true, urlsPDF: true, urlsPDFAval: true } });
let lignesModifiees = 0;

for (const ligne of lignes) {
  const data = {};
  for (const colonne of COLONNES) {
    // Réécriture sur le JSON sérialisé : indifférente à la forme des entrées.
    const avant = JSON.stringify(ligne[colonne] ?? null);
    for (const ancienne of new Set(avant.match(URL_SUPABASE))) await copier(ancienne);
    // Une seule passe sur les URL entières : une URL préfixe d'une autre ne la touche pas.
    // Copie échouée : l'URL Supabase reste en base, à reprendre au prochain passage.
    const apres = apply ? avant.replace(URL_SUPABASE, url => copies.get(url) || url) : avant;
    if (apres !== avant) data[colonne] = JSON.parse(apres);
  }
  if (Object.keys(data).length) {
    await prisma.metasSession.update({ where: { id: ligne.id }, data });
    lignesModifiees++;
  }
}

// Les liens collés à la main dans les textes riches ne sont pas réécrits : on les signale.
const [{ n: liensDansTextes }] = await prisma.$queryRaw`
  SELECT count(*)::int AS n FROM "MetasSession"
  WHERE "explications" LIKE '%supabase.co%' OR "explicationsAval" LIKE '%supabase.co%'`;

const echecs = [...copies.values()].filter(url => !url).length;
console.log(`\n${apply ? 'Migration' : 'Simulation (relancer avec --apply)'} : ${copies.size} fichier(s), ${echecs} échec(s), ${lignesModifiees} ligne(s) réécrite(s).`);
if (liensDansTextes) console.warn(`${liensDansTextes} session(s) citent encore supabase.co dans explications/explicationsAval : à corriger à la main.`);

await prisma.$disconnect();
process.exit(echecs ? 1 : 0);
