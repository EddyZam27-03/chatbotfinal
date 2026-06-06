import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Calendar, Tag, Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useDataStore } from '../../stores/dataStore';

export default function NoticiaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { noticias } = useDataStore();
  const [copied, setCopied] = useState(false);

  const noticia = noticias.find((n) => n.id === id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: noticia?.titulo,
        text: noticia?.descripcion.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!noticia) {
    return (
      <div className="pt-[72px]" style={{ background: 'var(--uleam-surface)', minHeight: '60vh' }}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center py-20 px-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'var(--uleam-surface-2)' }}
            >
              <Tag size={36} style={{ color: 'var(--uleam-text-muted)' }} />
            </div>
            <h2 className="mb-4" style={{ color: 'var(--uleam-text)' }}>Noticia no encontrada</h2>
            <p className="mb-8" style={{ color: 'var(--uleam-text-muted)' }}>
              La noticia que buscas no existe o ha sido eliminada.
            </p>
            <Link
              to="/noticias"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:opacity-90"
              style={{
                background: 'var(--uleam-primary)',
                color: 'var(--uleam-text-inverse)',
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a Noticias
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryStyle = (categoria: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      'Infraestructura': { bg: '#E0F2FE', text: '#0369A1' },
      'Logros Estudiantiles': { bg: '#FEF3C7', text: '#92400E' },
      'Convenios': { bg: '#E0E7FF', text: '#4338CA' },
      'Eventos': { bg: '#FCE7F3', text: '#9F1239' },
      'Académico': { bg: '#D1FAE5', text: '#065F46' },
      'Investigación': { bg: '#E5E7EB', text: '#374151' },
    };
    return map[categoria] ?? map['Académico'];
  };

  const catStyle = getCategoryStyle(noticia.categoria);

  const relatedNoticias = noticias
    .filter((n) => n.activo && n.id !== noticia.id && n.categoria === noticia.categoria)
    .slice(0, 3);

  return (
    <div className="pt-[72px]" style={{ background: 'var(--uleam-surface)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div
        className="py-4 border-b"
        style={{ background: 'var(--uleam-surface-2)', borderColor: 'var(--uleam-border)' }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="hover:underline" style={{ color: 'var(--uleam-text-muted)' }}>Inicio</Link>
            <span style={{ color: 'var(--uleam-text-muted)' }}>/</span>
            <Link to="/noticias" className="hover:underline" style={{ color: 'var(--uleam-text-muted)' }}>Noticias</Link>
            <span style={{ color: 'var(--uleam-text-muted)' }}>/</span>
            <span className="line-clamp-1" style={{ color: 'var(--uleam-text)' }}>{noticia.titulo}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/noticias')}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg hover:bg-[var(--uleam-surface-2)] transition-all"
          style={{ color: 'var(--uleam-primary)' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Noticias
        </button>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span
              className="px-4 py-1.5 text-sm font-medium rounded-full inline-flex items-center gap-2"
              style={{ background: catStyle.bg, color: catStyle.text }}
            >
              <Tag className="w-3.5 h-3.5" />
              {noticia.categoria}
            </span>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
              <Calendar className="w-4 h-4" />
              {formatDate(noticia.fecha)}
            </div>
          </div>

          <h1
            className="mb-6"
            style={{
              color: 'var(--uleam-text)',
              fontSize: 'clamp(26px, 4vw, 40px)',
              lineHeight: '1.25',
            }}
          >
            {noticia.titulo}
          </h1>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-[var(--uleam-surface-2)] transition-all"
            style={{ color: 'var(--uleam-primary)', borderColor: 'var(--uleam-border)' }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Enlace copiado' : 'Compartir'}
          </button>
        </div>

        {/* Featured Image */}
        {noticia.imagen && (
          <div
            className="mb-10 overflow-hidden rounded-[var(--radius-card)]"
            style={{ boxShadow: 'var(--uleam-shadow-1)' }}
          >
            <img
              src={noticia.imagen}
              alt={noticia.titulo}
              className="w-full h-auto object-cover"
              style={{ aspectRatio: '16/9', maxHeight: '480px' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <article
          className="prose max-w-none"
          style={{ color: 'var(--uleam-text)', fontSize: '17px', lineHeight: '1.85' }}
        >
          {noticia.descripcion.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-5">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Footer Actions */}
        <div
          className="flex flex-wrap gap-4 justify-between items-center mt-12 pt-8"
          style={{ borderTop: '1px solid var(--uleam-border)' }}
        >
          <button
            onClick={() => navigate('/noticias')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:opacity-90"
            style={{ background: 'var(--uleam-primary)', color: 'var(--uleam-text-inverse)' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Noticias
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border hover:bg-[var(--uleam-surface-2)] transition-all"
            style={{ color: 'var(--uleam-primary)', borderColor: 'var(--uleam-border)' }}
          >
            {copied ? <Copy className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Enlace copiado' : 'Compartir'}
          </button>
        </div>

        {/* Related News */}
        {relatedNoticias.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6" style={{ color: 'var(--uleam-text)' }}>
              Noticias relacionadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNoticias.map((n) => (
                <button
                  key={n.id}
                  onClick={() => navigate(`/noticias/${n.id}`)}
                  className="text-left rounded-[var(--radius-card)] border overflow-hidden hover:shadow-[var(--uleam-shadow-1)] hover:-translate-y-1 transition-all"
                  style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
                >
                  {n.imagen && (
                    <img
                      src={n.imagen}
                      alt={n.titulo}
                      className="w-full object-cover"
                      style={{ aspectRatio: '16/9', height: '120px' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={12} style={{ color: 'var(--uleam-text-muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                        {formatDate(n.fecha)}
                      </span>
                    </div>
                    <p className="text-sm font-medium line-clamp-2" style={{ color: 'var(--uleam-text)' }}>
                      {n.titulo}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
