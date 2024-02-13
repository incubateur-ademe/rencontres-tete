import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded ? decoded : null;
  } catch (err) {
    console.error('Error verifying token:', err);
    return null;
  }
};
