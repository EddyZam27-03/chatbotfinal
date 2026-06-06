import { Link } from 'react-router';
import { Home, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="pt-[72px] min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--uleam-surface-2)' }}>
      <div className="text-center px-4">
        <div className="mb-8">
          <div
            className="text-8xl md:text-9xl font-bold mb-4"
            style={{
              background: `linear-gradient(135deg, var(--uleam-primary) 0%, var(--uleam-brand-bright) 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </div>
          <h1 className="mb-4" style={{ color: 'var(--uleam-text)' }}>
            Página no encontrada
          </h1>
          <p className="text-lg mb-8" style={{ color: 'var(--uleam-text-muted)' }}>
            Lo sentimos, la página que buscas no existe o ha sido movida
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105"
            style={{
              backgroundColor: 'var(--uleam-primary)',
              color: 'var(--uleam-text-inverse)',
            }}
          >
            <Home size={20} />
            <span>Volver al Inicio</span>
          </Link>

          <Link
            to="/chatbot"
            className="inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-xl font-semibold border transition-all hover:shadow-md"
            style={{
              borderColor: 'var(--uleam-border-strong)',
              color: 'var(--uleam-text)',
              backgroundColor: 'var(--uleam-surface)',
            }}
          >
            <Search size={20} />
            <span>Buscar en el Asistente</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
