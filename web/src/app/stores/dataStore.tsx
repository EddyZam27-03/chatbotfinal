import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ENDPOINTS, fetchAPI, fetchAPIWithAuth } from '../config/api';
import {
  DOCENTES_DATA,
  NOTICIAS_DATA,
  DOCUMENTOS_DATA,
  type Docente,
  type Noticia,
  type Documento,
} from '../data/mockData';

// ===================================
// TYPES
// ===================================

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface KnowledgeItem {
  id: string;
  keywords: string[];
  response: string;
  category: string;
}

export interface DataStore {
  // Data
  noticias: Noticia[];
  docentes: Docente[];
  documentos: Documento[];
  faqs: FAQItem[];
  chatbotKnowledge: KnowledgeItem[];

  // Noticias CRUD
  addNoticia: (noticia: Omit<Noticia, 'id' | 'createdAt' | 'updatedAt'>) => Noticia;
  updateNoticia: (id: string, data: Partial<Noticia>) => void;
  deleteNoticia: (id: string) => void;
  bulkUpdateNoticias: (ids: string[], data: Partial<Noticia>) => void;
  bulkDeleteNoticias: (ids: string[]) => void;

  // Docentes CRUD
  addDocente: (docente: Omit<Docente, 'id' | 'createdAt' | 'updatedAt'>) => Docente;
  updateDocente: (id: string, data: Partial<Docente>) => void;
  deleteDocente: (id: string) => void;
  bulkUpdateDocentes: (ids: string[], data: Partial<Docente>) => void;
  bulkDeleteDocentes: (ids: string[]) => void;

  // Documentos CRUD
  addDocumento: (doc: Omit<Documento, 'id' | 'uploadDate' | 'lastModified'>) => Documento;
  updateDocumento: (id: string, data: Partial<Documento>) => void;
  deleteDocumento: (id: string) => void;
  bulkUpdateDocumentos: (ids: string[], data: Partial<Documento>) => void;
  bulkDeleteDocumentos: (ids: string[]) => void;

  // FAQ CRUD
  addFAQ: (item: Omit<FAQItem, 'id' | 'order'>) => FAQItem;
  updateFAQ: (id: string, data: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;

  // Chatbot CRUD
  addKnowledge: (item: Omit<KnowledgeItem, 'id'>) => KnowledgeItem;
  updateKnowledge: (id: string, data: Partial<KnowledgeItem>) => void;
  deleteKnowledge: (id: string) => void;
}

// ===================================
// DEFAULT FAQ DATA
// ===================================
const DEFAULT_FAQS: FAQItem[] = [
  { id: '1', question: '¿Cuáles son los requisitos de ingreso a la carrera?', answer: 'Los requisitos incluyen: título de bachiller notariado, cédula de identidad, papeleta de votación, certificado de notas de secundaria y rendir la prueba SNNA del CES.', category: 'Admisión', order: 1 },
  { id: '2', question: '¿Cuánto dura la carrera de Administración?', answer: 'La carrera de Administración de Empresas tiene una duración de 8 semestres (4 años), más el período de titulación.', category: 'Admisión', order: 2 },
  { id: '3', question: '¿Cuándo son los períodos de matrícula?', answer: 'Los períodos de matrícula se realizan dos veces al año: en abril-mayo para el período Mayo-Octubre, y en octubre-noviembre para el período Noviembre-Abril.', category: 'Matrícula', order: 3 },
  { id: '4', question: '¿Qué documentos necesito para la matrícula?', answer: 'Para la matrícula necesitas: cédula de identidad vigente, récord académico actualizado, comprobante de pago de aranceles y estar al día en todas las obligaciones con la universidad.', category: 'Matrícula', order: 4 },
  { id: '5', question: '¿Cuál es el costo de la matrícula?', answer: 'El costo de matrícula varía entre $350 y $500 por semestre según el número de créditos matriculados. La universidad ofrece facilidades de pago y becas socioeconómicas.', category: 'Matrícula', order: 5 },
  { id: '6', question: '¿Cómo funciona el sistema de evaluación?', answer: 'El sistema de evaluación contempla: asistencia (10%), actividades en clase (20%), evaluación continua (30%) y examen final (40%). La nota mínima de aprobación es 7/10.', category: 'Académico', order: 6 },
  { id: '7', question: '¿Puedo homologar materias de otra universidad?', answer: 'Sí, puedes solicitar la homologación de materias presentando el sílabo oficial de la asignatura aprobada en tu universidad de origen. El proceso debe realizarse en Secretaría General.', category: 'Académico', order: 7 },
  { id: '8', question: '¿Qué opciones de titulación existen?', answer: 'Las opciones de titulación son: Examen de grado (Complexivo), Trabajo de titulación (Proyecto de investigación) y Análisis de casos. Cada modalidad tiene sus propios requisitos.', category: 'Trámites', order: 8 },
  { id: '9', question: '¿Cómo solicito un certificado de matrícula o de notas?', answer: 'Los certificados se solicitan en Secretaría General presentando tu cédula de identidad. El tiempo de entrega es de 3 a 5 días hábiles. También puedes solicitarlos a través del sistema en línea de ULEAM.', category: 'Trámites', order: 9 },
  { id: '10', question: '¿Cuál es el horario de atención de secretaría?', answer: 'Secretaría atiende de lunes a viernes de 8:00 AM a 5:00 PM. Para trámites urgentes fuera de horario, puedes comunicarte al correo institucional.', category: 'Trámites', order: 10 },
  { id: '11', question: '¿La universidad ofrece becas o ayudas económicas?', answer: 'ULEAM ofrece becas socioeconómicas, becas de excelencia académica y descuentos por ser hijo de funcionario universitario. Las solicitudes se realizan al inicio de cada período académico.', category: 'Admisión', order: 11 },
];

// ===================================
// DEFAULT CHATBOT KNOWLEDGE
// ===================================
const DEFAULT_KNOWLEDGE: KnowledgeItem[] = [
  { id: '1', keywords: ['requisito', 'ingreso', 'admisión', 'bachiller', 'snna'], response: 'Para ingresar a la carrera de Administración en ULEAM Extensión El Carmen necesitas: título de bachiller notariado, cédula de identidad y papeleta de votación, certificado de notas de secundaria, y haber rendido la prueba SNNA. El proceso de admisión se realiza en línea en www.uleam.edu.ec.', category: 'Admisión' },
  { id: '2', keywords: ['malla', 'curricular', 'materia', 'asignatura', 'semestre'], response: 'La carrera de Administración tiene una duración de 8 semestres (4 años). Incluye asignaturas de: Administración Estratégica, Contabilidad, Marketing, Finanzas, Recursos Humanos, Economía y Proyectos. Total: 240 créditos.', category: 'Académico' },
  { id: '3', keywords: ['matrícula', 'matricula', 'inscripción', 'inscribir', 'registrar'], response: 'El proceso de matrícula tiene 3 pasos: 1) Prematrícula en línea (selección de materias y horarios), 2) Validación presencial (documentos y pago), 3) Confirmación (recibo y horario definitivo). El costo es desde $350 según el número de créditos.', category: 'Matrícula' },
  { id: '4', keywords: ['fecha', 'calendario', 'período', 'inicio', 'fin', 'clase'], response: 'Las fechas del período 2026: Inscripciones: 15-30 Abril | Pruebas de admisión: 5-10 Mayo | Matrícula ordinaria: 20 Mayo - 5 Junio | Inicio de clases: 12 Junio | Fin de semestre: 15 Octubre.', category: 'Académico' },
  { id: '5', keywords: ['contacto', 'teléfono', 'correo', 'dirección', 'ubicación', 'secretaría'], response: 'Información de contacto: Dirección: Extensión El Carmen, El Carmen, Manabí, Ecuador | Teléfono: +593 (05) 266-1844 | Correo: info@uleam.edu.ec | Horario de atención: Lunes a Viernes 8:00 AM - 5:00 PM.', category: 'Contacto' },
  { id: '6', keywords: ['beca', 'ayuda', 'económica', 'descuento', 'costo', 'precio', 'arancel'], response: 'ULEAM ofrece becas socioeconómicas, becas de excelencia académica y descuentos para hijos de funcionarios. Las solicitudes se realizan al inicio de cada período. El costo de matrícula va de $350 a $500 por semestre.', category: 'Costos' },
  { id: '7', keywords: ['titulación', 'tesis', 'graduación', 'grado', 'titularse', 'diploma'], response: 'Las opciones de titulación son: Examen Complexivo, Proyecto de Investigación, y Análisis de Casos. Para titularse debes haber aprobado todos los créditos, tener las prácticas preprofesionales completas y estar al día en obligaciones con la universidad.', category: 'Académico' },
  { id: '8', keywords: ['certificado', 'record', 'récord', 'nota', 'documento', 'trámite'], response: 'Los certificados (matrícula, notas, egresado) se solicitan en Secretaría General con cédula de identidad. El tiempo de entrega es 3-5 días hábiles. También puedes solicitarlos en línea a través del portal estudiantil de ULEAM.', category: 'Trámites' },
];

// ===================================
// CONTEXT
// ===================================
const DataStoreContext = createContext<DataStore | null>(null);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse errors
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [noticias, setNoticias] = useState<Noticia[]>(() =>
    loadFromStorage('uleam-noticias', NOTICIAS_DATA)
  );
  const [docentes, setDocentes] = useState<Docente[]>(() =>
    loadFromStorage('uleam-docentes', DOCENTES_DATA)
  );
  const [documentos, setDocumentos] = useState<Documento[]>(() =>
    loadFromStorage('uleam-documentos', DOCUMENTOS_DATA)
  );
  const [faqs, setFaqs] = useState<FAQItem[]>(() =>
    loadFromStorage('uleam-faqs', DEFAULT_FAQS)
  );
  const [chatbotKnowledge, setChatbotKnowledge] = useState<KnowledgeItem[]>(() =>
    loadFromStorage('uleam-chatbot', DEFAULT_KNOWLEDGE)
  );

  useEffect(() => { saveToStorage('uleam-noticias', noticias); }, [noticias]);
  useEffect(() => { saveToStorage('uleam-docentes', docentes); }, [docentes]);
  useEffect(() => { saveToStorage('uleam-documentos', documentos); }, [documentos]);
  useEffect(() => { saveToStorage('uleam-faqs', faqs); }, [faqs]);
  useEffect(() => { saveToStorage('uleam-chatbot', chatbotKnowledge); }, [chatbotKnowledge]);

  // ---- Noticias ----
  const addNoticia = (data: Omit<Noticia, 'id' | 'createdAt' | 'updatedAt'>): Noticia => {
    const now = new Date().toISOString().split('T')[0];
    const newNoticia: Noticia = { ...data, id: Date.now().toString(), createdAt: now, updatedAt: now };
    setNoticias((prev) => [newNoticia, ...prev]);
    return newNoticia;
  };

  const updateNoticia = (id: string, data: Partial<Noticia>) => {
    const now = new Date().toISOString().split('T')[0];
    setNoticias((prev) => prev.map((n) => (n.id === id ? { ...n, ...data, updatedAt: now } : n)));
  };

  const deleteNoticia = (id: string) => {
    setNoticias((prev) => prev.filter((n) => n.id !== id));
  };

  const bulkUpdateNoticias = (ids: string[], data: Partial<Noticia>) => {
    const now = new Date().toISOString().split('T')[0];
    setNoticias((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, ...data, updatedAt: now } : n)));
  };

  const bulkDeleteNoticias = (ids: string[]) => {
    setNoticias((prev) => prev.filter((n) => !ids.includes(n.id)));
  };

  // ---- Docentes ----
  const addDocente = (data: Omit<Docente, 'id' | 'createdAt' | 'updatedAt'>): Docente => {
    const now = new Date().toISOString().split('T')[0];
    const newDocente: Docente = { ...data, id: Date.now().toString(), createdAt: now, updatedAt: now };
    setDocentes((prev) => [newDocente, ...prev]);
    return newDocente;
  };

  const updateDocente = (id: string, data: Partial<Docente>) => {
    const now = new Date().toISOString().split('T')[0];
    setDocentes((prev) => prev.map((d) => (d.id === id ? { ...d, ...data, updatedAt: now } : d)));
  };

  const deleteDocente = (id: string) => {
    setDocentes((prev) => prev.filter((d) => d.id !== id));
  };

  const bulkUpdateDocentes = (ids: string[], data: Partial<Docente>) => {
    const now = new Date().toISOString().split('T')[0];
    setDocentes((prev) => prev.map((d) => (ids.includes(d.id) ? { ...d, ...data, updatedAt: now } : d)));
  };

  const bulkDeleteDocentes = (ids: string[]) => {
    setDocentes((prev) => prev.filter((d) => !ids.includes(d.id)));
  };

  // ---- Documentos ----
  const addDocumento = (data: Omit<Documento, 'id' | 'uploadDate' | 'lastModified'>): Documento => {
    const now = new Date().toISOString().split('T')[0];
    const newDoc: Documento = { ...data, id: Date.now().toString(), uploadDate: now, lastModified: now };
    setDocumentos((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const updateDocumento = (id: string, data: Partial<Documento>) => {
    const now = new Date().toISOString().split('T')[0];
    setDocumentos((prev) => prev.map((d) => (d.id === id ? { ...d, ...data, lastModified: now } : d)));
  };

  const deleteDocumento = (id: string) => {
    setDocumentos((prev) => prev.filter((d) => d.id !== id));
  };

  const bulkUpdateDocumentos = (ids: string[], data: Partial<Documento>) => {
    const now = new Date().toISOString().split('T')[0];
    setDocumentos((prev) => prev.map((d) => (ids.includes(d.id) ? { ...d, ...data, lastModified: now } : d)));
  };

  const bulkDeleteDocumentos = (ids: string[]) => {
    setDocumentos((prev) => prev.filter((d) => !ids.includes(d.id)));
  };

  // ---- FAQ ----
  const addFAQ = (data: Omit<FAQItem, 'id' | 'order'>): FAQItem => {
    const newItem: FAQItem = { ...data, id: Date.now().toString(), order: faqs.length + 1 };
    setFaqs((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateFAQ = (id: string, data: Partial<FAQItem>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f)));
  };

  const deleteFAQ = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // ---- Chatbot ----
  const addKnowledge = (data: Omit<KnowledgeItem, 'id'>): KnowledgeItem => {
    const newItem: KnowledgeItem = { ...data, id: Date.now().toString() };
    setChatbotKnowledge((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateKnowledge = (id: string, data: Partial<KnowledgeItem>) => {
    setChatbotKnowledge((prev) => prev.map((k) => (k.id === id ? { ...k, ...data } : k)));
  };

  const deleteKnowledge = (id: string) => {
    setChatbotKnowledge((prev) => prev.filter((k) => k.id !== id));
  };

  const value: DataStore = {
    noticias,
    docentes,
    documentos,
    faqs,
    chatbotKnowledge,
    addNoticia,
    updateNoticia,
    deleteNoticia,
    bulkUpdateNoticias,
    bulkDeleteNoticias,
    addDocente,
    updateDocente,
    deleteDocente,
    bulkUpdateDocentes,
    bulkDeleteDocentes,
    addDocumento,
    updateDocumento,
    deleteDocumento,
    bulkUpdateDocumentos,
    bulkDeleteDocumentos,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    addKnowledge,
    updateKnowledge,
    deleteKnowledge,
  };

  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>;
}

export function useDataStore(): DataStore {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error('useDataStore must be used within DataStoreProvider');
  return ctx;
}
