export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    const { prompt, type } = req.body;
    try {
        if (type === 1) {
            const response = await fetch("https://climate-change-nlbh.onrender.com/ask1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.FASTAPI_API_KEY,
                },
                body: JSON.stringify({ prompt }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                return res.status(response.status).json({ error: `FastAPI error: ${errorText}` });
            }
            const data = await response.json();
            console.log(data);
            return res.status(200).json(data);
        } else {
            const response = await fetch("https://climate-change-nlbh.onrender.com/ask2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.FASTAPI_API_KEY,
                },
                body: JSON.stringify({ prompt }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                return res.status(response.status).json({ error: `FastAPI error: ${errorText}` });
            }
            const data = await response.json();
            console.log(data);
            return res.status(200).json(data);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
}
