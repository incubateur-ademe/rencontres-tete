import { verifyToken } from '@/utils/auth';

export default function handler(req, res) {

  const token = req.cookies.auth;
  if (!token) {
    return res.status(200).json({ isAuthenticated: false });
  }

  try {
    const decoded = verifyToken(token); // Vérifiez la validité du token ici
    // Envoyer une réponse avec les informations de l'utilisateur si nécessaire
    return res.status(200).json({ isAuthenticated: true, user: decoded });
  } catch (error) {
    // En cas d'erreur dans la vérification du token
    return res.status(200).json({ isAuthenticated: false });
  }
}
