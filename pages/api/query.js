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

        // Support res.flush for streaming (required by Node.js HTTP API, often present in Express, sometimes in Vercel serverless)
        if (typeof res.flush !== "function") {
            // Add a no-op if not present (won't help in all platforms, but avoids crash)
            res.flush = () => {};
        }

        const decoder = new TextDecoder();
        const reader = response.body.getReader();

        let logBuffer = "";
        let resultBuffer = "";
        let inResult = false;
        const sep = "===RESULT===";

        // Heartbeat logic to keep connection alive in serverless
        let heartbeatInterval = setInterval(() => {
            try {
                res.write(`event: heartbeat\ndata: {}\n\n`);
                res.flush();
            } catch (e) {
                clearInterval(heartbeatInterval);
            }
        }, 5000);

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
                                    res.write(`event: logs\ndata: ${JSON.stringify(line)}\n\n`);
                                    res.flush();
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
                                    res.write(`event: logs\ndata: ${JSON.stringify(line)}\n\n`);
                                    res.flush();
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
                        res.flush();
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
                        res.write(`event: result\ndata: ${JSON.stringify(result)}\n\n`);
                        res.flush();
                    } else {
                        // No result found
                        res.write(`event: error\ndata: ${JSON.stringify({ error: "No result separator found" })}\n\n`);
                        res.flush();
                    }
                    res.end();
                    clearInterval(heartbeatInterval);
                    break;
                }
            }
        }
        await stream();
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({ error: err.toString() });
        }
    }
}