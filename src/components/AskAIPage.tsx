import { useRef, useState } from 'react';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import { OrnamentDivider } from './Decor';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const SUGGESTED_QUESTIONS = [
  'What is the difference between Makkan and Madinan surahs?',
  'Which surah was revealed first?',
  'Why was Surah Yusuf revealed during the Year of Sorrow?',
  'How many surahs were revealed in Makkah vs Madinah?',
  'What themes are common in Makkan surahs?',
];

export function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  const sendQuestion = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    setMessages((m) => [...m, { role: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: 'This is a prototype interface. To enable real AI-powered responses, an AI backend service needs to be configured and connected. Once set up, this assistant will be able to answer your questions about the Makkan and Madinan surahs, their themes, historical context, and more.',
        },
      ]);
      setIsTyping(false);
      setTimeout(scrollToBottom, 100);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuestion(input);
  };

  return (
    <div className="min-h-screen bg-ivory-50 animate-fade-in">
      <div className="mx-auto max-w-3xl px-5 py-12 md:py-20">
        <div className="text-center">
          <p className="font-arabic text-lg text-sage-500">اسأل الذكاء الاصطناعي</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900 md:text-5xl">Ask AI</h1>
          <OrnamentDivider className="mt-5" />
          <p className="mx-auto mt-5 max-w-xl text-charcoal-500">
            Ask questions about the Makkan and Madinan surahs, their themes, and historical context.
          </p>
        </div>

        {/* Configuration notice */}
        <div className="mt-8 rounded-xl border border-sand-200 bg-sand-50/50 px-5 py-4">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-sand-500" />
            <div>
              <p className="text-sm font-medium text-charcoal-800">AI assistant not yet configured</p>
              <p className="mt-1 text-sm text-charcoal-500">
                This is a prototype chat interface. To enable real AI responses, an AI backend service must be connected. You can still explore the suggested questions below.
              </p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="card-surface-elevated mt-8 flex flex-col rounded-2xl" style={{ minHeight: '420px' }}>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6" style={{ maxHeight: '400px' }}>
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sage-100">
                  <MessageCircle className="h-7 w-7 text-sage-600" />
                </div>
                <p className="mt-4 font-serif text-lg text-charcoal-800">Start a conversation</p>
                <p className="mt-1 text-sm text-charcoal-400">Try one of the suggested questions below</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-sage-600 text-white'
                          : 'bg-ivory-100 text-charcoal-700'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-1 rounded-2xl bg-ivory-100 px-4 py-3">
                      <span className="h-2 w-2 animate-pulse-soft rounded-full bg-charcoal-300" style={{ animationDelay: '0s' }} />
                      <span className="h-2 w-2 animate-pulse-soft rounded-full bg-charcoal-300" style={{ animationDelay: '0.2s' }} />
                      <span className="h-2 w-2 animate-pulse-soft rounded-full bg-charcoal-300" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Suggested questions */}
          {messages.length === 0 && (
            <div className="border-t border-charcoal-200/50 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-charcoal-400">Suggested questions</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendQuestion(q)}
                    className="rounded-full border border-charcoal-200 px-3.5 py-1.5 text-xs text-charcoal-600 transition hover:border-sage-300 hover:bg-sage-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-charcoal-200/50 p-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-lg border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-800 placeholder:text-charcoal-300 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex items-center justify-center rounded-lg bg-sage-600 px-4 py-2.5 text-white transition hover:bg-sage-700 disabled:opacity-30"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
