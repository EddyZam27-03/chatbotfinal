import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Newspaper, Calendar, Search, ArrowRight, Clock, Tag } from 'lucide-react';
import { noticiasService, type Noticia } from '../../services/noticiasService';

export function Noticias() {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadNoticias();
  }, []);

  const loadNoticias = async () => {
    try {
      const response = await noticiasService.getAll({ limit: 100 });
      setNoticias(response.items);
    } catch (error) {
      console.error('Error al cargar noticias:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(noticias.map(n => n.categoria).filter(Boolean)))];

  const filteredNoticias = noticias
    .filter((noticia) => {
      if (!noticia.activo) return false;
      const matchesSearch = searchQuery === '' ||
        noticia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        noticia.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || noticia.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
  };

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
              <Newspaper size={40} style={{ color: 'var(--uleam-text-inverse)' }} />
            </div>
            <h1 className="mb-6" style={{ color: 'var(--uleam-text-inverse)' }}>
              Noticias y Eventos
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--uleam-text-inverse)', opacity: 0.95 }}>
              Mantente informado sobre las últimas novedades, logros y actividades de la Carrera de Administración ULEAM El Carmen.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8" style={{ backgroundColor: 'var(--uleam-surface-2)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
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
                  placeholder="Buscar noticias..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as React.CSSProperties}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: selectedCategory === category ? 'var(--uleam-primary)' : 'var(--uleam-surface)',
                    color: selectedCategory === category ? 'var(--uleam-text-inverse)' : 'var(--uleam-text)',
                    borderWidth: selectedCategory === category ? '0' : '1px',
                    borderColor: 'var(--uleam-border)',
                  }}
                >
                  {category === 'all' ? 'Todas' : category}
                </button>
              ))}
            </div>
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <p className="mt-4 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
              {filteredNoticias.length} {filteredNoticias.length === 1 ? 'noticia' : 'noticias'}
              {searchQuery && ` que contiene "${searchQuery}"`}
              {selectedCategory !== 'all' && ` en ${selectedCategory}`}
            </p>
          )}
        </div>
      </section>

      {/* Noticias Grid */}
      <section className="py-12 pb-20" style={{ backgroundColor: 'var(--uleam-surface)' }}>
        <div className="max-w-7xl mx-auto px-6">
          {filteredNoticias.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper size={64} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--uleam-text-muted)' }} />
              <p className="text-lg" style={{ color: 'var(--uleam-text-muted)' }}>
                No se encontraron noticias que coincidan con tu búsqueda.
              </p>
            </div>
          ) : (
            <>
              {/* Featured News */}
              <div
                className="rounded-xl overflow-hidden mb-12 border-2 hover:shadow-[var(--uleam-shadow-2)] transition-all cursor-pointer"
                style={{ borderColor: 'var(--uleam-border)' }}
                onClick={() => navigate(`/noticias/${filteredNoticias[0].id}`)}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    {filteredNoticias[0].imagen_url ? (
                      <img
                        src={filteredNoticias[0].imagen_url}
                        alt={filteredNoticias[0].titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: '#f0f0f0' }}
                      >
                        <Newspaper size={48} style={{ color: '#6b7280' }} />
                      </div>
                    )}
                  </div>

                  <div className="p-8" style={{ backgroundColor: 'var(--uleam-surface)' }}>
                    <div className="flex items-center space-x-3 mb-4">
                      {filteredNoticias[0].categoria && (
                        <span
                          className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{ backgroundColor: 'var(--uleam-primary)', color: 'var(--uleam-text-inverse)' }}
                        >
                          {filteredNoticias[0].categoria}
                        </span>
                      )}
                      <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                        <Clock size={14} />
                        <span>{getTimeAgo(filteredNoticias[0].fecha)}</span>
                      </div>
                    </div>

                    <h2 className="mb-4" style={{ color: 'var(--uleam-text)' }}>
                      {filteredNoticias[0].titulo}
                    </h2>

                    <p className="mb-6 text-lg" style={{ color: 'var(--uleam-text-muted)' }}>
                      {filteredNoticias[0].descripcion}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                        <Calendar size={14} />
                        <span>{formatDate(filteredNoticias[0].fecha)}</span>
                      </div>

                      <button
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                        style={{ backgroundColor: 'var(--uleam-primary)', color: 'var(--uleam-text-inverse)' }}
                        onClick={(e) => { e.stopPropagation(); navigate(`/noticias/${filteredNoticias[0].id}`); }}
                      >
                        <span>Leer más</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rest of News */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNoticias.slice(1).map((noticia) => (
                  <div
                    key={noticia.id}
                    className="rounded-xl overflow-hidden border-2 transition-all hover:shadow-[var(--uleam-shadow-2)] hover:-translate-y-2 cursor-pointer"
                    style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
                    onClick={() => navigate(`/noticias/${noticia.id}`)}
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                      {noticia.imagen_url ? (
                        <img
                          src={noticia.imagen_url}
                          alt={noticia.titulo}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: '#f0f0f0' }}
                        >
                          <Newspaper size={32} style={{ color: '#6b7280' }} />
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        {noticia.categoria && (
                          <span
                            className="text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1"
                            style={{ backgroundColor: 'var(--uleam-surface-2)', color: 'var(--uleam-primary)' }}
                          >
                            <Tag size={12} />
                            <span>{noticia.categoria}</span>
                          </span>
                        )}
                        <div className="flex items-center space-x-1 text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                          <Clock size={12} />
                          <span>{getTimeAgo(noticia.fecha)}</span>
                        </div>
                      </div>

                      <h3 className="mb-3 line-clamp-2" style={{ color: 'var(--uleam-text)' }}>
                        {noticia.titulo}
                      </h3>

                      <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--uleam-text-muted)' }}>
                        {noticia.descripcion}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--uleam-border)' }}>
                        <div className="flex items-center space-x-2 text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                          <Calendar size={12} />
                          <span>{formatDate(noticia.fecha)}</span>
                        </div>

                        <button
                          className="flex items-center space-x-1 text-sm font-medium transition-all hover:translate-x-1"
                          style={{ color: 'var(--uleam-primary)' }}
                          onClick={(e) => { e.stopPropagation(); navigate(`/noticias/${noticia.id}`); }}
                        >
                          <span>Leer</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
