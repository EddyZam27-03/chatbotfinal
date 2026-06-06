import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useNavigate, useParams } from 'react-router';
import { Upload, X, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { docentesService, type DocenteCreate, type DocenteUpdate } from '../../services/docentesService';

export function DocenteForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    materias: '',
    especialidad: '',
    email: '',
    foto: '',
    activo: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

  useEffect(() => {
    if (isEditing && id) {
      loadDocente();
    }
  }, [id, isEditing]);

  const loadDocente = async () => {
    try {
      const docente = await docentesService.getById(id!);
      setFormData({
        nombre: docente.nombre,
        materias: docente.materias,
        especialidad: docente.especialidad ?? '',
        email: docente.email ?? '',
        foto: docente.foto_url ?? '',
        activo: docente.activo,
      });
      setPreviewUrl(docente.foto_url ?? '');
    } catch (error) {
      console.error('Error al cargar docente:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension && allowedExtensions.includes(extension)) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          setPreviewUrl(dataUrl);
          setFormData((prev) => ({ ...prev, foto: dataUrl }));
        };
        reader.readAsDataURL(file);
      } else {
        setErrors((prev) => ({ ...prev, foto: `Formato no permitido. Solo: ${allowedExtensions.join(', ')}` }));
        e.target.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData((prev) => ({ ...prev, foto: '' }));
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    else if (formData.nombre.trim().length < 3) newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (action: 'save' | 'save-add' | 'save-continue') => {
    if (!validate()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No estás autenticado');
      }

      if (isEditing && id) {
        const data: DocenteUpdate = {};
        if (formData.nombre.trim()) data.nombre = formData.nombre.trim();
        if (formData.materias.trim()) data.materias = formData.materias.trim();
        if (formData.especialidad.trim()) data.especialidad = formData.especialidad.trim();
        if (formData.email.trim()) data.email = formData.email.trim();
        data.activo = formData.activo;
        
        await docentesService.update(id, data, token, selectedFile || undefined);
      } else {
        const data: DocenteCreate = {
          nombre: formData.nombre.trim(),
          materias: formData.materias.trim(),
          especialidad: formData.especialidad.trim() || null,
          email: formData.email.trim() || null,
          activo: formData.activo,
        };
        
        await docentesService.create(data, token, selectedFile || undefined);
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (action === 'save') {
          navigate('/admin/docentes');
        } else if (action === 'save-add') {
          setFormData({ nombre: '', materias: '', especialidad: '', email: '', foto: '', activo: true });
          handleRemoveFile();
          setErrors({});
        }
      }, 1200);
    } catch (error) {
      console.error('Error al guardar docente:', error);
      alert('Error al guardar docente. Verifica que estés autenticado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
          <span>Inicio</span>
          <span>/</span>
          <button
            onClick={() => navigate('/admin/docentes')}
            className="hover:underline"
            style={{ color: 'var(--uleam-text-muted)' }}
          >
            Docentes
          </button>
          <span>/</span>
          <span style={{ color: 'var(--uleam-text)' }}>{isEditing ? 'Editar docente' : 'Agregar docente'}</span>
        </div>

        <h1 style={{ color: 'var(--uleam-text)' }}>{isEditing ? 'Editar Docente' : 'Agregar Docente'}</h1>

        {showSuccess && (
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderLeft: '4px solid #22C55E', color: '#16A34A' }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span className="font-medium">
                {isEditing ? 'Docente actualizado correctamente.' : 'Docente registrado correctamente.'}
              </span>
            </div>
            <button onClick={() => setShowSuccess(false)}>
              <X size={18} />
            </button>
          </div>
        )}

        <div
          className="rounded-lg p-6 border"
          style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
        >
          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>
                Nombre Completo <span style={{ color: 'var(--uleam-danger)' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => { setFormData({ ...formData, nombre: e.target.value }); setErrors((p) => ({ ...p, nombre: '' })); }}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.nombre ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                  backgroundColor: 'var(--uleam-surface)',
                  color: 'var(--uleam-text)',
                  '--tw-ring-color': 'var(--uleam-focus-ring)',
                } as React.CSSProperties}
                placeholder="Ej: Dr. Carlos Mendoza Paredes"
              />
              {errors.nombre && (
                <p className="mt-1 text-xs flex items-center gap-1" style={{ color: 'var(--uleam-danger)' }}>
                  <AlertCircle size={13} /> {errors.nombre}
                </p>
              )}
              <p className="mt-1 text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                Incluye el título académico (Dr., Msc., Ing., etc.)
              </p>
            </div>

            {/* Especialidad y Email en fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>Especialidad</label>
                <input
                  type="text"
                  value={formData.especialidad}
                  onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as React.CSSProperties}
                  placeholder="Ej: Administración Estratégica"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors((p) => ({ ...p, email: '' })); }}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: errors.email ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as React.CSSProperties}
                  placeholder="nombre@uleam.edu.ec"
                />
                {errors.email && (
                  <p className="mt-1 text-xs flex items-center gap-1" style={{ color: 'var(--uleam-danger)' }}>
                    <AlertCircle size={13} /> {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Foto Upload */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>Foto</label>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover border-2"
                        style={{ borderColor: 'var(--uleam-border)' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <button
                        onClick={handleRemoveFile}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center border-2"
                      style={{ borderColor: 'var(--uleam-border)', backgroundColor: 'var(--uleam-surface-2)' }}
                    >
                      <User size={32} style={{ color: 'var(--uleam-text-muted)' }} />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[var(--uleam-primary)] transition-colors"
                    style={{ borderColor: 'var(--uleam-border)' }}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center space-x-2">
                        <User size={20} style={{ color: 'var(--uleam-primary)' }} />
                        <span className="text-sm" style={{ color: 'var(--uleam-text)' }}>{selectedFile.name}</span>
                      </div>
                    ) : (
                      <div>
                        <Upload size={24} className="mx-auto mb-1" style={{ color: 'var(--uleam-text-muted)' }} />
                        <p className="text-sm" style={{ color: 'var(--uleam-text)' }}>Click para subir foto</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--uleam-text-muted)' }}>JPG, PNG, WEBP</p>
                      </div>
                    )}
                  </div>
                  <input id="file-input" type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleFileChange} className="hidden" />

                  {!selectedFile && (
                    <input
                      type="url"
                      value={formData.foto}
                      onChange={(e) => { setFormData({ ...formData, foto: e.target.value }); setPreviewUrl(e.target.value); }}
                      className="w-full px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                      style={{
                        borderColor: 'var(--uleam-border)',
                        backgroundColor: 'var(--uleam-surface)',
                        color: 'var(--uleam-text)',
                        '--tw-ring-color': 'var(--uleam-focus-ring)',
                      } as React.CSSProperties}
                      placeholder="O ingresa URL de foto..."
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Materias */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>Materias</label>
              <textarea
                value={formData.materias}
                onChange={(e) => setFormData({ ...formData, materias: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                style={{
                  borderColor: 'var(--uleam-border)',
                  backgroundColor: 'var(--uleam-surface)',
                  color: 'var(--uleam-text)',
                  '--tw-ring-color': 'var(--uleam-focus-ring)',
                } as React.CSSProperties}
                placeholder="Ej: Administración Estratégica, Gestión Empresarial"
              />
              <p className="mt-1 text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                Lista de materias separadas por comas
              </p>
            </div>

            {/* Active */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="active" className="font-medium cursor-pointer" style={{ color: 'var(--uleam-text)' }}>
                Docente activo (visible en el sitio público)
              </label>
            </div>
          </div>
        </div>

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
            onClick={() => navigate('/admin/docentes')}
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
