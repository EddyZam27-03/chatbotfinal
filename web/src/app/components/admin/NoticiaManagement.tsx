import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { Plus, Search, Trash2, Edit2, Newspaper, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { noticiasService, type Noticia } from '../../services/noticiasService';
import { buildImageUrl } from '../../utils/imageUtils';

export function NoticiaManagement() {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedNoticias, setSelectedNoticias] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [bulkAction, setBulkAction] = useState('');
  const itemsPerPage = 10;

  const categories = ['Infraestructura', 'Logros Estudiantiles', 'Convenios', 'Eventos', 'Académico', 'Investigación'];

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

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredNoticias = noticias.filter((noticia) => {
    const matchesSearch =
      noticia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      noticia.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || noticia.categoria === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && noticia.activo) ||
      (selectedStatus === 'inactive' && !noticia.activo);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedNoticias = [...filteredNoticias].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  const totalPages = Math.ceil(sortedNoticias.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNoticias = sortedNoticias.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    setSelectedNoticias(checked ? paginatedNoticias.map((n) => n.id) : []);
  };

  const handleSelectNoticia = (id: string) => {
    setSelectedNoticias((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkActionApply = async () => {
    if (selectedNoticias.length === 0) {
      showToast('Selecciona al menos una noticia', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('No estás autenticado', 'error');
        return;
      }

      if (bulkAction === 'delete') {
        if (window.confirm(`¿Eliminar ${selectedNoticias.length} noticia(s)?`)) {
          await noticiasService.bulkDelete(selectedNoticias, token);
          setSelectedNoticias([]);
          showToast(`${selectedNoticias.length} noticias eliminadas`);
          loadNoticias();
        }
      } else if (bulkAction === 'activate' || bulkAction === 'deactivate') {
        const activo = bulkAction === 'activate';
        for (const id of selectedNoticias) {
          await noticiasService.update(id, { activo }, token);
        }
        setSelectedNoticias([]);
        showToast(activo ? 'Noticias activadas correctamente' : 'Noticias desactivadas correctamente');
        loadNoticias();
      }
      setBulkAction('');
    } catch (error) {
      console.error('Error al aplicar acción masiva:', error);
      showToast('Error al aplicar acción', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta noticia?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          showToast('No estás autenticado', 'error');
          return;
        }
        await noticiasService.delete(id, token);
        showToast('Noticia eliminada correctamente');
        loadNoticias();
      } catch (error) {
        console.error('Error al eliminar noticia:', error);
        showToast('Error al eliminar noticia', 'error');
      }
    }
  };

  const truncateText = (text: string, maxLength: number) =>
    text.length <= maxLength ? text : text.substring(0, maxLength) + '...';

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Toast */}
        {toast && (
          <div
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg"
            style={{
              backgroundColor: toast.type === 'success' ? '#16A34A' : 'var(--uleam-danger)',
              color: 'white',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{toast.msg}</span>
          </div>
        )}

        <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
          <span>Inicio</span>
          <span>/</span>
          <span style={{ color: 'var(--uleam-text)' }}>Noticias</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ color: 'var(--uleam-text)' }}>Gestión de Noticias</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--uleam-text-muted)' }}>
              {noticias.length} noticias en total · {noticias.filter((n) => n.activo).length} activas
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/noticias/add')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
            style={{ backgroundColor: 'var(--uleam-primary)', color: 'var(--uleam-text-inverse)' }}
          >
            <Plus size={18} />
            <span>Agregar Noticia</span>
          </button>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 space-y-4">
            <div
              className="rounded-lg p-4 border"
              style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--uleam-text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Buscar noticias..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--uleam-border)',
                      backgroundColor: 'var(--uleam-surface)',
                      color: 'var(--uleam-text)',
                      '--tw-ring-color': 'var(--uleam-focus-ring)',
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm" style={{ color: 'var(--uleam-text)' }}>Acción:</label>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-1.5 rounded border text-sm"
                  style={{
                    borderColor: 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                  }}
                >
                  <option value="">---------</option>
                  <option value="delete">Eliminar seleccionadas</option>
                  <option value="activate">Activar seleccionadas</option>
                  <option value="deactivate">Desactivar seleccionadas</option>
                </select>
                <button
                  onClick={handleBulkActionApply}
                  className="px-3 py-1.5 rounded border text-sm font-medium hover:bg-[var(--uleam-surface-2)]"
                  style={{ borderColor: 'var(--uleam-border)', color: 'var(--uleam-text)' }}
                >
                  Aplicar
                </button>
                {selectedNoticias.length > 0 && (
                  <span className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                    {selectedNoticias.length} seleccionadas
                  </span>
                )}
              </div>
            </div>

            <div
              className="rounded-lg border overflow-hidden"
              style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--uleam-surface-2)', borderBottom: '1px solid var(--uleam-border)' }}>
                      <th className="px-4 py-3 text-left w-12">
                        <input
                          type="checkbox"
                          checked={paginatedNoticias.length > 0 && selectedNoticias.length === paginatedNoticias.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>Imagen</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>Título</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>Categoría</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>Fecha</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>Activo</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedNoticias.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center">
                          <Newspaper size={48} className="mx-auto mb-3 opacity-20" />
                          <p style={{ color: 'var(--uleam-text-muted)' }}>No hay noticias que coincidan con los filtros.</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedNoticias.map((noticia) => (
                        <tr
                          key={noticia.id}
                          className="border-b hover:bg-[var(--uleam-surface-2)] transition-colors"
                          style={{ borderColor: 'var(--uleam-border)' }}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedNoticias.includes(noticia.id)}
                              onChange={() => handleSelectNoticia(noticia.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            {noticia.imagen_url ? (
                              <img
                                src={buildImageUrl(noticia.imagen_url)}
                                alt={noticia.titulo}
                                className="w-20 h-12 rounded object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div
                                className="w-20 h-12 rounded flex items-center justify-center"
                                style={{ backgroundColor: '#f0f0f0' }}
                              >
                                <Newspaper size={16} style={{ color: '#6b7280' }} />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-sm" style={{ color: 'var(--uleam-text)' }}>
                              {truncateText(noticia.titulo, 60)}
                            </div>
                            <div className="text-xs mt-1" style={{ color: 'var(--uleam-text-muted)' }}>
                              {truncateText(noticia.descripcion, 80)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="text-xs px-2 py-1 rounded-full"
                              style={{ backgroundColor: 'var(--uleam-surface-2)', color: 'var(--uleam-text-muted)' }}
                            >
                              {noticia.categoria}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                            {new Date(noticia.fecha).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block w-3 h-3 rounded-full ${noticia.activo ? 'bg-green-500' : 'bg-gray-400'}`} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => navigate(`/admin/noticias/${noticia.id}/editar`)}
                                className="p-1.5 rounded hover:bg-[var(--uleam-surface-2)] transition-colors"
                                style={{ color: 'var(--uleam-primary)' }}
                                title="Editar"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(noticia.id)}
                                className="p-1.5 rounded hover:bg-red-50 transition-colors"
                                style={{ color: 'var(--uleam-danger)' }}
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div
                  className="flex items-center justify-between px-4 py-3 border-t"
                  style={{ borderColor: 'var(--uleam-border)' }}
                >
                  <div className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                    Página {currentPage} de {totalPages} ({sortedNoticias.length} total)
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[var(--uleam-surface-2)]"
                      style={{ borderColor: 'var(--uleam-border)', color: 'var(--uleam-text)' }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[var(--uleam-surface-2)]"
                      style={{ borderColor: 'var(--uleam-border)', color: 'var(--uleam-text)' }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter Sidebar */}
          <div className="w-64 space-y-4">
            <div
              className="rounded-lg p-4 border"
              style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
            >
              <h3 className="font-semibold mb-4" style={{ color: 'var(--uleam-text)' }}>Filtros</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--uleam-text)' }}>Por Categoría</label>
                <div className="space-y-1">
                  {['all', ...categories].map((cat) => (
                    <label key={cat} className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                      />
                      <span style={{ color: 'var(--uleam-text)' }}>{cat === 'all' ? 'Todas' : cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--uleam-text)' }}>Por Estado</label>
                <div className="space-y-1">
                  {[['all', 'Todos'], ['active', 'Activas'], ['inactive', 'Inactivas']].map(([val, label]) => (
                    <label key={val} className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={val}
                        checked={selectedStatus === val}
                        onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                      />
                      <span style={{ color: 'var(--uleam-text)' }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
