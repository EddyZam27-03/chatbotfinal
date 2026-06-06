import { useState, useEffect } from 'react';
import { Search, ChevronDown, MessageSquare, HelpCircle } from 'lucide-react';
import { Link } from 'react-router';
import * as Accordion from '@radix-ui/react-accordion';
import { faqService, type FAQItem } from '../../services/faqService';

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const response = await faqService.getAll();
      setFaqs(response);
    } catch (error) {
      console.error('Error al cargar FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueCategories = Array.from(new Set(faqs.map((faq) => faq.categoria)));
  const categories = ['Todos', ...uniqueCategories];

  const filteredFAQs = faqs
    .filter((faq) => {
      const matchesSearch =
        faq.pregunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.respuesta.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || faq.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.orden - b.orden);

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <section
        className="py-12 md:py-16 border-b"
        style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-4" style={{ color: 'var(--uleam-text)' }}>Preguntas Frecuentes</h1>
          <p className="text-lg mb-8" style={{ color: 'var(--uleam-text-muted)' }}>
            Encuentra respuestas rápidas a las dudas más comunes
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--uleam-text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar pregunta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: 'var(--uleam-border)',
                backgroundColor: 'var(--uleam-surface)',
                color: 'var(--uleam-text)',
                '--tw-ring-color': 'var(--uleam-focus-ring)',
              } as React.CSSProperties}
            />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-6 border-b" style={{ borderColor: 'var(--uleam-border)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: selectedCategory === category ? 'var(--uleam-primary)' : 'var(--uleam-surface-2)',
                  color: selectedCategory === category ? 'var(--uleam-text-inverse)' : 'var(--uleam-text)',
                  border: selectedCategory === category ? 'none' : '1px solid var(--uleam-border)',
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12" style={{ backgroundColor: 'var(--uleam-surface-2)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle size={48} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--uleam-text-muted)' }} />
              <p style={{ color: 'var(--uleam-text-muted)' }}>
                No se encontraron preguntas que coincidan con tu búsqueda.
              </p>
            </div>
          ) : (
            <Accordion.Root type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Accordion.Item
                  key={faq.id}
                  value={`item-${faq.id}`}
                  className="rounded-xl border overflow-hidden"
                  style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[var(--uleam-surface-2)] group">
                      <div className="flex-1 pr-4">
                        <div className="text-xs font-medium mb-1" style={{ color: 'var(--uleam-primary)' }}>
                          {faq.category}
                        </div>
                        <div className="font-semibold" style={{ color: 'var(--uleam-text)' }}>
                          {faq.question}
                        </div>
                      </div>
                      <ChevronDown
                        size={20}
                        className="flex-shrink-0 transition-transform group-data-[state=open]:rotate-180"
                        style={{ color: 'var(--uleam-text-muted)' }}
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-6 pb-4 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                    <p style={{ color: 'var(--uleam-text-muted)', lineHeight: '1.65' }}>{faq.answer}</p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          )}

          {(searchTerm || selectedCategory !== 'Todos') && filteredFAQs.length > 0 && (
            <p className="text-sm mt-6 text-center" style={{ color: 'var(--uleam-text-muted)' }}>
              {filteredFAQs.length} {filteredFAQs.length === 1 ? 'resultado' : 'resultados'}
            </p>
          )}
        </div>
      </section>

      {/* CTA to Chatbot */}
      <section className="py-12" style={{ backgroundColor: 'var(--uleam-surface)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-2xl p-8 text-center border-2"
            style={{ backgroundColor: 'var(--uleam-surface-2)', borderColor: 'var(--uleam-border-strong)' }}
          >
            <MessageSquare size={48} className="mx-auto mb-4" style={{ color: 'var(--uleam-primary)' }} />
            <h3 className="mb-3" style={{ color: 'var(--uleam-text)' }}>¿No encontraste tu respuesta?</h3>
            <p className="mb-6" style={{ color: 'var(--uleam-text-muted)' }}>
              Pregunta directamente al Asistente Académico para obtener información más específica
            </p>
            <Link
              to="/chatbot"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: 'var(--uleam-primary)', color: 'var(--uleam-text-inverse)' }}
            >
              Abrir Asistente
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
