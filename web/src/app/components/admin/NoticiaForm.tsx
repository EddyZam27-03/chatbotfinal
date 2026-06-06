import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useNavigate, useParams } from 'react-router';
import { Upload, X, Newspaper, CheckCircle2, AlertCircle } from 'lucide-react';
import { noticiasService, type NoticiaCreate, type NoticiaUpdate } from '../../services/noticiasService';

export function NoticiaForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Académico',
    activo: true,
    imagen: '',
    fecha: new Date().toISOString().split('T')[0],
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  const categories = ['Infraestructura', 'Logros Estudiantiles', 'Convenios', 'Eventos', 'Académico', 'Investigación'];

  useEffect(() => {
    if (isEditing && id) {
      loadNoticia();
    }
  }, [id, isEditing]);

  const loadNoticia = async () => {
    try {
      const noticia = await noticiasService.getById(id!);
      setFormData({
        titulo: noticia.titulo,
        descripcion: noticia.descripcion,
        categoria: noticia.categoria,
        activo: noticia.activo,
        imagen: noticia.imagen_url ?? '',
        fecha: noticia.fecha,
      });
      setPreviewUrl(noticia.imagen_url ?? '');
    } catch (error) {
      console.error('Error al cargar noticia:', error);
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
          setFormData((prev) => ({ ...prev, imagen: dataUrl }));
        };
        reader.readAsDataURL(file);
      } else {
        setErrors((prev) => ({ ...prev, imagen: `Formato no permitido. Solo: ${allowedExtensions.join(', ')}` }));
        e.target.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData((prev) => ({ ...prev, imagen: '' }));
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.titulo.trim()) newErrors.titulo = 'El título es obligatorio';
    else if (formData.titulo.trim().length < 5) newErrors.titulo = 'El título debe tener al menos 5 caracteres';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria';
    else if (formData.descripcion.trim().length < 20) newErrors.descripcion = 'La descripción debe tener al menos 20 caracteres';
    if (!formData.fecha) newErrors.fecha = 'La fecha es obligatoria';
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
        const data: NoticiaUpdate = {};
        if (formData.titulo.trim()) data.titulo = formData.titulo.trim();
        if (formData.descripcion.trim()) data.descripcion = formData.descripcion.trim();
        if (formData.categoria) data.categoria = formData.categoria;
        data.activo = formData.activo;
        if (formData.fecha) data.fecha = formData.fecha;
        
        await noticiasService.update(id, data, token, selectedFile || undefined);
      } else {
        const data: NoticiaCreate = {
          titulo: formData.titulo.trim(),
          descripcion: formData.descripcion.trim(),
          categoria: formData.categoria,
          activo: formData.activo,
          fecha: formData.fecha,
        };
        
        await noticiasService.create(data, token, selectedFile || undefined);
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (action === 'save') {
          navigate('/admin/noticias');
        } else if (action === 'save-add') {
          setFormData({ titulo: '', descripcion: '', categoria: 'Académico', activo: true, imagen: '', fecha: new Date().toISOString().split('T')[0] });
          handleRemoveFile();
          setErrors({});
        }
      }, 1200);
    } catch (error) {
      console.error('Error al guardar noticia:', error);
      alert('Error al guardar noticia. Verifica que estés autenticado.');
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
            onClick={() => navigate('/admin/noticias')}
            className="hover:underline"
            style={{ color: 'var(--uleam-text-muted)' }}
          >
            Noticias
          </button>
          <span>/</span>
          <span style={{ color: 'var(--uleam-text)' }}>{isEditing ? 'Editar noticia' : 'Agregar noticia'}</span>
        </div>

        <h1 style={{ color: 'var(--uleam-text)' }}>{isEditing ? 'Editar Noticia' : 'Agregar Noticia'}</h1>

        {showSuccess && (
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderLeft: '4px solid #22C55E', color: '#16A34A' }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span className="font-medium">
                {isEditing ? 'Noticia actualizada correctamente.' : 'Noticia creada correctamente.'}
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
            {/* Título */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>
                Título <span style={{ color: 'var(--uleam-danger)' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => { setFormData({ ...formData, titulo: e.target.value }); setErrors((p) => ({ ...p, titulo: '' })); }}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.titulo ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                  backgroundColor: 'var(--uleam-surface)',
                  color: 'var(--uleam-text)',
                  '--tw-ring-color': 'var(--uleam-focus-ring)',
                } as React.CSSProperties}
                placeholder="Ej: Inauguración de Nuevas Instalaciones"
              />
              {errors.titulo && (
                <p className="mt-1 text-xs flex items-center gap-1" style={{ color: 'var(--uleam-danger)' }}>
                  <AlertCircle size={13} /> {errors.titulo}
                </p>
              )}
            </div>

            {/* Fecha y Categoría en fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>
                  Fecha <span style={{ color: 'var(--uleam-danger)' }}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => { setFormData({ ...formData, fecha: e.target.value }); setErrors((p) => ({ ...p, fecha: '' })); }}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: errors.fecha ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as React.CSSProperties}
                />
                {errors.fecha && (
                  <p className="mt-1 text-xs flex items-center gap-1" style={{ color: 'var(--uleam-danger)' }}>
                    <AlertCircle size={13} /> {errors.fecha}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
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
            </div>

            {/* Imagen Upload */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>Imagen Destacada</label>
              <div className="space-y-3">
                {previewUrl && (
                  <div className="relative inline-block">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full max-w-md h-48 rounded-lg object-cover border-2"
                      style={{ borderColor: 'var(--uleam-border)' }}
                    />
                    <button
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-[var(--uleam-primary)] transition-colors"
                  style={{ borderColor: 'var(--uleam-border)' }}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center space-x-3">
                      <Newspaper size={24} style={{ color: 'var(--uleam-primary)' }} />
                      <div className="text-left">
                        <div className="font-medium" style={{ color: 'var(--uleam-text)' }}>{selectedFile.name}</div>
                        <div className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>{(selectedFile.size / 1024).toFixed(2)} KB</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload size={32} className="mx-auto mb-2" style={{ color: 'var(--uleam-text-muted)' }} />
                      <p style={{ color: 'var(--uleam-text)' }}>Click para subir imagen</p>
                      <p className="text-sm mt-1" style={{ color: 'var(--uleam-text-muted)' }}>JPG, PNG, WEBP (máx. 2MB)</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--uleam-text-muted)' }}>Recomendado: 1600×900px (16:9)</p>
                    </div>
                  )}
                </div>
                <input id="file-input" type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleFileChange} className="hidden" />

                {/* URL de imagen alternativa */}
                {!selectedFile && (
                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                      O ingresa la URL de una imagen:
                    </label>
                    <input
                      type="url"
                      value={formData.imagen}
                      onChange={(e) => { setFormData({ ...formData, imagen: e.target.value }); setPreviewUrl(e.target.value); }}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                      style={{
                        borderColor: 'var(--uleam-border)',
                        backgroundColor: 'var(--uleam-surface)',
                        color: 'var(--uleam-text)',
                        '--tw-ring-color': 'var(--uleam-focus-ring)',
                      } as React.CSSProperties}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block mb-2 font-medium" style={{ color: 'var(--uleam-text)' }}>
                Descripción <span style={{ color: 'var(--uleam-danger)' }}>*</span>
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => { setFormData({ ...formData, descripcion: e.target.value }); setErrors((p) => ({ ...p, descripcion: '' })); }}
                rows={8}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                style={{
                  borderColor: errors.descripcion ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                  backgroundColor: 'var(--uleam-surface)',
                  color: 'var(--uleam-text)',
                  '--tw-ring-color': 'var(--uleam-focus-ring)',
                } as React.CSSProperties}
                placeholder="Escriba el contenido completo de la noticia..."
              />
              {errors.descripcion && (
                <p className="mt-1 text-xs flex items-center gap-1" style={{ color: 'var(--uleam-danger)' }}>
                  <AlertCircle size={13} /> {errors.descripcion}
                </p>
              )}
              <p className="mt-1 text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                {formData.descripcion.length} caracteres
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
                Noticia activa (visible en el sitio público)
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
            Guardar
          </button>
          {!isEditing && (
            <button
              onClick={() => handleSave('save-add')}
              className="px-6 py-2.5 rounded-lg font-medium border transition-all hover:bg-[var(--uleam-surface-2)]"
              style={{ borderColor: 'var(--uleam-border)', color: 'var(--uleam-text)' }}
            >
              Guardar y agregar otra
            </button>
          )}
          <button
            onClick={() => navigate('/admin/noticias')}
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
