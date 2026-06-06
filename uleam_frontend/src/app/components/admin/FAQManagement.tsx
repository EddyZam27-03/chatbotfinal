import { useState } from 'react';
import type { CSSProperties } from 'react';
import { AdminLayout } from './AdminLayout';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: '1',
      question: '¿Cuáles son los requisitos de ingreso?',
      answer: 'Los requisitos incluyen: título de bachiller notariado, cédula de identidad, papeleta de votación y certificado de notas de secundaria.',
      category: 'Admisión',
      order: 1,
    },
    {
      id: '2',
      question: '¿Cuánto dura la carrera?',
      answer: 'La carrera de Administración tiene una duración de 8 semestres (4 años).',
      category: 'Académico',
      order: 2,
    },
    {
      id: '3',
      question: '¿Cuál es el costo de la matrícula?',
      answer: 'El costo de matrícula varía desde $350 hasta $500 por semestre, dependiendo del número de créditos.',
      category: 'Costos',
      order: 3,
    },
    {
      id: '4',
      question: '¿Cómo puedo contactarme con la universidad?',
      answer: 'Puedes contactarnos al teléfono +593 (05) 266-1844 o al correo info@uleam.edu.ec',
      category: 'Contacto',
      order: 4,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
  });

  const categories = ['General', 'Admisión', 'Académico', 'Matrícula', 'Costos', 'Contacto'];

  const handleAdd = () => {
    if (!formData.question.trim() || !formData.answer.trim()) return;

    const newItem: FAQItem = {
      id: Date.now().toString(),
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      order: faqs.length + 1,
    };

    setFaqs([...faqs, newItem]);
    setFormData({ question: '', answer: '', category: 'General' });
    setIsAdding(false);
  };

  const handleEdit = (item: FAQItem) => {
    setEditingId(item.id);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
    });
  };

  const handleUpdate = () => {
    if (!formData.question.trim() || !formData.answer.trim() || !editingId) return;

    setFaqs(
      faqs.map((item) =>
        item.id === editingId
          ? {
              ...item,
              question: formData.question,
              answer: formData.answer,
              category: formData.category,
            }
          : item
      )
    );
    setFormData({ question: '', answer: '', category: 'General' });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta pregunta?')) {
      setFaqs(faqs.filter((item) => item.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ question: '', answer: '', category: 'General' });
    setIsAdding(false);
    setEditingId(null);
  };

  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2" style={{ color: 'var(--uleam-text)' }}>
              Gestión de FAQ
            </h1>
            <p style={{ color: 'var(--uleam-text-muted)' }}>
              Administra las preguntas frecuentes del sitio
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
              <span>Agregar Pregunta</span>
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
              {editingId ? 'Editar Pregunta' : 'Nueva Pregunta'}
            </h3>
            <div className="space-y-4">
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
                  Pregunta
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as CSSProperties}
                  placeholder="¿Cuál es tu pregunta?"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--uleam-text)' }}>
                  Respuesta
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 resize-none"
                  style={{
                    borderColor: 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as CSSProperties}
                  placeholder="Escribe la respuesta..."
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

        {/* FAQ List by Category */}
        <div className="space-y-6">
          {Object.entries(groupedFaqs).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-3" style={{ color: 'var(--uleam-text)' }}>
                {category}
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl p-6 border"
                    style={{
                      backgroundColor: 'var(--uleam-surface)',
                      borderColor: 'var(--uleam-border)',
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="mb-2 font-semibold" style={{ color: 'var(--uleam-text)' }}>
                          {item.question}
                        </h4>
                        <p className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                          {item.answer}
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
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
