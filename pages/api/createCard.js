import Card from "@/models/Card";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { email, product, rating, text, citations, recommendations, suggestedQuestions } = req.body;
    if (!email || !text) return res.status(400).json({ error: "Missing required fields." });
    
    const prod = product || "Climate Change Analyzer";

    const card = new Card({
      email,
      product: prod,
      rating,
      text,
      citations,
      recommendations,
      suggestedQuestions,
    });
    await card.save();

    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to save card.", details: err.message });
  }
}