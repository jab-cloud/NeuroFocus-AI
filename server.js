import http from 'node:http';
import process from 'node:process';

const PORT = Number(process.env.PORT ?? 3000);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

async function handleAiChat(req, res) {
  if (!OPENAI_API_KEY) {
    sendError(res, 503, 'OpenAI API key not configured. Set OPENAI_API_KEY in your environment.');
    return;
  }

  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch (err) {
    sendError(res, 400, 'Invalid JSON payload');
    return;
  }

  const message = String(payload.message || '').trim();
  if (!message) {
    sendError(res, 400, 'Missing message');
    return;
  }

  const requestBody = {
    model: OPENAI_MODEL,
    messages: [
      {
        role: 'system',
        content: `You are FocusMind, an accountability coach that helps users stay focused, reduce distraction, and build healthy routines. Answer in short, supportive, and practical messages. If the user mentions stress, motivation, or focus, include encouraging guidance. Do not generate explicit, sexual, or harmful content.`
      },
      { role: 'user', content: message }
    ],
    max_tokens: 250,
    temperature: 0.8
  };

  try {
    const openaiRes = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      console.error('OpenAI error', openaiRes.status, errorText);
      sendError(res, 502, 'OpenAI service error');
      return;
    }

    const data = await openaiRes.json();
    const responseText = data?.choices?.[0]?.message?.content?.trim();
    if (!responseText) {
      sendError(res, 502, 'Empty response from OpenAI');
      return;
    }

    sendJson(res, 200, { response: responseText });
  } catch (err) {
    console.error('AI proxy error', err);
    sendError(res, 502, 'AI proxy failed');
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'POST' && req.url === '/ai-chat') {
    await handleAiChat(req, res);
    return;
  }

  sendError(res, 404, 'Not found');
});

server.listen(PORT, () => {
  console.log(`FocusMind AI proxy listening on http://localhost:${PORT}`);
  if (!OPENAI_API_KEY) {
    console.warn('Warning: OPENAI_API_KEY is not set. The server will return 503 for AI requests.');
  }
});
