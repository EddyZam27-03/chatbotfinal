import { ArrowRight, Newspaper, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDataStore } from '../../../stores/dataStore';

export function NoticiasSection() {
  const { noticias } = useDataStore();
  const navigate = useNavigate();

  const activeNoticias = noticias
    .filter((n) => n.activo)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 3);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section
      id="noticias"
      className="py-16 md:py-20"
      style={{ backgroundColor: 'var(--uleam-surface-2)', scrollMarginTop: '80px' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 style={{ color: 'var(--uleam-text)' }}>Últimas Noticias</h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: 'var(--uleam-text-muted)' }}>
            Mantente informado sobre las actividades, logros y eventos más recientes de nuestra carrera.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeNoticias.map((noticia) => (
            <div
              key={noticia.id}
              className="rounded-[var(--radius-card)] border overflow-hidden transition-all hover:shadow-[var(--uleam-shadow-1)] hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--uleam-surface)',
                borderColor: 'var(--uleam-border)',
              }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLDivElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--uleam-surface-2)', display: 'none' }}
                >
                  <Newspaper size={48} style={{ color: 'var(--uleam-text-muted)', opacity: 0.3 }} />
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar size={14} style={{ color: 'var(--uleam-text-muted)' }} />
                  <span className="text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                    {formatDate(noticia.fecha)}
                  </span>
                </div>

                <h3 className="mb-3 line-clamp-2" style={{ color: 'var(--uleam-text)' }}>
                  {noticia.titulo}
                </h3>

                <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--uleam-text-muted)' }}>
                  {truncateText(noticia.descripcion, 150)}
                </p>

                <button
                  className="flex items-center space-x-2 text-sm font-medium transition-all hover:translate-x-1"
                  style={{ color: 'var(--uleam-primary)' }}
                  onClick={() => navigate(`/noticias/${noticia.id}`)}
                >
                  <span>Ver más</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {activeNoticias.length === 0 && (
          <div className="text-center py-12">
            <Newspaper size={64} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--uleam-text-muted)' }} />
            <p style={{ color: 'var(--uleam-text-muted)' }}>
              Aún no hay noticias publicadas.
            </p>
          </div>
        )}

        {activeNoticias.length > 0 && (
          <div className="text-center mt-12">
            <button
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium border transition-all hover:shadow-md"
              style={{
                borderColor: 'var(--uleam-primary)',
                color: 'var(--uleam-primary)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--uleam-primary)';
                e.currentTarget.style.color = 'var(--uleam-text-inverse)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--uleam-primary)';
              }}
              onClick={() => navigate('/noticias')}
            >
              <span>Ver todas las noticias</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
