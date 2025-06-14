export const config = { api: { bodyParser: false }, runtime: "nodejs" };

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }

    let body = "";
    await new Promise((resolve, reject) => {
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", resolve);
        req.on("error", reject);
    });

    let parsed;
    try {
        parsed = JSON.parse(body || "{}");
    } catch {
        res.status(400).json({ error: "Invalid JSON" });
        return;
    }
    const { type, prompt, latitude, longitude } = parsed;

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
                longitude,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            res.status(response.status).json({ error: `FastAPI error: ${errorText}` });
            return;
        }

        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        });

        const decoder = new TextDecoder();
        const reader = response.body.getReader();

        let logBuffer = "";
        let resultBuffer = "";
        let inResult = false;
        const sep = "===RESULT===";

        async function stream() {
            while (true) {
                const { value, done } = await reader.read();
                if (value) {
                    const chunk = decoder.decode(value, { stream: !done });

                    // If not in result, keep looking for sep
                    if (!inResult) {
                        logBuffer += chunk;
                        let sepIdx = logBuffer.indexOf(sep);

                        // If sep found, split logs/result
                        if (sepIdx !== -1) {
                            const logsPart = logBuffer.slice(0, sepIdx);
                            // Emit any remaining logs by line
                            logsPart.split(/\r?\n/).forEach((line) => {
                                if (line.trim()) {
                                    console.log(JSON.stringify(line));
                                    res.write(`event: logs\ndata: ${JSON.stringify(line)}\n\n`);
                                }
                            });
                            resultBuffer = logBuffer.slice(sepIdx + sep.length);
                            inResult = true;
                            logBuffer = "";
                        } else {
                            // Otherwise, stream logs line by line
                            let lines = logBuffer.split(/\r?\n/);
                            // Keep last line in buffer if not complete
                            logBuffer = lines.pop();
                            lines.forEach((line) => {
                                if (line.trim()) {
                                    console.log(JSON.stringify(line));
                                    res.write(`event: logs\ndata: ${JSON.stringify(line)}\n\n`);
                                }
                            });
                        }
                    } else {
                        // After sep, everything is result
                        resultBuffer += chunk;
                    }
                }
                if (done) {
                    // Flush remaining logs (before sep) if any
                    if (!inResult && logBuffer.trim()) {
                        res.write(`event: logs\ndata: ${JSON.stringify(logBuffer.trim())}\n\n`);
                    }
                    // Emit result if found
                    if (inResult) {
                        const resultPart = resultBuffer.trim();
                        let result;
                        if (!resultPart) {
                            result = { error: "No result returned from backend", raw: resultPart };
                        } else {
                            try {
                                result = JSON.parse(resultPart);
                            } catch (e) {
                                result = { error: "Failed to parse result JSON", raw: resultPart };
                            }
                        }
                        console.log(JSON.stringify(result));
                        res.write(`event: result\ndata: ${JSON.stringify(result)}\n\n`);
                    } else {
                        // No result found
                        res.write(`event: error\ndata: ${JSON.stringify({ error: "No result separator found" })}\n\n`);
                    }
                    res.end();
                    break;
                }
            }
        }
        await stream();
    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.toString() });
        }
    }
}