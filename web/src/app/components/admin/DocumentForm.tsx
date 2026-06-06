import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useNavigate, useParams, Link } from 'react-router';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';

export function DocumentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { documentos, addDocumento, updateDocumento } = useDataStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Reglamentos',
    active: true,
    fileName: 'documento.pdf',
    fileSize: '0 KB',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const categories = ['Reglamentos', 'Mallas', 'Calendarios', 'Admisión', 'Aranceles', 'Otros'];
  const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

  useEffect(() => {
    if (isEditing && id) {
      const doc = documentos.find(d => d.id === id);
      if (doc) {
        setFormData({
          title: doc.title,
          description: doc.description || '',
          category: doc.category,
          active: doc.active,
          fileName: doc.fileName,
          fileSize: doc.fileSize,
        });
      }
    }
  }, [id, isEditing, documentos]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'El título es obligatorio';
    else if (formData.title.trim().length < 5) errors.title = 'El título debe tener al menos 5 caracteres';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension && allowedExtensions.includes(extension)) {
        setSelectedFile(file);
        const sizeKB = file.size / 1024;
        const sizeLabel = sizeKB >= 1024
          ? `${(sizeKB / 1024).toFixed(1)} MB`
          : `${Math.round(sizeKB)} KB`;
        setFormData(prev => ({
          ...prev,
          fileName: file.name,
          fileSize: sizeLabel,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
        }));
      } else {
        alert(`Formato no permitido. Solo: ${allowedExtensions.join(', ')}`);
        e.target.value = '';
      }
    }
  };

  const handleSave = (action: 'save' | 'save-add') => {
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      active: formData.active,
      fileName: selectedFile ? selectedFile.name : formData.fileName,
      fileSize: selectedFile
        ? (() => {
            const kb = selectedFile.size / 1024;
            return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
          })()
        : formData.fileSize,
    };

    if (isEditing && id) {
      updateDocumento(id, payload);
      showToast('Documento actualizado correctamente');
    } else {
      addDocumento(payload);
      showToast('Documento agregado correctamente');
    }

    setTimeout(() => {
      if (action === 'save') {
        navigate('/admin/documents');
      } else {
        setFormData({ title: '', description: '', category: 'Reglamentos', active: true, fileName: 'documento.pdf', fileSize: '0 KB' });
        setSelectedFile(null);
        setFormErrors({});
      }
    }, 1200);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg bg-green-600 text-white">
            <CheckCircle2 size={18} />
            <span>{toast}</span>
          </div>
        )}

        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
          <Link to="/admin" className="hover:underline" style={{ color: 'var(--uleam-text-muted)' }}>Inicio</Link>
          <span>/</span>
          <Link to="/admin/documents" className="hover:underline" style={{ color: 'var(--uleam-text-muted)' }}>Documentos</Link>
          <span>/</span>
          <span style={{ color: 'var(--uleam-text)' }}>{isEditing ? 'Editar documento' : 'Nuevo documento'}</span>
        </div>

        <h1 style={{ color: 'var(--uleam-text)' }}>
          {isEditing ? 'Editar Documento' : 'Nuevo Documento'}
        </h1>

        {/* Form */}
        <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}>
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>
                Título <span style={{ color: 'var(--uleam-danger)' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => { setFormData({ ...formData, title: e.target.value }); setFormErrors(p => ({ ...p, title: '' })); }}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: formErrors.title ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                  backgroundColor: 'var(--uleam-surface)',
                  color: 'var(--uleam-text)',
                  '--tw-ring-color': 'var(--uleam-focus-ring)',
                } as React.CSSProperties}
                placeholder="Ej: Reglamento Académico 2025"
              />
              {formErrors.title && (
                <p className="mt-1 text-xs" style={{ color: 'var(--uleam-danger)' }}>{formErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                style={{
                  borderColor: 'var(--uleam-border)',
                  backgroundColor: 'var(--uleam-surface)',
                  color: 'var(--uleam-text)',
                  '--tw-ring-color': 'var(--uleam-focus-ring)',
                } as React.CSSProperties}
                placeholder="Breve descripción del contenido..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--uleam-border)',
                  backgroundColor: 'var(--uleam-surface)',
                  color: 'var(--uleam-text)',
                  '--tw-ring-color': 'var(--uleam-focus-ring)',
                } as React.CSSProperties}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>Archivo</label>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-[var(--uleam-primary)] transition-colors"
                style={{ borderColor: 'var(--uleam-border)' }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-3">
                    <FileText size={24} style={{ color: 'var(--uleam-primary)' }} />
                    <div className="text-left">
                      <div className="font-medium" style={{ color: 'var(--uleam-text)' }}>{selectedFile.name}</div>
                      <div className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                      className="p-1 rounded hover:bg-[var(--uleam-surface-2)]"
                      style={{ color: 'var(--uleam-text-muted)' }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload size={32} className="mx-auto mb-2" style={{ color: 'var(--uleam-text-muted)' }} />
                    <p style={{ color: 'var(--uleam-text)' }}>Clic para subir o arrastra un archivo</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--uleam-text-muted)' }}>
                      PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
                    </p>
                  </div>
                )}
              </div>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFileChange}
                className="hidden"
              />
              {isEditing && !selectedFile && (
                <p className="mt-2 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                  Archivo actual: <span style={{ color: 'var(--uleam-text)' }}>{formData.fileName}</span> ({formData.fileSize})
                </p>
              )}
            </div>

            {/* Active Checkbox */}
            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="active" className="font-medium cursor-pointer" style={{ color: 'var(--uleam-text)' }}>
                  Activo
                </label>
              </div>
              <p className="mt-1 text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                Los documentos inactivos no se mostrarán en el sitio público
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pb-8">
          <button
            onClick={() => handleSave('save')}
            className="px-6 py-2.5 rounded-lg font-medium transition-all hover:shadow-md"
            style={{ backgroundColor: 'var(--uleam-primary)', color: 'var(--uleam-text-inverse)' }}
          >
            {isEditing ? 'Actualizar' : 'Guardar'}
          </button>
          {!isEditing && (
            <button
              onClick={() => handleSave('save-add')}
              className="px-6 py-2.5 rounded-lg font-medium border transition-all hover:bg-[var(--uleam-surface-2)]"
              style={{ borderColor: 'var(--uleam-border)', color: 'var(--uleam-text)' }}
            >
              Guardar y agregar otro
            </button>
          )}
          <button
            onClick={() => navigate('/admin/documents')}
            className="px-6 py-2.5 rounded-lg font-medium border transition-all hover:bg-[var(--uleam-surface-2)]"
            style={{ borderColor: 'var(--uleam-border)', color: 'var(--uleam-text)' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
