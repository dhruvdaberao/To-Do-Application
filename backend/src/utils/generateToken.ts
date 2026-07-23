import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key';
  return jwt.sign({ userId, email }, secret, {
    expiresIn: '7d', // Token Expiry: 7 days
  });
};
