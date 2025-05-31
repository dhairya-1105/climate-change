import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.accessToken;

  if (!token) {
    return res.status(200).json({ isLoggedIn: false, error: 'No token found' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const { password, ...safeUser } = user;

    return res.status(200).json({ isLoggedIn: true, user: safeUser });
  } catch (error) {
    return res.status(200).json({ isLoggedIn: false, error: 'Invalid or expired token' });
  }
}