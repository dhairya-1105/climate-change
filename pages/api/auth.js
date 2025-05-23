import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.accessToken;

  if (!token) {
    return res.status(401).json({ isLoggedIn: false, error: 'No token found' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ isLoggedIn: true, user });
  } catch (error) {
    return res.status(401).json({ isLoggedIn: false, error: 'Invalid or expired token' });
  }
}
