export default async function handler(req, res) {
    const { prompt, type } = req.body;
    try {
        if (type === 1) {
            const response = await fetch('/script', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });
            const data = await response.json();
            return res.status(200).json(data);
        } else {
            const response = await fetch('/script', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });
            const data = await response.json();
            res.status(200).json(data);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
}
