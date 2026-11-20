import { buildSurahSystemPrompt } from '../lib/surahContext';

interface Env {
  OPENROUTER_API_KEY?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

const MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_BODY_BYTES = 24_000;
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_REQUESTS_PER_WINDOW = 8;
const WINDOW_MS = 60_000;

// Best-effort per-isolate protection. This is not a globally shared rate limiter.
const requestWindows = new Map<string, { count: number; startedAt: number }>();

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;

  if (candidate.role !== 'user' && candidate.role !== 'assistant') {
    return false;
  }

  if (typeof candidate.text !== 'string' || candidate.text.trim().length === 0) {
    return false;
  }

  const maxLength = candidate.role === 'user' ? MAX_MESSAGE_LENGTH : 10_000;

  return candidate.text.length <= maxLength;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const current = requestWindows.get(ip);

  if (!current || now - current.startedAt >= WINDOW_MS) {
    requestWindows.set(ip, { count: 1, startedAt: now });
    return true;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) return false;
  current.count += 1;
  return true;
}

async function handlePost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  if (!env.OPENROUTER_API_KEY) {
    return json({ error: { code: 'SERVER_NOT_CONFIGURED', message: 'The learning assistant is not configured on the server yet.' } }, 503);
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return json({ error: { code: 'REQUEST_TOO_LARGE', message: 'Your message is too large. Please shorten it and try again.' } }, 413);
  }

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  if (!checkRateLimit(ip)) {
    return json({ error: { code: 'RATE_LIMITED', message: 'Too many questions were sent in a short time. Please wait a minute and try again.' } }, 429);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json({ error: { code: 'REQUEST_TOO_LARGE', message: 'Your message is too large. Please shorten it and try again.' } }, 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return json({ error: { code: 'INVALID_JSON', message: 'The request could not be read. Please try again.' } }, 400);
  }

  const rawMessages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0 || rawMessages.length > MAX_HISTORY_MESSAGES) {
    return json({ error: { code: 'INVALID_HISTORY', message: 'Please start a new conversation or shorten the chat history.' } }, 400);
  }

  if (!rawMessages.every(isChatMessage) || rawMessages[rawMessages.length - 1]?.role !== 'user') {
    return json({ error: { code: 'INVALID_MESSAGE', message: 'Please send a valid question.' } }, 400);
  }

  const messages = rawMessages.map((message) => ({
    role: message.role,
    content: message.text.trim(),
  }));

  let upstream: Response;
  try {
    upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://revelationjourney.pages.dev',
        'X-Title': 'Revelation Journey',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: buildSurahSystemPrompt() },
          ...messages,
        ],
        temperature: 0.4,
        max_tokens: 800,
        stream: false,
      }),
    });
  } catch {
    return json({ error: { code: 'UPSTREAM_UNAVAILABLE', message: 'The AI service could not be reached. Please try again shortly.' } }, 502);
  }

  if (!upstream.ok) {
    if (upstream.status === 429) {
      return json({ error: { code: 'PROVIDER_RATE_LIMITED', message: 'The free AI service is busy or its usage limit has been reached. Please try again later.' } }, 429);
    }
    if (upstream.status === 401 || upstream.status === 403) {
      return json({ error: { code: 'API_KEY_REJECTED', message: 'The server could not authenticate with the AI provider. Please check its server-side configuration.' } }, 502);
    }
    if (upstream.status === 404) {
      return json({ error: { code: 'MODEL_UNAVAILABLE', message: 'The selected free AI model is temporarily unavailable. No paid model will be used as a fallback.' } }, 503);
    }
    return json({ error: { code: 'AI_REQUEST_FAILED', message: 'The AI service could not answer just now. Please try again later.' } }, 502);
  }

  let result: {
    choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
  };
  try {
    result = await upstream.json() as typeof result;
  } catch {
    return json({ error: { code: 'INVALID_PROVIDER_RESPONSE', message: 'The AI service returned an unreadable response. Please try again.' } }, 502);
  }

  const content = result.choices?.[0]?.message?.content;
  const answer = typeof content === 'string'
    ? content.trim()
    : Array.isArray(content)
      ? content.filter((part) => part.type === 'text' && typeof part.text === 'string').map((part) => part.text).join('\n').trim()
      : '';

  if (!answer) {
    return json({ error: { code: 'EMPTY_RESPONSE', message: 'The AI service returned an empty answer. Please try asking in a different way.' } }, 502);
  }

  return json({ answer });
}

export async function onRequest({ request, env }: { request: Request; env: Env }): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { Allow: 'POST, OPTIONS' } });
  }
  if (request.method !== 'POST') {
    return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST to send a question.' } }, 405);
  }
  return handlePost({ request, env });
}
