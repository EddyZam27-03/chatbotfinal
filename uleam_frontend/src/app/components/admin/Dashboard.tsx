import { AdminLayout } from './AdminLayout';
import { MessageSquare, FileText, HelpCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

export function Dashboard() {
  const applications = [
    {
      name: 'Content Management',
      models: [
        { name: 'Documents', icon: FileText, path: '/app-admin/documents', description: 'Gestión de archivos PDF, DOC, XLS, PPT' },
        { name: 'Chatbot Responses', icon: MessageSquare, path: '/app-admin/chatbot', description: 'Respuestas del asistente académico' },
        { name: 'FAQ', icon: HelpCircle, path: '/app-admin/faq', description: 'Preguntas frecuentes' },
      ],
    },
  ];

  const stats = [
    {
      label: 'Consultas Totales',
      value: '1,234',
      change: '+12%',
      icon: MessageSquare,
      color: 'var(--uleam-primary)',
    },
    {
      label: 'Documentos Activos',
      value: '28',
      change: '+3',
      icon: FileText,
      color: 'var(--uleam-accent-teal)',
    },
    {
      label: 'Preguntas FAQ',
      value: '45',
      change: '+5',
      icon: HelpCircle,
      color: 'var(--uleam-accent-purple)',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2" style={{ color: 'var(--uleam-text)' }}>
            Site administration
          </h1>
          <p style={{ color: 'var(--uleam-text-muted)' }}>
            ULEAM — Administración, Extensión El Carmen
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="rounded-lg p-4 border"
                style={{
                  backgroundColor: 'var(--uleam-surface)',
                  borderColor: 'var(--uleam-border)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon size={20} style={{ color: stat.color }} />
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'var(--uleam-surface-2)',
                      color: 'var(--uleam-text-muted)',
                    }}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--uleam-text)' }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Applications */}
        {applications.map((app, appIdx) => (
          <div key={appIdx}>
            <h2 className="mb-4" style={{ color: 'var(--uleam-text)' }}>
              {app.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {app.models.map((model, modelIdx) => {
                const Icon = model.icon;
                return (
                  <Link
                    key={modelIdx}
                    to={model.path}
                    className="group rounded-lg p-6 border hover:shadow-md transition-all"
                    style={{
                      backgroundColor: 'var(--uleam-surface)',
                      borderColor: 'var(--uleam-border)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: 'var(--uleam-surface-2)' }}
                      >
                        <Icon size={24} style={{ color: 'var(--uleam-primary)' }} />
                      </div>
                      <ChevronRight
                        size={20}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: 'var(--uleam-text-muted)' }}
                      />
                    </div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--uleam-text)' }}>
                      {model.name}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                      {model.description}
                    </p>
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