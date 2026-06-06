import { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { Plus, Edit2, Trash2, Save, X, CheckCircle2, Bot, Tag } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';
import type { KnowledgeItem } from '../../stores/dataStore';

export function ChatbotManagement() {
  const { chatbotKnowledge, addKnowledge, updateKnowledge, deleteKnowledge } = useDataStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ keywords: '', response: '', category: 'General' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['General', 'Admisión', 'Académico', 'Matrícula', 'Contacto', 'Costos', 'Trámites'];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.keywords.trim()) errors.keywords = 'Las palabras clave son obligatorias';
    if (!formData.response.trim()) errors.response = 'La respuesta es obligatoria';
    else if (formData.response.trim().length < 10) errors.response = 'La respuesta debe tener al menos 10 caracteres';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    addKnowledge({
      keywords: formData.keywords.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean),
      response: formData.response.trim(),
      category: formData.category,
    });
    setFormData({ keywords: '', response: '', category: 'General' });
    setIsAdding(false);
    showToast('Respuesta agregada correctamente');
  };

  const handleEdit = (item: KnowledgeItem) => {
    setEditingId(item.id);
    setFormData({ keywords: item.keywords.join(', '), response: item.response, category: item.category });
    setFormErrors({});
  };

  const handleUpdate = () => {
    if (!validate() || !editingId) return;
    updateKnowledge(editingId, {
      keywords: formData.keywords.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean),
      response: formData.response.trim(),
      category: formData.category,
    });
    setFormData({ keywords: '', response: '', category: 'General' });
    setEditingId(null);
    showToast('Respuesta actualizada correctamente');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este elemento?')) {
      deleteKnowledge(id);
      showToast('Elemento eliminado');
    }
  };

  const handleCancel = () => {
    setFormData({ keywords: '', response: '', category: 'General' });
    setFormErrors({});
    setIsAdding(false);
    setEditingId(null);
  };

  const filteredKnowledge =
    filterCategory === 'all'
      ? chatbotKnowledge
      : chatbotKnowledge.filter((k) => k.category === filterCategory);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg bg-green-600 text-white">
            <CheckCircle2 size={18} />
            <span>{toast}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-1" style={{ color: 'var(--uleam-text)' }}>Gestión del Asistente</h1>
            <p style={{ color: 'var(--uleam-text-muted)' }}>
              {chatbotKnowledge.length} respuestas en la base de conocimiento
            </p>
          </div>
          {!isAdding && !editingId && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--uleam-primary)', color: 'var(--uleam-text-inverse)' }}
            >
              <Plus size={20} />
              <span>Agregar Respuesta</span>
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div
            className="rounded-xl p-6 border"
            style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
          >
            <h3 className="mb-4" style={{ color: 'var(--uleam-text)' }}>
              {editingId ? 'Editar Respuesta' : 'Nueva Respuesta'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--uleam-text)' }}>
                  Palabras clave <span style={{ color: 'var(--uleam-danger)' }}>*</span>
                  <span className="ml-1 font-normal" style={{ color: 'var(--uleam-text-muted)' }}>(separadas por comas)</span>
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => { setFormData({ ...formData, keywords: e.target.value }); setFormErrors((p) => ({ ...p, keywords: '' })); }}
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: formErrors.keywords ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as React.CSSProperties}
                  placeholder="ej: requisito, ingreso, admisión"
                />
                {formErrors.keywords && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--uleam-danger)' }}>{formErrors.keywords}</p>
                )}
                <p className="mt-1 text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                  El asistente usará estas palabras para detectar preguntas relacionadas.
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--uleam-text)' }}>Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2"
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

              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--uleam-text)' }}>
                  Respuesta <span style={{ color: 'var(--uleam-danger)' }}>*</span>
                </label>
                <textarea
                  value={formData.response}
                  onChange={(e) => { setFormData({ ...formData, response: e.target.value }); setFormErrors((p) => ({ ...p, response: '' })); }}
                  rows={5}
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 resize-none"
                  style={{
                    borderColor: formErrors.response ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as React.CSSProperties}
                  placeholder="Escribe la respuesta del asistente. Puedes usar **negritas** y saltos de línea."
                />
                {formErrors.response && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--uleam-danger)' }}>{formErrors.response}</p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={editingId ? handleUpdate : handleAdd}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all hover:shadow-md"
                  style={{ backgroundColor: 'var(--uleam-primary)', color: 'var(--uleam-text-inverse)' }}
                >
                  <Save size={18} />
                  <span>{editingId ? 'Actualizar' : 'Guardar'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all border"
                  style={{ borderColor: 'var(--uleam-border)', color: 'var(--uleam-text)' }}
                >
                  <X size={18} />
                  <span>Cancelar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {['all', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className="px-3 py-1.5 text-sm rounded-full border transition-colors"
              style={{
                backgroundColor: filterCategory === cat ? 'var(--uleam-primary)' : 'transparent',
                color: filterCategory === cat ? 'var(--uleam-text-inverse)' : 'var(--uleam-text)',
                borderColor: filterCategory === cat ? 'var(--uleam-primary)' : 'var(--uleam-border)',
              }}
            >
              {cat === 'all' ? 'Todas' : cat}
            </button>
          ))}
        </div>

        {/* Knowledge Base List */}
        {filteredKnowledge.length === 0 ? (
          <div className="text-center py-16">
            <Bot size={48} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--uleam-text-muted)' }} />
            <p style={{ color: 'var(--uleam-text-muted)' }}>No hay respuestas en esta categoría.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredKnowledge.map((item) => (
              <div
                key={item.id}
                className="rounded-xl p-5 border transition-all hover:shadow-sm"
                style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ backgroundColor: 'var(--uleam-primary)', color: 'var(--uleam-text-inverse)' }}
                      >
                        {item.category}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border"
                            style={{
                              backgroundColor: 'var(--uleam-surface-2)',
                              color: 'var(--uleam-text-muted)',
                              borderColor: 'var(--uleam-border)',
                            }}
                          >
                            <Tag size={10} />
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--uleam-text)' }}>{item.response}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-lg hover:bg-[var(--uleam-surface-2)] transition-colors"
                      style={{ color: 'var(--uleam-primary)' }}
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      style={{ color: 'var(--uleam-danger)' }}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
