import { useState } from 'react';
import type { ChangeEvent, CSSProperties } from 'react';
import { AdminLayout } from './AdminLayout';
import { useNavigate } from 'react-router';
import { Upload, X, FileText } from 'lucide-react';

export function DocumentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Reglamentos',
    active: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = ['Reglamentos', 'Mallas', 'Calendarios', 'Admisión', 'Aranceles', 'Otros'];

  const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension && allowedExtensions.includes(extension)) {
        setSelectedFile(file);
      } else {
        alert(`Formato no permitido. Solo: ${allowedExtensions.join(', ')}`);
        e.target.value = '';
      }
    }
  };

  const handleSave = (action: 'save' | 'save-add' | 'save-continue') => {
    if (!formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    // Simulate save
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      if (action === 'save') {
        navigate('/app-admin/documents');
      } else if (action === 'save-add') {
        setFormData({ title: '', description: '', category: 'Reglamentos', active: true });
        setSelectedFile(null);
      }
      // save-continue stays on the page
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
          <span>Inicio</span>
          <span>/</span>
          <a href="/app-admin/documents" className="hover:underline" style={{ color: 'var(--uleam-text-muted)' }}>
            Documentos
          </a>
          <span>/</span>
          <span style={{ color: 'var(--uleam-text)' }}>Add document</span>
        </div>

        {/* Header */}
        <h1 style={{ color: 'var(--uleam-text)' }}>
          Add document
        </h1>

        {/* Success Message */}
        {showSuccess && (
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderLeft: '4px solid #22C55E',
              color: '#16A34A',
            }}
          >
            <span className="font-medium">The document was added successfully.</span>
            <button onClick={() => setShowSuccess(false)}>
              <X size={18} />
            </button>
          </div>
        )}

        {/* Form */}
        <div
          className="rounded-lg p-6 border"
          style={{
            backgroundColor: 'var(--uleam-surface)',
            borderColor: 'var(--uleam-border)',
          }}
        >
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>
                Title <span style={{ color: 'var(--uleam-danger)' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--uleam-border)',
                  backgroundColor: 'var(--uleam-surface)',
                  color: 'var(--uleam-text)',
                  '--tw-ring-color': 'var(--uleam-focus-ring)',
                } as CSSProperties}
                placeholder="Ej: Reglamento Académico 2024"
              />
              <p className="mt-1 text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                Título del documento
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>
                Description
              </label>
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
                } as CSSProperties}
                placeholder="Descripción del documento..."
              />
              <p className="mt-1 text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                Breve descripción del contenido
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--uleam-border)',
                  backgroundColor: 'var(--uleam-surface)',
                  color: 'var(--uleam-text)',
                  '--tw-ring-color': 'var(--uleam-focus-ring)',
                } as CSSProperties}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                Categoría del documento
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>
                File
              </label>
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-[var(--uleam-primary)] transition-colors"
                style={{ borderColor: 'var(--uleam-border)' }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-3">
                    <FileText size={24} style={{ color: 'var(--uleam-primary)' }} />
                    <div className="text-left">
                      <div className="font-medium" style={{ color: 'var(--uleam-text)' }}>
                        {selectedFile.name}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="p-1 rounded hover:bg-[var(--uleam-surface-2)]"
                      style={{ color: 'var(--uleam-text-muted)' }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload size={32} className="mx-auto mb-2" style={{ color: 'var(--uleam-text-muted)' }} />
                    <p style={{ color: 'var(--uleam-text)' }}>
                      Click to upload or drag and drop
                    </p>
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
              <p className="mt-1 text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                Formatos permitidos: {allowedExtensions.join(', ')}
              </p>
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="active" className="font-medium cursor-pointer" style={{ color: 'var(--uleam-text)' }}>
                Active
              </label>
            </div>

            <p className="text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
              Los documentos inactivos no se mostrarán en el sitio público
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pb-8">
          <button
            onClick={() => handleSave('save')}
            className="px-6 py-2.5 rounded-lg font-medium transition-all hover:shadow-md"
            style={{
              backgroundColor: 'var(--uleam-primary)',
              color: 'var(--uleam-text-inverse)',
            }}
          >
            Save
          </button>
          <button
            onClick={() => handleSave('save-add')}
            className="px-6 py-2.5 rounded-lg font-medium border transition-all hover:bg-[var(--uleam-surface-2)]"
            style={{
              borderColor: 'var(--uleam-border)',
              color: 'var(--uleam-text)',
            }}
          >
            Save and add another
          </button>
          <button
            onClick={() => handleSave('save-continue')}
            className="px-6 py-2.5 rounded-lg font-medium border transition-all hover:bg-[var(--uleam-surface-2)]"
            style={{
              borderColor: 'var(--uleam-border)',
              color: 'var(--uleam-text)',
            }}
          >
            Save and continue editing
          </button>
          <button
            onClick={() => navigate('/app-admin/documents')}
            className="px-6 py-2.5 rounded-lg font-medium border transition-all hover:bg-[var(--uleam-surface-2)]"
            style={{
              borderColor: 'var(--uleam-border)',
              color: 'var(--uleam-text)',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
