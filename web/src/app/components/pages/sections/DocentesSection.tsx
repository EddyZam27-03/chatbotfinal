import { User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDataStore } from '../../../stores/dataStore';

export function DocentesSection() {
  const { docentes } = useDataStore();
  const navigate = useNavigate();

  const activeDocentes = docentes
    .filter((d) => d.activo)
    .slice(0, 4);

  return (
    <section
      id="docentes"
      className="py-16 md:py-20"
      style={{ backgroundColor: 'var(--uleam-surface)', scrollMarginTop: '80px' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 style={{ color: 'var(--uleam-text)' }}>Nuestros Docentes</h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: 'var(--uleam-text-muted)' }}>
            Conoce al equipo de profesionales especializados que guiarán tu formación académica en la Carrera de Administración.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeDocentes.map((docente) => (
            <div
              key={docente.id}
              className="p-6 rounded-[var(--radius-card)] border transition-all hover:shadow-[var(--uleam-shadow-1)] hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--uleam-surface)',
                borderColor: 'var(--uleam-border)',
              }}
            >
              <div className="flex justify-center mb-4">
                <img
                  src={docente.foto}
                  alt={docente.nombre}
                  className="w-24 h-24 rounded-full object-cover border-4"
                  style={{ borderColor: 'var(--uleam-primary)' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLDivElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center border-4"
                  style={{
                    backgroundColor: 'var(--uleam-surface-2)',
                    borderColor: 'var(--uleam-primary)',
                    display: 'none',
                  }}
                >
                  <User size={40} style={{ color: 'var(--uleam-text-muted)' }} />
                </div>
              </div>

              <h3 className="text-center mb-1" style={{ color: 'var(--uleam-text)' }}>
                {docente.nombre}
              </h3>

              {docente.especialidad && (
                <p className="text-xs text-center mb-2 font-medium" style={{ color: 'var(--uleam-primary)' }}>
                  {docente.especialidad}
                </p>
              )}

              <p className="text-sm text-center line-clamp-2" style={{ color: 'var(--uleam-text-muted)' }}>
                {docente.materias}
              </p>
            </div>
          ))}
        </div>

        {activeDocentes.length === 0 && (
          <div className="text-center py-12">
            <User size={64} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--uleam-text-muted)' }} />
            <p style={{ color: 'var(--uleam-text-muted)' }}>
              Aún no hay docentes registrados.
            </p>
          </div>
        )}

        {activeDocentes.length > 0 && (
          <div className="text-center mt-10">
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
              onClick={() => navigate('/docentes')}
            >
              <span>Ver todos los docentes</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
