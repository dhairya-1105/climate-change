export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  const { type, prompt, latitude, longitude } = req.body;
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

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let buffer = "";
    let resultBuffer = "";
    const decoder = new TextDecoder();
    const reader = response.body.getReader();
    let foundResult = false;
    const sep = "===RESULT===";

    async function streamLogs() {
      while (true) {
        const { value, done } = await reader.read();
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          buffer += chunk;
          if (!foundResult) {
            const sepIdx = buffer.indexOf(sep);
            if (sepIdx !== -1) {
              // Found result separator
              const logsPart = buffer.slice(0, sepIdx).trim();
              res.write(`event: logs\ndata: ${JSON.stringify(logsPart)}\n\n`);
              resultBuffer = buffer.slice(sepIdx + sep.length);
              foundResult = true;
              buffer = ""; // clear logs buffer
            } else {
              // Stream logs so far
              console.log(JSON.stringify(buffer));
              res.write(`event: logs\ndata: ${JSON.stringify(buffer)}\n\n`);
              buffer = "";
            }
          } else {
            // Already found separator, keep buffering result until done
            resultBuffer += chunk;
          }
        }
        if (done) {
          if (foundResult) {
            // After stream ends, parse result JSON (may be multi-chunk)
            const resultPart = resultBuffer.trim();
            console.log(resultPart);
            let result;
            if (resultPart.length === 0) {
              result = { error: "No result returned from backend", raw: resultPart };
            } else {
              try {
                result = JSON.parse(resultPart);
              } catch (e) {
                result = { error: "Failed to parse result JSON", raw: resultPart };
              }
            }
            res.write(`event: result\ndata: ${JSON.stringify(result)}\n\n`);
          } else {
            res.write(`event: error\ndata: ${JSON.stringify({ error: "No result separator found" })}\n\n`);
          }
          res.end();
          break;
        }
      }
    }
    await streamLogs();
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.toString() });
    }
  }
}