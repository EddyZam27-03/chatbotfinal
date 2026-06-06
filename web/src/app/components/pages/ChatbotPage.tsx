import { useState, useEffect, useRef } from 'react';
import { Send, Bot, ChevronDown } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useDataStore } from '../../stores/dataStore';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  { text: 'Requisitos de ingreso', icon: '📋' },
  { text: 'Malla curricular', icon: '📚' },
  { text: 'Proceso de matrícula', icon: '✍️' },
  { text: 'Fechas importantes', icon: '📅' },
  { text: 'Información de contacto', icon: '📞' },
  { text: 'Costos y aranceles', icon: '💰' },
];

export function ChatbotPage() {
  const { chatbotKnowledge } = useDataStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  marked.setOptions({ breaks: true, gfm: true });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    const timer = setTimeout(() => {
      setMessages([{
        id: '1',
        type: 'bot',
        content: 'Hola, soy tu **Asistente Académico** de ULEAM El Carmen. Puedo ayudarte con información sobre admisión, malla curricular, matrículas y más. ¿En qué puedo ayudarte?',
        timestamp: new Date(),
      }]);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

  const generateBotResponse = (query: string): string => {
    const q = query.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    for (const item of chatbotKnowledge) {
      const matched = item.keywords.some((kw) => {
        const normalizedKw = kw.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        return q.includes(normalizedKw);
      });
      if (matched) return item.response;
    }

    return `Gracias por tu pregunta. Puedo ayudarte con:

- **Requisitos de ingreso**
- **Malla curricular**
- **Proceso de matrícula**
- **Fechas importantes**
- **Información de contacto**
- **Becas y costos**

Por favor reformula tu pregunta o elige una de las opciones de abajo. Para consultas específicas, también puedes contactarnos directamente al +593 (05) 266-1844.`;
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(messageText),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sanitizeAndRenderMarkdown = (content: string) => {
    const rawMarkup = marked(content) as string;
    const cleanMarkup = DOMPurify.sanitize(rawMarkup);
    return { __html: cleanMarkup };
  };

  return (
    <div className="pt-[72px] h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--uleam-surface-2)' }}>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div
          className="flex items-center justify-between px-4 py-4 border-b"
          style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--uleam-primary)' }}
            >
              <Bot size={20} style={{ color: 'var(--uleam-text-inverse)' }} />
            </div>
            <div>
              <div className="font-semibold" style={{ color: 'var(--uleam-text)' }}>Asistente Académico</div>
              <div className="flex items-center space-x-1 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--uleam-accent-teal)' }} />
                <span>En línea</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages or Empty State */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: 'var(--uleam-surface-2)' }}
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="max-w-2xl text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: 'var(--uleam-surface)' }}
                >
                  <Bot size={40} style={{ color: 'var(--uleam-primary)' }} />
                </div>
                <h2 className="mb-4" style={{ color: 'var(--uleam-text)' }}>¿En qué puedo ayudarte?</h2>
                <p className="mb-8" style={{ color: 'var(--uleam-text-muted)' }}>
                  Pregúntame sobre requisitos, malla curricular, matrícula o cualquier trámite académico
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(suggestion.text)}
                      className="text-left p-4 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5"
                      style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{suggestion.icon}</span>
                        <span style={{ color: 'var(--uleam-text)' }}>{suggestion.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3 ${message.type === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                    style={{
                      backgroundColor: message.type === 'user' ? 'var(--uleam-primary)' : 'var(--uleam-surface)',
                      color: message.type === 'user' ? 'var(--uleam-text-inverse)' : 'var(--uleam-text)',
                      border: message.type === 'bot' ? '1px solid var(--uleam-border)' : 'none',
                    }}
                  >
                    {message.type === 'bot' ? (
                      <div className="bot-message-content" dangerouslySetInnerHTML={sanitizeAndRenderMarkdown(message.content)} />
                    ) : (
                      <p className="leading-relaxed">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div
                    className="rounded-2xl rounded-bl-sm px-5 py-4 border"
                    style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
                  >
                    <div className="flex items-center space-x-2">
                      {[0, 150, 300].map((delay) => (
                        <div
                          key={delay}
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: 'var(--uleam-text-muted)', animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {showScrollButton && messages.length > 0 && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-28 right-8 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--uleam-primary)' }}
            aria-label="Ir al final"
          >
            <ChevronDown size={20} style={{ color: 'var(--uleam-text-inverse)' }} />
          </button>
        )}

        {/* Input Area */}
        <div className="border-t p-4" style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta…"
                rows={1}
                className="flex-1 resize-none px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: 'var(--uleam-border)',
                  maxHeight: '120px',
                  '--tw-ring-color': 'var(--uleam-focus-ring)',
                } as React.CSSProperties}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isTyping}
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:scale-105"
                style={{ backgroundColor: 'var(--uleam-primary)' }}
                aria-label="Enviar mensaje"
              >
                <Send size={20} style={{ color: 'var(--uleam-text-inverse)' }} />
              </button>
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: 'var(--uleam-text-muted)' }}>
              El asistente proporciona información general. Para casos específicos, consulta con la secretaría.
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions Sidebar (Desktop) */}
      <aside
        className="hidden xl:block w-72 border-l"
        style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
      >
        <div className="p-4">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--uleam-text)' }}>Temas sugeridos</h3>
          <div className="space-y-2">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(suggestion.text)}
                className="w-full text-left p-3 rounded-lg border transition-all hover:shadow-sm hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--uleam-surface-2)', borderColor: 'var(--uleam-border)' }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{suggestion.icon}</span>
                  <span className="text-sm" style={{ color: 'var(--uleam-text)' }}>{suggestion.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
