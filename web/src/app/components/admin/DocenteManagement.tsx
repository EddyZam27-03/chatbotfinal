import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { Plus, Search, Trash2, Edit2, User, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { docentesService, type Docente } from '../../services/docentesService';
import { buildImageUrl } from '../../stores/dataStore';

export function DocenteManagement() {
  const navigate = useNavigate();
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDocentes, setSelectedDocentes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [bulkAction, setBulkAction] = useState('');
  const itemsPerPage = 10;

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

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredDocentes = docentes.filter((docente) => {
    const matchesSearch =
      docente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docente.materias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (docente.especialidad ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && docente.activo) ||
      (selectedStatus === 'inactive' && !docente.activo);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDocentes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocentes = filteredDocentes.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    setSelectedDocentes(checked ? paginatedDocentes.map((d) => d.id) : []);
  };

  const handleSelectDocente = (id: string) => {
    setSelectedDocentes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkActionApply = async () => {
    if (selectedDocentes.length === 0) {
      showToast('Selecciona al menos un docente', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('No estás autenticado', 'error');
        return;
      }

      if (bulkAction === 'delete') {
        if (window.confirm(`¿Eliminar ${selectedDocentes.length} docente(s)?`)) {
          await docentesService.bulkDelete(selectedDocentes, token);
          setSelectedDocentes([]);
          showToast(`${selectedDocentes.length} docentes eliminados`);
          loadDocentes();
        }
      } else if (bulkAction === 'activate' || bulkAction === 'deactivate') {
        const activo = bulkAction === 'activate';
        for (const id of selectedDocentes) {
          await docentesService.update(id, { activo }, token);
        }
        setSelectedDocentes([]);
        showToast(activo ? 'Docentes activados correctamente' : 'Docentes desactivados correctamente');
        loadDocentes();
      }
      setBulkAction('');
    } catch (error) {
      console.error('Error al aplicar acción masiva:', error);
      showToast('Error al aplicar acción', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este docente?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          showToast('No estás autenticado', 'error');
          return;
        }
        await docentesService.delete(id, token);
        showToast('Docente eliminado correctamente');
        loadDocentes();
      } catch (error) {
        console.error('Error al eliminar docente:', error);
        showToast('Error al eliminar docente', 'error');
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
          <span style={{ color: 'var(--uleam-text)' }}>Docentes</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ color: 'var(--uleam-text)' }}>Gestión de Docentes</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--uleam-text-muted)' }}>
              {docentes.length} docentes registrados · {docentes.filter((d) => d.activo).length} activos
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/docentes/add')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
            style={{ backgroundColor: 'var(--uleam-primary)', color: 'var(--uleam-text-inverse)' }}
          >
            <Plus size={18} />
            <span>Agregar Docente</span>
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
                    placeholder="Buscar docentes..."
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
                  <option value="delete">Eliminar seleccionados</option>
                  <option value="activate">Activar seleccionados</option>
                  <option value="deactivate">Desactivar seleccionados</option>
                </select>
                <button
                  onClick={handleBulkActionApply}
                  className="px-3 py-1.5 rounded border text-sm font-medium hover:bg-[var(--uleam-surface-2)]"
                  style={{ borderColor: 'var(--uleam-border)', color: 'var(--uleam-text)' }}
                >
                  Aplicar
                </button>
                {selectedDocentes.length > 0 && (
                  <span className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                    {selectedDocentes.length} seleccionados
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
                          checked={paginatedDocentes.length > 0 && selectedDocentes.length === paginatedDocentes.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>Foto</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>Nombre</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>Especialidad</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>Materias</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>Activo</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDocentes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center">
                          <User size={48} className="mx-auto mb-3 opacity-20" />
                          <p style={{ color: 'var(--uleam-text-muted)' }}>No hay docentes que coincidan.</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedDocentes.map((docente) => (
                        <tr
                          key={docente.id}
                          className="border-b hover:bg-[var(--uleam-surface-2)] transition-colors"
                          style={{ borderColor: 'var(--uleam-border)' }}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedDocentes.includes(docente.id)}
                              onChange={() => handleSelectDocente(docente.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            {docente.foto_url ? (
                              <img
                                src={buildImageUrl(docente.foto_url)}
                                alt={docente.nombre}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: '#f0f0f0' }}
                              >
                                <User size={16} style={{ color: '#6b7280' }} />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-sm" style={{ color: 'var(--uleam-text)' }}>{docente.nombre}</div>
                            {docente.email && (
                              <div className="text-xs mt-0.5" style={{ color: 'var(--uleam-text-muted)' }}>{docente.email}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                            {docente.especialidad ?? '—'}
                          </td>
                          <td className="px-4 py-3 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                            {truncateText(docente.materias, 45)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block w-3 h-3 rounded-full ${docente.activo ? 'bg-green-500' : 'bg-gray-400'}`} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => navigate(`/admin/docentes/${docente.id}/editar`)}
                                className="p-1.5 rounded hover:bg-[var(--uleam-surface-2)] transition-colors"
                                style={{ color: 'var(--uleam-primary)' }}
                                title="Editar"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(docente.id)}
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
                    Página {currentPage} de {totalPages} ({filteredDocentes.length} total)
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
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--uleam-text)' }}>Por Estado</label>
                <div className="space-y-1">
                  {[['all', 'Todos'], ['active', 'Activos'], ['inactive', 'Inactivos']].map(([val, label]) => (
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
