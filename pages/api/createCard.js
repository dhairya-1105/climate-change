import Card from '@/models/Card';
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { email, rating, text, citations, recommendations, suggestedQuestions} = req.body;
  try {
     const newCard = new Card({
        email, rating, text, citations, recommendations, suggestedQuestions,
     });
     await newCard.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}