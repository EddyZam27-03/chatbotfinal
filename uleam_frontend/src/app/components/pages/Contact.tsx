import { useState } from 'react';
import type { ChangeEvent, FormEvent, CSSProperties } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[0-9+\-\s()]{7,}$/.test(phone);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Ingresa un número de teléfono válido';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es requerido';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

    // Hide success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Dirección',
      content: 'Extensión El Carmen\nEl Carmen, Manabí, Ecuador',
    },
    {
      icon: Phone,
      title: 'Teléfono',
      content: '+593 (05) 266-1844',
    },
    {
      icon: Mail,
      title: 'Correo Electrónico',
      content: 'info@uleam.edu.ec\nadministracion.carmen@uleam.edu.ec',
    },
    {
      icon: Clock,
      title: 'Horario de Atención',
      content: 'Lunes a Viernes\n8:00 AM - 5:00 PM',
    },
  ];

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <section
        className="py-12 md:py-16 border-b"
        style={{
          backgroundColor: 'var(--uleam-surface)',
          borderColor: 'var(--uleam-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-4" style={{ color: 'var(--uleam-text)' }}>
            Contacto
          </h1>
          <p className="text-lg" style={{ color: 'var(--uleam-text-muted)' }}>
            Estamos aquí para ayudarte. Escríbenos o visítanos
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16" style={{ backgroundColor: 'var(--uleam-surface-2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h2 className="mb-6" style={{ color: 'var(--uleam-text)' }}>
                Información de Contacto
              </h2>

              <div className="space-y-6 mb-8">
                {contactInfo.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start space-x-4 p-4 rounded-xl"
                      style={{ backgroundColor: 'var(--uleam-surface)' }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--uleam-surface-2)' }}
                      >
                        <Icon size={24} style={{ color: 'var(--uleam-primary)' }} />
                      </div>
                      <div>
                        <div
                          className="font-semibold mb-1"
                          style={{ color: 'var(--uleam-text)' }}
                        >
                          {item.title}
                        </div>
                        <p
                          className="whitespace-pre-line"
                          style={{ color: 'var(--uleam-text-muted)' }}
                        >
                          {item.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map Placeholder */}
              <div
                className="w-full h-64 rounded-xl border flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--uleam-surface-3)',
                  borderColor: 'var(--uleam-border)',
                }}
              >
                <div className="text-center">
                  <MapPin size={48} style={{ color: 'var(--uleam-text-muted)' }} className="mx-auto mb-2" />
                  <p style={{ color: 'var(--uleam-text-muted)' }}>
                    Mapa de ubicación
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div
                className="rounded-2xl p-6 md:p-8"
                style={{ backgroundColor: 'var(--uleam-surface)' }}
              >
                <h2 className="mb-6" style={{ color: 'var(--uleam-text)' }}>
                  Envíanos un Mensaje
                </h2>

                {submitSuccess && (
                  <div
                    className="mb-6 p-4 rounded-xl flex items-start space-x-3"
                    style={{
                      backgroundColor: 'rgba(14, 106, 123, 0.1)',
                      border: '1px solid var(--uleam-accent-teal)',
                    }}
                  >
                    <CheckCircle2
                      size={20}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: 'var(--uleam-accent-teal)' }}
                    />
                    <div>
                      <p
                        className="font-semibold mb-1"
                        style={{ color: 'var(--uleam-accent-teal-dark)' }}
                      >
                        ¡Mensaje enviado con éxito!
                      </p>
                      <p className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                        Te responderemos a la brevedad posible.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2"
                      style={{ color: 'var(--uleam-text)' }}
                    >
                      Nombre completo <span style={{ color: 'var(--uleam-danger)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: errors.name ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                        '--tw-ring-color': errors.name
                          ? 'var(--uleam-danger)'
                          : 'var(--uleam-focus-ring)',
                      } as CSSProperties}
                      placeholder="Juan Pérez"
                    />
                    {errors.name && (
                      <p
                        className="mt-1 text-sm flex items-center space-x-1"
                        style={{ color: 'var(--uleam-danger)' }}
                      >
                        <AlertCircle size={14} />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2"
                      style={{ color: 'var(--uleam-text)' }}
                    >
                      Correo electrónico <span style={{ color: 'var(--uleam-danger)' }}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: errors.email ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                        '--tw-ring-color': errors.email
                          ? 'var(--uleam-danger)'
                          : 'var(--uleam-focus-ring)',
                      } as CSSProperties}
                      placeholder="juan.perez@ejemplo.com"
                    />
                    {errors.email && (
                      <p
                        className="mt-1 text-sm flex items-center space-x-1"
                        style={{ color: 'var(--uleam-danger)' }}
                      >
                        <AlertCircle size={14} />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2"
                      style={{ color: 'var(--uleam-text)' }}
                    >
                      Teléfono (opcional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: errors.phone ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                        '--tw-ring-color': errors.phone
                          ? 'var(--uleam-danger)'
                          : 'var(--uleam-focus-ring)',
                      } as CSSProperties}
                      placeholder="+593 999 999 999"
                    />
                    {errors.phone && (
                      <p
                        className="mt-1 text-sm flex items-center space-x-1"
                        style={{ color: 'var(--uleam-danger)' }}
                      >
                        <AlertCircle size={14} />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block mb-2"
                      style={{ color: 'var(--uleam-text)' }}
                    >
                      Asunto <span style={{ color: 'var(--uleam-danger)' }}>*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: errors.subject ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                        '--tw-ring-color': errors.subject
                          ? 'var(--uleam-danger)'
                          : 'var(--uleam-focus-ring)',
                      } as CSSProperties}
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="admision">Consulta sobre admisión</option>
                      <option value="matricula">Proceso de matrícula</option>
                      <option value="tramites">Trámites académicos</option>
                      <option value="homologacion">Homologación de materias</option>
                      <option value="titulacion">Proceso de titulación</option>
                      <option value="otro">Otro</option>
                    </select>
                    {errors.subject && (
                      <p
                        className="mt-1 text-sm flex items-center space-x-1"
                        style={{ color: 'var(--uleam-danger)' }}
                      >
                        <AlertCircle size={14} />
                        <span>{errors.subject}</span>
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block mb-2"
                      style={{ color: 'var(--uleam-text)' }}
                    >
                      Mensaje <span style={{ color: 'var(--uleam-danger)' }}>*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all resize-none"
                      style={{
                        borderColor: errors.message ? 'var(--uleam-danger)' : 'var(--uleam-border)',
                        '--tw-ring-color': errors.message
                          ? 'var(--uleam-danger)'
                          : 'var(--uleam-focus-ring)',
                      } as CSSProperties}
                      placeholder="Describe tu consulta..."
                    />
                    {errors.message && (
                      <p
                        className="mt-1 text-sm flex items-center space-x-1"
                        style={{ color: 'var(--uleam-danger)' }}
                      >
                        <AlertCircle size={14} />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      backgroundColor: 'var(--uleam-primary)',
                      color: 'var(--uleam-text-inverse)',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Enviar Mensaje</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Quick Chat Option */}
              <div className="mt-6">
                <div
                  className="rounded-xl p-4 flex items-center justify-between border"
                  style={{
                    backgroundColor: 'var(--uleam-surface)',
                    borderColor: 'var(--uleam-border)',
                  }}
                >
                  <div>
                    <p className="font-medium mb-1" style={{ color: 'var(--uleam-text)' }}>
                      ¿Necesitas respuesta inmediata?
                    </p>
                    <p className="text-sm" style={{ color: 'var(--uleam-text-muted)' }}>
                      Prueba nuestro asistente académico
                    </p>
                  </div>
                  <Link
                    to="/chatbot"
                    className="px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                    style={{
                      backgroundColor: 'var(--uleam-surface-2)',
                      color: 'var(--uleam-primary)',
                    }}
                  >
                    Abrir
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
