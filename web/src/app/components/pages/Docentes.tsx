import { useState, useEffect } from 'react';
import { User, Mail, Search, GraduationCap, BookOpen } from 'lucide-react';
import { docentesService, type Docente } from '../../services/docentesService';
import { buildImageUrl } from '../../utils/imageUtils';

export function Docentes() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDocentes();
  }, []);

  const loadDocentes = async () => {
    try {
      const response = await docentesService.getAll({ limit: 100 });
      setDocentes(response.items);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocentes = docentes.filter((docente) => {
    if (!docente.activo) return false;
    const matchesSearch = searchQuery === '' ||
      docente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docente.materias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (docente.especialidad && docente.especialidad.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const activeCount = docentes.filter(d => d.activo).length;

  console.log('Total docentes:', docentes.length);
  console.log('Docentes activos:', activeCount);
  console.log('Docentes filtrados:', filteredDocentes.length);
  console.log('Docentes:', docentes);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--uleam-surface)', paddingTop: '72px' }}>
      {/* Hero Section */}
      <section
        className="relative py-20 md:py-28"
        style={{ background: `linear-gradient(135deg, var(--uleam-primary) 0%, var(--uleam-brand-bright) 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <GraduationCap size={40} style={{ color: 'var(--uleam-text-inverse)' }} />
            </div>
            <h1 className="mb-6" style={{ color: 'var(--uleam-text-inverse)' }}>
              Cuerpo Docente
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--uleam-text-inverse)', opacity: 0.95 }}>
              Profesionales comprometidos con la excelencia académica y el desarrollo integral de nuestros estudiantes en la Carrera de Administración.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12" style={{ backgroundColor: 'var(--uleam-surface-2)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--uleam-primary)' }}>
                {activeCount}+
              </div>
              <div style={{ color: 'var(--uleam-text-muted)' }}>Docentes Especializados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--uleam-primary)' }}>15+</div>
              <div style={{ color: 'var(--uleam-text-muted)' }}>Áreas de Especialización</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--uleam-primary)' }}>100%</div>
              <div style={{ color: 'var(--uleam-text-muted)' }}>Compromiso con la Calidad</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8" style={{ backgroundColor: 'var(--uleam-surface)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                style={{ color: 'var(--uleam-text-muted)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, materia o especialidad..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 text-lg"
                style={{
                  borderColor: 'var(--uleam-border)',
                  backgroundColor: 'var(--uleam-surface)',
                  color: 'var(--uleam-text)',
                  '--tw-ring-color': 'var(--uleam-focus-ring)',
                } as React.CSSProperties}
              />
            </div>
            {searchQuery && (
              <p className="mt-3 text-sm text-center" style={{ color: 'var(--uleam-text-muted)' }}>
                {filteredDocentes.length} {filteredDocentes.length === 1 ? 'resultado' : 'resultados'} encontrados
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Docentes Grid */}
      <section className="py-12 pb-20" style={{ backgroundColor: 'var(--uleam-surface)' }}>
        <div className="max-w-7xl mx-auto px-6">
          {filteredDocentes.length === 0 ? (
            <div className="text-center py-16">
              <User size={64} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--uleam-text-muted)' }} />
              <p className="text-lg" style={{ color: 'var(--uleam-text-muted)' }}>
                {searchQuery ? 'No se encontraron docentes que coincidan con tu búsqueda.' : 'No hay docentes activos aún.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDocentes.map((docente) => (
                <div
                  key={docente.id}
                  className="rounded-xl p-8 border-2 transition-all hover:shadow-[var(--uleam-shadow-2)] hover:-translate-y-2"
                  style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
                >
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      {docente.foto_url ? (
                        <img
                          src={buildImageUrl(docente.foto_url)}
                          alt={docente.nombre}
                          className="w-32 h-32 rounded-full object-cover border-4"
                          style={{ borderColor: 'var(--uleam-primary)' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLDivElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="w-32 h-32 rounded-full flex items-center justify-center border-4"
                        style={{
                          backgroundColor: '#f0f0f0',
                          borderColor: '#1e40af',
                          display: docente.foto_url ? 'none' : 'flex'
                        }}
                      >
                        <User size={48} style={{ color: '#6b7280' }} />
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="mb-2" style={{ color: 'var(--uleam-text)' }}>{docente.nombre}</h3>

                    {docente.especialidad && (
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <BookOpen size={16} style={{ color: 'var(--uleam-primary)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--uleam-primary)' }}>
                          {docente.especialidad}
                        </span>
                      </div>
                    )}

                    <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--uleam-surface-2)' }}>
                      <p className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>{docente.materias}</p>
                    </div>

                    {docente.email && (
                      <a
                        href={`mailto:${docente.email}`}
                        className="inline-flex items-center space-x-2 text-sm px-4 py-2 rounded-lg transition-all hover:bg-[var(--uleam-surface-2)]"
                        style={{ color: 'var(--uleam-primary)' }}
                      >
                        <Mail size={16} />
                        <span>Contactar</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
