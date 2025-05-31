import dbConnect from "@/lib/dbConnect";
import Card from "@/models/Card";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();
     
    // Parse the incoming card data
    const {
      email,
      product,
      rating,
      text,
      citations = [],
      recommendations = [],
      suggestedQuestions = [],
    } = req.body;

    // Basic required fields check
    if (!email || !product || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create and save the card
    const card = await Card.create({
      email,
      product,
      rating,
      text,
      citations,
      recommendations,
      suggestedQuestions,
    });

    // Respond with the saved card
    res.status(201).json(card);
  } catch (error) {
    console.error("[api/createCard]", error);
    res.status(500).json({ error: "Failed to save card" });
  }
}