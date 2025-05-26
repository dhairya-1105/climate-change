import Card from '@/models/Card';
import dbConnect from "@/lib/dbConnect";
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    // Get email from JWT token for security
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.accessToken;
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    let userEmail;
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = user.email;
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { rating, text, citations, recommendations, suggestedQuestions } = req.body;

    // Validate required fields
    if (!rating || !text) {
      return res.status(400).json({ error: 'Rating and text are required' });
    }

    const newCard = new Card({
      email: userEmail, // Use email from JWT token for security
      rating,
      text,
      citations: citations || [],
      recommendations: recommendations || [],
      suggestedQuestions: suggestedQuestions || [],
    });

    const savedCard = await newCard.save();
    return res.status(201).json(savedCard);
  } catch (err) {
    console.error('Error creating card:', err);
    return res.status(500).json({ error: "Server error" });
  }
}