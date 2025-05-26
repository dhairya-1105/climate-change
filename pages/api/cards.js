import dbConnect from '@/lib/dbConnect';
import Card from '@/models/Card';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // Get email from query parameter or JWT token
      let email = req.query.email;
      
      // If no email in query, try to get it from JWT token
      if (!email) {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.accessToken;
        
        if (!token) {
          return res.status(401).json({ error: 'Authentication required' });
        }
        
        try {
          const user = jwt.verify(token, process.env.JWT_SECRET);
          email = user.email;
        } catch (error) {
          return res.status(401).json({ error: 'Invalid or expired token' });
        }
      }

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const cards = await Card.find({ email }).sort({ createdAt: -1 });
      return res.status(200).json(cards);
    } catch (err) {
      console.error('Error fetching cards:', err);
      return res.status(500).json({ error: 'Error fetching cards' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}