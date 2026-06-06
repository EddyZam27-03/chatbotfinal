import { AdminLayout } from './AdminLayout';
import { MessageSquare, FileText, HelpCircle, ChevronRight, Users, Newspaper, Bot } from 'lucide-react';
import { Link } from 'react-router';
import { useDataStore } from '../../stores/dataStore';

export function Dashboard() {
  const { noticias, docentes, documentos, faqs, chatbotKnowledge } = useDataStore();

  const applications = [
    {
      name: 'Gestión de Contenido',
      models: [
        { name: 'Noticias', icon: Newspaper, path: '/admin/noticias', description: 'Publicaciones, eventos y anuncios' },
        { name: 'Docentes', icon: Users, path: '/admin/docentes', description: 'Perfiles del cuerpo docente' },
        { name: 'Documentos', icon: FileText, path: '/admin/documents', description: 'Archivos PDF, DOC, XLS, PPT' },
        { name: 'Asistente (FAQ)', icon: HelpCircle, path: '/admin/faq', description: 'Preguntas frecuentes del sitio' },
        { name: 'Base de Conocimiento', icon: Bot, path: '/admin/chatbot', description: 'Respuestas del asistente académico' },
      ],
    },
  ];

  const stats = [
    {
      label: 'Noticias Publicadas',
      value: noticias.filter(n => n.activo).length,
      total: noticias.length,
      icon: Newspaper,
      color: 'var(--uleam-primary)',
      path: '/admin/noticias',
    },
    {
      label: 'Docentes Activos',
      value: docentes.filter(d => d.activo).length,
      total: docentes.length,
      icon: Users,
      color: 'var(--uleam-accent-teal)',
      path: '/admin/docentes',
    },
    {
      label: 'Documentos',
      value: documentos.filter(d => d.activo).length,
      total: documentos.length,
      icon: FileText,
      color: 'var(--uleam-accent-purple)',
      path: '/admin/documents',
    },
    {
      label: 'Preguntas FAQ',
      value: faqs.length,
      total: faqs.length,
      icon: HelpCircle,
      color: '#F59E0B',
      path: '/admin/faq',
    },
    {
      label: 'Respuestas Chatbot',
      value: chatbotKnowledge.length,
      total: chatbotKnowledge.length,
      icon: MessageSquare,
      color: '#10B981',
      path: '/admin/chatbot',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2" style={{ color: 'var(--uleam-text)' }}>Panel de Administración</h1>
          <p style={{ color: 'var(--uleam-text-muted)' }}>
            ULEAM — Administración, Extensión El Carmen
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Link
                key={idx}
                to={stat.path}
                className="rounded-lg p-4 border transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon size={20} style={{ color: stat.color }} />
                  {stat.value !== stat.total && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--uleam-surface-2)', color: 'var(--uleam-text-muted)' }}>
                      {stat.total} total
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--uleam-text)' }}>
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: 'var(--uleam-text-muted)' }}>{stat.label}</div>
              </Link>
            );
          })}
        </div>

        {/* Applications */}
        {applications.map((app, appIdx) => (
          <div key={appIdx}>
            <h2 className="mb-4" style={{ color: 'var(--uleam-text)' }}>{app.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {app.models.map((model, modelIdx) => {
                const Icon = model.icon;
                return (
                  <Link
                    key={modelIdx}
                    to={model.path}
                    className="group rounded-lg p-6 border hover:shadow-md transition-all"
                    style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--uleam-surface-2)' }}>
                        <Icon size={24} style={{ color: 'var(--uleam-primary)' }} />
                      </div>
                      <ChevronRight
                        size={20}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: 'var(--uleam-text-muted)' }}
                      />
                    </div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--uleam-text)' }}>{model.name}</h3>
                    <p className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>{model.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
