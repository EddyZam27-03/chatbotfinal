import { useState, useEffect, useRef } from "react";
import { X, Send, Bot, ChevronDown } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { chatbotService } from "../../services/chatbotService";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "Requisitos de ingreso",
  "Malla curricular",
  "Proceso de matrícula",
  "Fechas importantes",
  "Información de contacto",
];

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] =
    useState(false);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  marked.setOptions({ breaks: true, gfm: true });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (isOpen && messages.length > 0) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      setShowScrollButton(
        scrollHeight - scrollTop - clientHeight > 100,
      );
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: "1",
            type: "bot",
            content:
              "Hola, soy tu **Asistente Académico** de ULEAM El Carmen. Puedo ayudarte con información sobre admisión, malla curricular, matrículas y más. ¿En qué puedo ayudarte?",
            timestamp: new Date(),
          },
        ]);
      }, 300);
    }
  };

  const generateBotResponse = async (query: string): Promise<string> => {
    try {
      const response = await chatbotService.query(query, history);
      return response.respuesta;
    } catch (error) {
      console.error('Error al consultar chatbot:', error);
      return `Lo siento, hubo un error al procesar tu consulta. Por favor intenta nuevamente o contacta a soporte técnico.`;
    }
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const botResponse = await generateBotResponse(messageText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      
      // Actualizar historial después de cada intercambio exitoso
      setHistory((prev) => [
        ...prev,
        { role: 'user', content: messageText },
        { role: 'assistant', content: botResponse },
      ]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "Lo siento, hubo un error al procesar tu consulta. Por favor intenta nuevamente.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    if (e.key === "Escape") setIsOpen(false);
  };

  const sanitizeAndRenderMarkdown = (content: string) => {
    const rawMarkup = marked(content) as string;
    const cleanMarkup = DOMPurify.sanitize(rawMarkup);
    return { __html: cleanMarkup };
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-5 right-5 md:bottom-6 md:right-6 w-14 h-14 rounded-full shadow-[var(--uleam-shadow-2)] flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 z-50"
        style={
          {
            backgroundColor: "var(--uleam-primary)",
            "--tw-ring-color": "var(--uleam-focus-ring)",
          } as React.CSSProperties
        }
        aria-label="Abrir asistente"
        title="¿Necesitas ayuda?"
      >
        <Bot
          size={28}
          style={{ color: "var(--uleam-text-inverse)" }}
        />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 flex flex-col bg-card rounded-[var(--radius-widget)] shadow-[var(--uleam-shadow-2)] overflow-hidden"
      style={{
        width: "92vw",
        maxWidth: "360px",
        height: "70vh",
        maxHeight: "520px",
      }}
      role="dialog"
      aria-label="Asistente Académico"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          height: "56px",
          borderColor: "var(--uleam-border)",
          backgroundColor: "var(--uleam-surface)",
        }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--uleam-primary)" }}
          >
            <Bot
              size={20}
              style={{ color: "var(--uleam-text-inverse)" }}
            />
          </div>
          <div>
            <div
              className="font-semibold text-sm"
              style={{ color: "var(--uleam-text)" }}
            >
              Asistente Académico
            </div>
            <div
              className="flex items-center space-x-1 text-xs"
              style={{ color: "var(--uleam-text-muted)" }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "var(--uleam-accent-teal)",
                }}
              />
              <span>En línea</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-lg hover:bg-[var(--uleam-surface-2)] transition-colors"
          style={{ color: "var(--uleam-text-muted)" }}
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div
          className="px-3 py-2 border-b"
          style={{ borderColor: "var(--uleam-border)" }}
        >
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.slice(0, 3).map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(suggestion)}
                className="px-3 py-1.5 text-xs rounded-full border transition-colors hover:shadow-sm"
                style={{
                  borderColor: "var(--uleam-border)",
                  color: "var(--uleam-primary)",
                  backgroundColor: "var(--uleam-surface)",
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
        style={{ backgroundColor: "var(--uleam-surface-2)" }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${message.type === "user" ? "rounded-br-sm" : "rounded-bl-sm"}`}
              style={{
                backgroundColor:
                  message.type === "user"
                    ? "var(--uleam-primary)"
                    : "var(--uleam-surface)",
                color:
                  message.type === "user"
                    ? "var(--uleam-text-inverse)"
                    : "var(--uleam-text)",
                border:
                  message.type === "bot"
                    ? "1px solid var(--uleam-border)"
                    : "none",
              }}
            >
              {message.type === "bot" ? (
                <div
                  className="bot-message-content"
                  dangerouslySetInnerHTML={sanitizeAndRenderMarkdown(
                    message.content,
                  )}
                />
              ) : (
                <p className="text-[15px] leading-relaxed">
                  {message.content}
                </p>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl rounded-bl-sm px-4 py-3 border"
              style={{
                backgroundColor: "var(--uleam-surface)",
                borderColor: "var(--uleam-border)",
              }}
            >
              <div className="flex items-center space-x-1">
                {[0, 150, 300].map((delay) => (
                  <div
                    key={delay}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor:
                        "var(--uleam-text-muted)",
                      animationDelay: `${delay}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-4 w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
          style={{ backgroundColor: "var(--uleam-primary)" }}
        >
          <ChevronDown
            size={18}
            style={{ color: "var(--uleam-text-inverse)" }}
          />
        </button>
      )}

      {/* Input */}
      <div
        className="border-t px-3 py-3"
        style={{
          borderColor: "var(--uleam-border)",
          backgroundColor: "var(--uleam-surface)",
        }}
      >
        <div className="flex items-end space-x-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta…"
            rows={1}
            className="flex-1 resize-none px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 transition-all"
            style={
              {
                borderColor: "var(--uleam-border)",
                maxHeight: "80px",
                "--tw-ring-color": "var(--uleam-focus-ring)",
              } as React.CSSProperties
            }
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:scale-105"
            style={{ backgroundColor: "var(--uleam-primary)" }}
            aria-label="Enviar"
          >
            <Send
              size={18}
              style={{ color: "var(--uleam-text-inverse)" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}