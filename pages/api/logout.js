import * as cookie from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  res.setHeader('Set-Cookie', cookie.serialize('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    expires: new Date(0), // Expire the cookie
    path: '/',
  }));

  res.status(200).json({ message: "Logged out successfully" });
}
