import { buildSurahSystemPrompt } from '../lib/surahContext';

const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php';

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

async function searchWikipedia(query: string): Promise<string> {
  const url = new URL(WIKIPEDIA_API);

  url.searchParams.set('action', 'query');
  url.searchParams.set('generator', 'search');
  url.searchParams.set('gsrsearch', query);
  url.searchParams.set('gsrlimit', '3');
  url.searchParams.set('prop', 'extracts|info');
  url.searchParams.set('exintro', '1');
  url.searchParams.set('explaintext', '1');
  url.searchParams.set('inprop', 'url');
  url.searchParams.set('format', 'json');
  url.searchParams.set('formatversion', '2');

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'RevelationJourney/1.0 (educational website)',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return '';

    const data = await response.json() as {
      query?: {
        pages?: Array<{
          title: string;
          extract?: string;
          fullurl?: string;
        }>;
      };
    };

    const pages = data.query?.pages ?? [];

    return pages
      .filter((page) => page.extract)
      .map((page) =>
        `Title: ${page.title}\nInformation: ${page.extract}\nSource: ${page.fullurl ?? ''}`
      )
      .join('\n\n')
      .slice(0, 6000);
  } catch {
    return '';
  }
}

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

  const lastUserMessage = messages[messages.length - 1].content;

  
  const researchCheck = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `Classify the user's Quran and revelation education question.

Decide two things:

1. RESEARCH:
YES if additional factual research would materially improve a difficult historical, academic, manuscript, or scholarly answer.
NO for greetings, simple questions, and questions answerable reliably without additional research.

2. LENGTH:
SHORT for greetings, definitions, simple factual questions, and straightforward answers.
MEDIUM for explanations, comparisons, and questions requiring several points.
LONG for complex questions requiring detailed historical context, multiple perspectives, or careful analysis.

Be concise by default. Do not classify a question as LONG merely because it is about an important topic.

Return exactly this format:
RESEARCH: YES or NO
LENGTH: SHORT, MEDIUM, or LONG`,
        },
        {
          role: 'user',
          content: lastUserMessage,
        },
      ],
      temperature: 0,
      max_tokens: 20,
      stream: false,
    }),
  }).catch(() => null);

  let needsResearch = false;
  let responseLength: 'short' | 'medium' | 'long' = 'short';

  if (researchCheck?.ok) {
    const researchResult = await researchCheck.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const classification =
      researchResult.choices?.[0]?.message?.content ?? '';

    needsResearch = /\bRESEARCH:\s*YES\b/i.test(classification);

    const lengthMatch = classification.match(
      /\bLENGTH:\s*(SHORT|MEDIUM|LONG)\b/i
    );

    if (lengthMatch) {
      responseLength = lengthMatch[1].toLowerCase() as
        'short' | 'medium' | 'long';
    }
  }

  const responseTokenLimits = {
    short: 220,
    medium: 550,
    long: 1400,
  };

  const researchContext = needsResearch
    ? await searchWikipedia(lastUserMessage)
    : '';


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
          {
            role: 'system',
            content: [
              buildSurahSystemPrompt(),
              researchContext
                ? `ADDITIONAL WIKIPEDIA RESEARCH:\n${researchContext}\n\nUse this information only as supporting background. Evaluate its reliability, do not treat Wikipedia as an Islamic religious authority, and cite the supplied source URLs when using its information.`
                : '',
            ].filter(Boolean).join('\n\n'),
          },
          ...messages,
        ],
        temperature: 0.4,
        max_tokens: responseTokenLimits[responseLength],
        stream: true,
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

  if (!upstream.body) {
    return json({
      error: {
        code: 'EMPTY_STREAM',
        message: 'The AI service did not provide a response stream.',
      },
    }, 502);
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
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
