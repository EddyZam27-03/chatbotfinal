import { Link } from 'react-router';
import {
  BookOpen,
  Calendar,
  FileText,
  Users,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { DocentesSection } from './sections/DocentesSection';
import { NoticiasSection } from './sections/NoticiasSection';

export function Home() {
  const services = [
    {
      icon: BookOpen,
      title: 'Requisitos de Ingreso',
      description: 'Conoce los documentos y procesos necesarios para tu admisión',
      link: '/chatbot',
    },
    {
      icon: FileText,
      title: 'Malla Curricular',
      description: 'Descubre las materias y estructura de la carrera',
      link: '/chatbot',
    },
    {
      icon: Calendar,
      title: 'Proceso de Matrícula',
      description: 'Información sobre fechas, costos y pasos a seguir',
      link: '/chatbot',
    },
    {
      icon: Users,
      title: 'Trámites',
      description: 'Gestiona certificados, homologaciones y más',
      link: '/contact',
    },
    {
      icon: GraduationCap,
      title: 'Calendario Académico',
      description: 'Fechas importantes del período lectivo',
      link: '/chatbot',
    },
    {
      icon: MessageSquare,
      title: 'Consultas',
      description: 'Resuelve tus dudas con nuestro asistente',
      link: '/chatbot',
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Haz tu pregunta',
      description: 'Escribe lo que necesitas saber sobre la carrera',
    },
    {
      number: 2,
      title: 'Recibe respuesta inmediata',
      description: 'El asistente te proporciona información verificada',
    },
    {
      number: 3,
      title: 'Toma acción',
      description: 'Accede a recursos y completa tus trámites',
    },
  ];

  const popularQuestions = [
    '¿Cuáles son los requisitos para ingresar?',
    '¿Cómo es la malla curricular de Administración?',
    '¿Cuándo son las fechas de matrícula?',
    '¿Cuál es el costo de la carrera?',
    '¿Qué documentos necesito para matricularme?',
    '¿Dónde está ubicada la extensión?',
  ];

  const handleQuestionClick = (question: string) => {
    // This would open the widget with the pre-filled question
    // For now, we'll just navigate to chatbot
    window.location.href = '/chatbot';
  };

  return (
    <div className="pt-[72px]">
      {/* Hero Section */}
      <section
        className="relative py-16 md:py-24"
        style={{ backgroundColor: 'var(--uleam-surface)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 text-sm"
              style={{
                backgroundColor: 'var(--uleam-surface-2)',
                color: 'var(--uleam-primary)',
              }}
            >
              <CheckCircle2 size={16} />
              <span>Información institucional verificada</span>
            </div>

            <h1 className="mb-6" style={{ color: 'var(--uleam-text)' }}>
              Asistente Académico ULEAM
            </h1>

            <p
              className="text-lg md:text-xl mb-8"
              style={{ color: 'var(--uleam-text-muted)', lineHeight: '1.6' }}
            >
              Tu guía para requisitos, malla curricular, trámites y fechas importantes de la
              carrera de Administración en El Carmen
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/chatbot"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105 w-full sm:w-auto"
                style={{
                  backgroundColor: 'var(--uleam-primary)',
                  color: 'var(--uleam-text-inverse)',
                }}
              >
                Abrir Asistente
                <ArrowRight size={20} className="ml-2" />
              </Link>

              <Link
                to="/faq"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold border transition-all hover:shadow-md w-full sm:w-auto"
                style={{
                  borderColor: 'var(--uleam-border-strong)',
                  color: 'var(--uleam-text)',
                  backgroundColor: 'var(--uleam-surface)',
                }}
              >
                Ver Preguntas Frecuentes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--uleam-surface-2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4" style={{ color: 'var(--uleam-text)' }}>
              Servicios Académicos
            </h2>
            <p style={{ color: 'var(--uleam-text-muted)' }}>
              Accede rápidamente a la información que necesitas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <Link
                  key={idx}
                  to={service.link}
                  className="group p-6 rounded-[var(--radius-card)] border transition-all hover:shadow-[var(--uleam-shadow-1)] hover:-translate-y-1"
                  style={{
                    backgroundColor: 'var(--uleam-surface)',
                    borderColor: 'var(--uleam-border)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                    style={{
                      backgroundColor: 'var(--uleam-surface-2)',
                      color: 'var(--uleam-primary)',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="mb-2" style={{ color: 'var(--uleam-text)' }}>
                    {service.title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--uleam-text-muted)' }}>
                    {service.description}
                  </p>
                  <div
                    className="inline-flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform"
                    style={{ color: 'var(--uleam-primary)' }}
                  >
                    Consultar
                    <ArrowRight size={16} className="ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--uleam-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4" style={{ color: 'var(--uleam-text)' }}>
              ¿Cómo funciona?
            </h2>
            <p style={{ color: 'var(--uleam-text-muted)' }}>
              Obtén información confiable en tres simples pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                  style={{
                    backgroundColor: 'var(--uleam-primary)',
                    color: 'var(--uleam-text-inverse)',
                  }}
                >
                  {step.number}
                </div>
                <h3 className="mb-2" style={{ color: 'var(--uleam-text)' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--uleam-text-muted)' }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Questions */}
      <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--uleam-surface-2)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4" style={{ color: 'var(--uleam-text)' }}>
              Preguntas Populares
            </h2>
            <p style={{ color: 'var(--uleam-text-muted)' }}>
              Haz clic en cualquier pregunta para obtener respuesta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(question)}
                className="text-left p-4 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5 group"
                style={{
                  backgroundColor: 'var(--uleam-surface)',
                  borderColor: 'var(--uleam-border)',
                }}
              >
                <div className="flex items-start space-x-3">
                  <MessageSquare
                    size={20}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: 'var(--uleam-primary)' }}
                  />
                  <span
                    className="text-sm group-hover:underline"
                    style={{ color: 'var(--uleam-text)' }}
                  >
                    {question}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Docentes Section */}
      <DocentesSection />

      {/* Noticias Section */}
      <NoticiasSection />

      {/* CTA Section */}
      <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--uleam-surface)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-2xl p-8 md:p-12 text-center"
            style={{
              background: `linear-gradient(135deg, var(--uleam-primary) 0%, var(--uleam-brand-bright) 100%)`,
            }}
          >
            <h2 className="mb-4" style={{ color: 'var(--uleam-text-inverse)' }}>
              ¿Listo para comenzar?
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--uleam-text-inverse)', opacity: 0.95 }}>
              El Asistente Académico está disponible 24/7 para resolver todas tus dudas
            </p>
            <Link
              to="/chatbot"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-xl hover:scale-105"
              style={{
                backgroundColor: 'var(--uleam-surface)',
                color: 'var(--uleam-primary)',
              }}
            >
              Iniciar Conversación
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
