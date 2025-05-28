export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    const { type, prompt, latitude, longitude} = req.body;
    try {
            const response = await fetch(`${process.env.FASTAPI_BASE_URL}/ask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.FASTAPI_API_KEY,
                },
                body: JSON.stringify({
                    user_query: prompt,
                    type: Number(type),
                    latitude,
                    longitude
                    }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                return res.status(response.status).json({ error: `FastAPI error: ${errorText}` });
            }
            const data = await response.json();
            console.log(data);
            return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
}
