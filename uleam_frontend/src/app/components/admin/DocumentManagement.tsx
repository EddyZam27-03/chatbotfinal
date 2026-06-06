import { useState } from 'react';
import type { CSSProperties } from 'react';
import { AdminLayout } from './AdminLayout';
import { Plus, Search, Trash2, Edit2, FileText, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  fileName: string;
  fileSize: string;
  active: boolean;
  uploadDate: string;
  lastModified: string;
}

export function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'Reglamento Académico 2024',
      description: 'Normativa académica vigente para el período 2024',
      category: 'Reglamentos',
      fileName: 'reglamento-academico-2024.pdf',
      fileSize: '2.3 MB',
      active: true,
      uploadDate: '2024-01-15',
      lastModified: '2024-01-15',
    },
    {
      id: '2',
      title: 'Malla Curricular Administración',
      description: 'Plan de estudios completo de la carrera',
      category: 'Mallas',
      fileName: 'malla-administracion.pdf',
      fileSize: '1.8 MB',
      active: true,
      uploadDate: '2024-02-10',
      lastModified: '2024-03-05',
    },
    {
      id: '3',
      title: 'Calendario Académico 2024-2025',
      description: 'Fechas importantes del año académico',
      category: 'Calendarios',
      fileName: 'calendario-2024-2025.xlsx',
      fileSize: '456 KB',
      active: true,
      uploadDate: '2024-03-20',
      lastModified: '2024-03-20',
    },
    {
      id: '4',
      title: 'Guía de Admisión',
      description: 'Proceso completo de admisión a la universidad',
      category: 'Admisión',
      fileName: 'guia-admision.pdf',
      fileSize: '3.1 MB',
      active: false,
      uploadDate: '2023-12-01',
      lastModified: '2024-01-10',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = ['Reglamentos', 'Mallas', 'Calendarios', 'Admisión', 'Aranceles', 'Otros'];

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' ||
                         (selectedStatus === 'active' && doc.active) ||
                         (selectedStatus === 'inactive' && !doc.active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocs = filteredDocs.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocs(paginatedDocs.map((doc) => doc.id));
    } else {
      setSelectedDocs([]);
    }
  };

  const handleSelectDoc = (id: string) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter((docId) => docId !== id));
    } else {
      setSelectedDocs([...selectedDocs, id]);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedDocs.length === 0) {
      alert('Selecciona al menos un documento');
      return;
    }

    if (action === 'delete') {
      if (confirm(`¿Eliminar ${selectedDocs.length} documento(s)?`)) {
        setDocuments(documents.filter((doc) => !selectedDocs.includes(doc.id)));
        setSelectedDocs([]);
      }
    } else if (action === 'activate') {
      setDocuments(documents.map((doc) =>
        selectedDocs.includes(doc.id) ? { ...doc, active: true } : doc
      ));
      setSelectedDocs([]);
    } else if (action === 'deactivate') {
      setDocuments(documents.map((doc) =>
        selectedDocs.includes(doc.id) ? { ...doc, active: false } : doc
      ));
      setSelectedDocs([]);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este documento?')) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
          <span>Inicio</span>
          <span>/</span>
          <span style={{ color: 'var(--uleam-text)' }}>Documentos</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 style={{ color: 'var(--uleam-text)' }}>
            Select document to change
          </h1>
          <a
            href="/app-admin/documents/add"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
            style={{
              backgroundColor: 'var(--uleam-primary)',
              color: 'var(--uleam-text-inverse)',
            }}
          >
            <Plus size={18} />
            <span>ADD DOCUMENT</span>
          </a>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Search & Actions */}
            <div
              className="rounded-lg p-4 border"
              style={{
                backgroundColor: 'var(--uleam-surface)',
                borderColor: 'var(--uleam-border)',
              }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-1 relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: 'var(--uleam-text-muted)' }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search documents..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--uleam-border)',
                      backgroundColor: 'var(--uleam-surface)',
                      color: 'var(--uleam-text)',
                      '--tw-ring-color': 'var(--uleam-focus-ring)',
                    } as CSSProperties}
                  />
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center space-x-2">
                <label className="text-sm" style={{ color: 'var(--uleam-text)' }}>
                  Action:
                </label>
                <select
                  className="px-3 py-1.5 rounded border text-sm"
                  style={{
                    borderColor: 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                  }}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkAction(e.target.value);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">---------</option>
                  <option value="delete">Delete selected documents</option>
                  <option value="activate">Activate selected</option>
                  <option value="deactivate">Deactivate selected</option>
                </select>
                <button
                  className="px-3 py-1.5 rounded border text-sm font-medium hover:bg-[var(--uleam-surface-2)]"
                  style={{
                    borderColor: 'var(--uleam-border)',
                    color: 'var(--uleam-text)',
                  }}
                  onClick={() => {
                    const select = document.querySelector('select') as HTMLSelectElement;
                    if (select.value) handleBulkAction(select.value);
                  }}
                >
                  Go
                </button>
                {selectedDocs.length > 0 && (
                  <span className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                    {selectedDocs.length} selected
                  </span>
                )}
              </div>
            </div>

            {/* Table */}
            <div
              className="rounded-lg border overflow-hidden"
              style={{
                backgroundColor: 'var(--uleam-surface)',
                borderColor: 'var(--uleam-border)',
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--uleam-surface-2)', borderBottom: '1px solid var(--uleam-border)' }}>
                      <th className="px-4 py-3 text-left w-12">
                        <input
                          type="checkbox"
                          checked={paginatedDocs.length > 0 && selectedDocs.length === paginatedDocs.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>
                        File
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>
                        Active
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>
                        Upload Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDocs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center">
                          <FileText size={48} className="mx-auto mb-3 opacity-20" />
                          <p style={{ color: 'var(--uleam-text-muted)' }}>
                            No hay documentos. Sube el primero.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedDocs.map((doc) => (
                        <tr
                          key={doc.id}
                          className="border-b hover:bg-[var(--uleam-surface-2)] transition-colors"
                          style={{ borderColor: 'var(--uleam-border)' }}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedDocs.includes(doc.id)}
                              onChange={() => handleSelectDoc(doc.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-sm" style={{ color: 'var(--uleam-text)' }}>
                                {doc.title}
                              </div>
                              <div className="text-xs mt-1" style={{ color: 'var(--uleam-text-muted)' }}>
                                {doc.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: 'var(--uleam-surface-2)',
                                color: 'var(--uleam-text-muted)',
                              }}
                            >
                              {doc.category}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <FileText size={16} style={{ color: 'var(--uleam-text-muted)' }} />
                              <div>
                                <div className="text-xs" style={{ color: 'var(--uleam-text)' }}>
                                  {doc.fileName}
                                </div>
                                <div className="text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                                  {doc.fileSize}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-block w-3 h-3 rounded-full ${
                                doc.active ? 'bg-green-500' : 'bg-gray-400'
                              }`}
                            />
                          </td>
                          <td className="px-4 py-3 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <button
                                className="p-1.5 rounded hover:bg-[var(--uleam-surface-3)] transition-colors"
                                style={{ color: 'var(--uleam-text-muted)' }}
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                className="p-1.5 rounded hover:bg-[var(--uleam-surface-3)] transition-colors"
                                style={{ color: 'var(--uleam-text-muted)' }}
                                title="Download"
                              >
                                <Download size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="p-1.5 rounded hover:bg-red-50 transition-colors"
                                style={{ color: 'var(--uleam-danger)' }}
                                title="Delete"
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  className="flex items-center justify-between px-4 py-3 border-t"
                  style={{ borderColor: 'var(--uleam-border)' }}
                >
                  <div className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                    Page {currentPage} of {totalPages} ({filteredDocs.length} total)
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[var(--uleam-surface-2)]"
                      style={{
                        borderColor: 'var(--uleam-border)',
                        color: 'var(--uleam-text)',
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[var(--uleam-surface-2)]"
                      style={{
                        borderColor: 'var(--uleam-border)',
                        color: 'var(--uleam-text)',
                      }}
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
              style={{
                backgroundColor: 'var(--uleam-surface)',
                borderColor: 'var(--uleam-border)',
              }}
            >
              <h3 className="font-semibold mb-4" style={{ color: 'var(--uleam-text)' }}>
                Filter
              </h3>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--uleam-text)' }}>
                  By Category
                </label>
                <div className="space-y-1">
                  <label className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span style={{ color: 'var(--uleam-text)' }}>All</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      />
                      <span style={{ color: 'var(--uleam-text)' }}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--uleam-text)' }}>
                  By Status
                </label>
                <div className="space-y-1">
                  <label className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="all"
                      checked={selectedStatus === 'all'}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    />
                    <span style={{ color: 'var(--uleam-text)' }}>All</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={selectedStatus === 'active'}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    />
                    <span style={{ color: 'var(--uleam-text)' }}>Active</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={selectedStatus === 'inactive'}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    />
                    <span style={{ color: 'var(--uleam-text)' }}>Inactive</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
