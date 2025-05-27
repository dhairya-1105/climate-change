import dbConnect from '@/lib/dbConnect';
import Card from '@/models/Card';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    try {
      const cards = await Card.find({ email }).sort({ createdAt: -1 });
      return res.status(200).json(cards);
    } catch (err) {
      return res.status(500).json({ error: 'Error fetching cards' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
