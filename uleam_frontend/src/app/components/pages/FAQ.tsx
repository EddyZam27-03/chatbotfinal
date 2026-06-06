import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Search, ChevronDown, MessageSquare } from 'lucide-react';
import { Link } from 'react-router';
import * as Accordion from '@radix-ui/react-accordion';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Admisión',
    question: '¿Cuáles son los requisitos para ingresar a la carrera?',
    answer:
      'Los requisitos básicos son: título de bachiller notariado, cédula de identidad y papeleta de votación, certificado de notas de secundaria. Además, debes inscribirte en línea, rendir la prueba de admisión y realizar una entrevista personal.',
  },
  {
    category: 'Admisión',
    question: '¿Cuándo son las fechas de inscripción?',
    answer:
      'Las inscripciones para el período 2026 se realizan del 15 al 30 de abril. Las pruebas de admisión están programadas del 5 al 10 de mayo. Te recomendamos estar atento a nuestro sitio web oficial para cualquier actualización.',
  },
  {
    category: 'Admisión',
    question: '¿Cómo es el proceso de admisión?',
    answer:
      'El proceso consta de tres pasos: 1) Inscripción en línea en www.uleam.edu.ec, 2) Rendir la prueba de admisión que evalúa conocimientos generales, y 3) Entrevista personal con el coordinador de carrera.',
  },
  {
    category: 'Carrera',
    question: '¿Cuánto dura la carrera de Administración?',
    answer:
      'La carrera tiene una duración de 8 semestres (4 años académicos) con un total de 240 créditos. Incluye práctica profesional y proyecto de titulación.',
  },
  {
    category: 'Carrera',
    question: '¿Qué materias incluye la malla curricular?',
    answer:
      'La malla incluye materias como Fundamentos de Administración, Contabilidad, Economía, Marketing, Finanzas, Gestión de Recursos Humanos, Planificación Estratégica, Emprendimiento, entre otras. Está organizada en niveles del 1 al 8.',
  },
  {
    category: 'Carrera',
    question: '¿La carrera tiene prácticas preprofesionales?',
    answer:
      'Sí, a partir del sexto semestre los estudiantes realizan prácticas preprofesionales en empresas e instituciones de la región. Esto permite aplicar los conocimientos adquiridos en un entorno real.',
  },
  {
    category: 'Matrícula',
    question: '¿Cuál es el costo de la matrícula?',
    answer:
      'El costo de matrícula por semestre varía entre $350 y $500 según el número de créditos. La matrícula extraordinaria tiene un recargo de $50 adicional. Existen opciones de becas por rendimiento académico.',
  },
  {
    category: 'Matrícula',
    question: '¿Cómo realizo mi matrícula?',
    answer:
      'El proceso tiene tres pasos: 1) Prematrícula en línea donde seleccionas materias y horarios, 2) Validación presencial con documentos actualizados y pago de matrícula, y 3) Confirmación con recibo de pago y horario definitivo.',
  },
  {
    category: 'Matrícula',
    question: '¿Puedo matricularme en materias de diferentes niveles?',
    answer:
      'Sí, siempre que cumplas con los prerrequisitos de cada materia y tu horario lo permita. El sistema académico te indicará qué materias están disponibles según tu avance.',
  },
  {
    category: 'Trámites',
    question: '¿Cómo solicito un certificado de estudios?',
    answer:
      'Debes presentar una solicitud en secretaría con tu cédula de identidad y el comprobante de pago del certificado. El trámite toma entre 3 a 5 días hábiles.',
  },
  {
    category: 'Trámites',
    question: '¿Puedo homologar materias de otra universidad?',
    answer:
      'Sí, puedes solicitar homologación de materias aprobadas en otra institución de educación superior. Debes presentar los programas de estudio (syllabus) y certificado de notas. El proceso lo evalúa el coordinador de carrera.',
  },
  {
    category: 'Trámites',
    question: '¿Cómo me título al terminar la carrera?',
    answer:
      'Para obtener el título debes: completar los 240 créditos de la malla, aprobar las prácticas preprofesionales, desarrollar y defender tu proyecto de titulación, y cumplir con los requisitos administrativos. Los derechos de grado tienen un costo de $200.',
  },
];

const categories = ['Todos', ...Array.from(new Set(faqs.map((faq) => faq.category)))];

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <section
        className="py-12 md:py-16 border-b"
        style={{
          backgroundColor: 'var(--uleam-surface)',
          borderColor: 'var(--uleam-border)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-4" style={{ color: 'var(--uleam-text)' }}>
            Preguntas Frecuentes
          </h1>
          <p className="text-lg mb-8" style={{ color: 'var(--uleam-text-muted)' }}>
            Encuentra respuestas rápidas a las dudas más comunes
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ color: 'var(--uleam-text-muted)' }}
            />
            <input
              type="text"
              placeholder="Buscar pregunta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: 'var(--uleam-border)',
                '--tw-ring-color': 'var(--uleam-focus-ring)',
              } as CSSProperties}
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
                  backgroundColor:
                    selectedCategory === category
                      ? 'var(--uleam-primary)'
                      : 'var(--uleam-surface-2)',
                  color:
                    selectedCategory === category
                      ? 'var(--uleam-text-inverse)'
                      : 'var(--uleam-text)',
                  border:
                    selectedCategory === category ? 'none' : '1px solid var(--uleam-border)',
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
            <div className="text-center py-12">
              <p style={{ color: 'var(--uleam-text-muted)' }}>
                No se encontraron preguntas que coincidan con tu búsqueda.
              </p>
            </div>
          ) : (
            <Accordion.Root type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq, idx) => (
                <Accordion.Item
                  key={idx}
                  value={`item-${idx}`}
                  className="rounded-xl border overflow-hidden"
                  style={{
                    backgroundColor: 'var(--uleam-surface)',
                    borderColor: 'var(--uleam-border)',
                  }}
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[var(--uleam-surface-2)] group">
                      <div className="flex-1 pr-4">
                        <div
                          className="text-xs font-medium mb-1"
                          style={{ color: 'var(--uleam-primary)' }}
                        >
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
                    <p style={{ color: 'var(--uleam-text-muted)', lineHeight: '1.65' }}>
                      {faq.answer}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          )}
        </div>
      </section>

      {/* CTA to Chatbot */}
      <section className="py-12" style={{ backgroundColor: 'var(--uleam-surface)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-2xl p-8 text-center border-2"
            style={{
              backgroundColor: 'var(--uleam-surface-2)',
              borderColor: 'var(--uleam-border-strong)',
            }}
          >
            <MessageSquare
              size={48}
              className="mx-auto mb-4"
              style={{ color: 'var(--uleam-primary)' }}
            />
            <h3 className="mb-3" style={{ color: 'var(--uleam-text)' }}>
              ¿No encontraste tu respuesta?
            </h3>
            <p className="mb-6" style={{ color: 'var(--uleam-text-muted)' }}>
              Pregunta directamente al Asistente Académico para obtener información más específica
            </p>
            <Link
              to="/chatbot"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105"
              style={{
                backgroundColor: 'var(--uleam-primary)',
                color: 'var(--uleam-text-inverse)',
              }}
            >
              Abrir Asistente
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
