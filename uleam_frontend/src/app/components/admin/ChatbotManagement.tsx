import { useState } from 'react';
import type { CSSProperties } from 'react';
import { AdminLayout } from './AdminLayout';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface KnowledgeItem {
  id: string;
  keywords: string[];
  response: string;
  category: string;
}

export function ChatbotManagement() {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([
    {
      id: '1',
      keywords: ['requisito', 'ingreso', 'admisión'],
      response: 'Para ingresar necesitas: título de bachiller, cédula, certificado de notas.',
      category: 'Admisión',
    },
    {
      id: '2',
      keywords: ['malla', 'curricular', 'materia', 'asignatura'],
      response: 'La malla curricular tiene 8 semestres con materias de administración.',
      category: 'Académico',
    },
    {
      id: '3',
      keywords: ['matrícula', 'inscripción', 'registro'],
      response: 'El proceso de matrícula incluye: prematrícula en línea, validación y confirmación.',
      category: 'Matrícula',
    },
    {
      id: '4',
      keywords: ['contacto', 'teléfono', 'correo', 'dirección'],
      response: 'Puedes contactarnos al +593 (05) 266-1844 o info@uleam.edu.ec',
      category: 'Contacto',
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    keywords: '',
    response: '',
    category: 'General',
  });

  const categories = ['General', 'Admisión', 'Académico', 'Matrícula', 'Contacto', 'Costos'];

  const handleAdd = () => {
    if (!formData.keywords.trim() || !formData.response.trim()) return;

    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      keywords: formData.keywords.split(',').map((k) => k.trim()),
      response: formData.response,
      category: formData.category,
    };

    setKnowledgeBase([...knowledgeBase, newItem]);
    setFormData({ keywords: '', response: '', category: 'General' });
    setIsAdding(false);
  };

  const handleEdit = (item: KnowledgeItem) => {
    setEditingId(item.id);
    setFormData({
      keywords: item.keywords.join(', '),
      response: item.response,
      category: item.category,
    });
  };

  const handleUpdate = () => {
    if (!formData.keywords.trim() || !formData.response.trim() || !editingId) return;

    setKnowledgeBase(
      knowledgeBase.map((item) =>
        item.id === editingId
          ? {
              ...item,
              keywords: formData.keywords.split(',').map((k) => k.trim()),
              response: formData.response,
              category: formData.category,
            }
          : item
      )
    );
    setFormData({ keywords: '', response: '', category: 'General' });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este elemento?')) {
      setKnowledgeBase(knowledgeBase.filter((item) => item.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ keywords: '', response: '', category: 'General' });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2" style={{ color: 'var(--uleam-text)' }}>
              Gestión del Chatbot
            </h1>
            <p style={{ color: 'var(--uleam-text-muted)' }}>
              Administra las respuestas del asistente académico
            </p>
          </div>
          {!isAdding && !editingId && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all hover:shadow-md"
              style={{
                backgroundColor: 'var(--uleam-primary)',
                color: 'var(--uleam-text-inverse)',
              }}
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
            style={{
              backgroundColor: 'var(--uleam-surface)',
              borderColor: 'var(--uleam-border)',
            }}
          >
            <h3 className="mb-4" style={{ color: 'var(--uleam-text)' }}>
              {editingId ? 'Editar Respuesta' : 'Nueva Respuesta'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--uleam-text)' }}>
                  Palabras clave (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as CSSProperties}
                  placeholder="ej: requisito, ingreso, admisión"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--uleam-text)' }}>
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2"
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
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--uleam-text)' }}>
                  Respuesta
                </label>
                <textarea
                  value={formData.response}
                  onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 resize-none"
                  style={{
                    borderColor: 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as CSSProperties}
                  placeholder="Escribe la respuesta del chatbot..."
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={editingId ? handleUpdate : handleAdd}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all hover:shadow-md"
                  style={{
                    backgroundColor: 'var(--uleam-primary)',
                    color: 'var(--uleam-text-inverse)',
                  }}
                >
                  <Save size={18} />
                  <span>{editingId ? 'Actualizar' : 'Guardar'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all border"
                  style={{
                    borderColor: 'var(--uleam-border)',
                    color: 'var(--uleam-text)',
                  }}
                >
                  <X size={18} />
                  <span>Cancelar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Base List */}
        <div className="space-y-3">
          {knowledgeBase.map((item) => (
            <div
              key={item.id}
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: 'var(--uleam-surface)',
                borderColor: 'var(--uleam-border)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: 'var(--uleam-primary)',
                        color: 'var(--uleam-text-inverse)',
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: 'var(--uleam-surface-2)',
                          color: 'var(--uleam-text-muted)',
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--uleam-text)' }}>
                    {item.response}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-lg hover:bg-[var(--uleam-surface-2)] transition-colors"
                    style={{ color: 'var(--uleam-text-muted)' }}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    style={{ color: 'var(--uleam-danger)' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
