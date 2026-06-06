import { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { Plus, Edit2, Trash2, Save, X, CheckCircle2, HelpCircle } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';
import type { FAQItem } from '../../stores/dataStore';

export function FAQManagement() {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useDataStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ question: '', answer: '', category: 'General' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const categories = ['General', 'Admisión', 'Académico', 'Matrícula', 'Costos', 'Trámites', 'Contacto'];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.question.trim()) errors.question = 'La pregunta es obligatoria';
    else if (formData.question.trim().length < 10) errors.question = 'La pregunta debe tener al menos 10 caracteres';
    if (!formData.answer.trim()) errors.answer = 'La respuesta es obligatoria';
    else if (formData.answer.trim().length < 20) errors.answer = 'La respuesta debe tener al menos 20 caracteres';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    addFAQ({ question: formData.question.trim(), answer: formData.answer.trim(), category: formData.category });
    setFormData({ question: '', answer: '', category: 'General' });
    setIsAdding(false);
    showToast('Pregunta agregada correctamente');
  };

  const handleEdit = (item: FAQItem) => {
    setEditingId(item.id);
    setFormData({ question: item.question, answer: item.answer, category: item.category });
    setFormErrors({});
  };

  const handleUpdate = () => {
    if (!validate() || !editingId) return;
    updateFAQ(editingId, { question: formData.question.trim(), answer: formData.answer.trim(), category: formData.category });
    setFormData({ question: '', answer: '', category: 'General' });
    setEditingId(null);
    showToast('Pregunta actualizada correctamente');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta pregunta?')) {
      deleteFAQ(id);
      showToast('Pregunta eliminada');
    }
  };

  const handleCancel = () => {
    setFormData({ question: '', answer: '', category: 'General' });
    setFormErrors({});
    setIsAdding(false);
    setEditingId(null);
  };

  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQItem[]>);

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
            <h1 className="mb-1" style={{ color: 'var(--uleam-text)' }}>Gestión de FAQ</h1>
            <p style={{ color: 'var(--uleam-text-muted)' }}>
              {faqs.length} preguntas frecuentes · Administra el contenido del sitio
            </p>
          </div>
          {!isAdding && !editingId && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--uleam-primary)', color: 'var(--uleam-text-inverse)' }}
            >
              <Plus size={20} />
              <span>Agregar Pregunta</span>
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
              {editingId ? 'Editar Pregunta' : 'Nueva Pregunta'}
            </h3>
            <div className="space-y-4">
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
                  Pregunta <span style={{ color: 'var(--uleam-danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => { setFormData({ ...formData, question: e.target.value }); setFormErrors((p) => ({ ...p, question: '' })); }}
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: formErrors.question ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as React.CSSProperties}
                  placeholder="¿Cuál es tu pregunta?"
                />
                {formErrors.question && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--uleam-danger)' }}>{formErrors.question}</p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--uleam-text)' }}>
                  Respuesta <span style={{ color: 'var(--uleam-danger)' }}>*</span>
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => { setFormData({ ...formData, answer: e.target.value }); setFormErrors((p) => ({ ...p, answer: '' })); }}
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 resize-none"
                  style={{
                    borderColor: formErrors.answer ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as React.CSSProperties}
                  placeholder="Escribe la respuesta..."
                />
                {formErrors.answer && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--uleam-danger)' }}>{formErrors.answer}</p>
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

        {/* FAQ List by Category */}
        {Object.keys(groupedFaqs).length === 0 ? (
          <div className="text-center py-16">
            <HelpCircle size={48} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--uleam-text-muted)' }} />
            <p style={{ color: 'var(--uleam-text-muted)' }}>No hay preguntas frecuentes aún. Agrega la primera.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedFaqs).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 style={{ color: 'var(--uleam-text)' }}>{category}</h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--uleam-surface-2)', color: 'var(--uleam-text-muted)' }}
                  >
                    {items.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl p-5 border transition-all hover:shadow-sm"
                      style={{ backgroundColor: 'var(--uleam-surface)', borderColor: 'var(--uleam-border)' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="mb-2 font-semibold" style={{ color: 'var(--uleam-text)' }}>{item.question}</h4>
                          <p className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>{item.answer}</p>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
