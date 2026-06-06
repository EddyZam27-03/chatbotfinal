import { Link } from 'react-router';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[var(--uleam-surface-2)] border-t" style={{ borderColor: 'var(--uleam-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: 'var(--uleam-primary)' }}
              >
                <span className="font-bold">U</span>
              </div>
              <div>
                <div className="font-bold" style={{ color: 'var(--uleam-primary)' }}>
                  ULEAM
                </div>
                <div className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                  Extensión El Carmen
                </div>
              </div>
            </div>
            <p className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
              Administración - Información institucional confiable
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--uleam-text)' }}>
              Enlaces
            </h3>
            <ul className="space-y-2">
              {[
                { path: '/', label: 'Inicio' },
                { path: '/chatbot', label: 'Asistente Académico' },
                { path: '/faq', label: 'Preguntas Frecuentes' },
                { path: '/contact', label: 'Contacto' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm hover:underline transition-colors"
                    style={{ color: 'var(--uleam-text-muted)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--uleam-text)' }}>
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={18} style={{ color: 'var(--uleam-primary)', flexShrink: 0, marginTop: '2px' }} />
                <span className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                  El Carmen, Manabí, Ecuador
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} style={{ color: 'var(--uleam-primary)', flexShrink: 0 }} />
                <span className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                  +593 (05) 266-1844
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} style={{ color: 'var(--uleam-primary)', flexShrink: 0 }} />
                <span className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                  info@uleam.edu.ec
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--uleam-border)' }}>
          <p className="text-sm text-center" style={{ color: 'var(--uleam-text-muted)' }}>
            © {new Date().getFullYear()} ULEAM - Extensión El Carmen. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
