// Limite le nombre d'appels par adresse IP sur une fenêtre glissante simple.
// ponytail: compteur en mémoire, propre à chaque process. Suffit pour une
// instance ; avec plusieurs instances, passer par un stockage partagé.
const hits = new Map();

// Le proxy (Traefik) ajoute l'IP du client en DERNIER dans X-Forwarded-For :
// les entrées précédentes viennent du client et ne sont pas fiables. Suppose
// que le conteneur n'est joignable qu'à travers ce proxy, ce qui est le cas
// sur Coolify comme sur Koyeb.
const clientIp = (req) =>
  (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.socket?.remoteAddress || '';

// Renvoie false (et répond 429) si la limite est dépassée. Compté par IP, ou
// par `subject` s'il est fourni (ex. l'adresse email visée).
export const rateLimit = (req, res, name, max, windowMs, subject = clientIp(req)) => {
  const now = Date.now();
  if (hits.size > 10000) {
    for (const [k, e] of hits) if (e.reset < now) hits.delete(k);
  }
  const key = `${name}:${subject}`;
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (++entry.count > max) {
    res.status(429).json({ success: false, error: 'Trop de tentatives, réessayez dans quelques minutes.' });
    return false;
  }
  return true;
};
