import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ENDPOINTS } from '../config/api';

// ===================================
// TYPES
// ===================================

export interface Noticia {
  id: string;
  titulo: string;
  descripcion: string;
  imagen_url: string | null;
  categoria: string;
  fecha: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Docente {
  id: string;
  nombre: string;
  email: string | null;
  foto_url: string | null;
  materias: string;
  especialidad: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Documento {
  id: string;
  titulo: string;
  descripcion: string | null;
  categoria: string;
  archivo_url: string;
  archivo_nombre: string;
  archivo_size: number;
  archivo_tipo: string;
  activo: boolean;
  fecha_subida: string;
  updated_at: string;
}

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
  loading: boolean;

  // Noticias CRUD
  addNoticia: (noticia: Omit<Noticia, 'id' | 'created_at' | 'updated_at'>) => Noticia;
  updateNoticia: (id: string, data: Partial<Noticia>) => void;
  deleteNoticia: (id: string) => void;
  bulkUpdateNoticias: (ids: string[], data: Partial<Noticia>) => void;
  bulkDeleteNoticias: (ids: string[]) => void;

  // Docentes CRUD
  addDocente: (docente: Omit<Docente, 'id' | 'created_at' | 'updated_at'>) => Docente;
  updateDocente: (id: string, data: Partial<Docente>) => void;
  deleteDocente: (id: string) => void;
  bulkUpdateDocentes: (ids: string[], data: Partial<Docente>) => void;
  bulkDeleteDocentes: (ids: string[]) => void;

  // Documentos CRUD
  addDocumento: (doc: Omit<Documento, 'id' | 'fecha_subida' | 'updated_at'>) => Documento;
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
// CONTEXT
// ===================================
const DataStoreContext = createContext<DataStore | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [chatbotKnowledge, setChatbotKnowledge] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const [noticiasRes, docentesRes, documentosRes, faqsRes] =
          await Promise.allSettled([
            fetch(`${ENDPOINTS.NOTICIAS}?limit=100`).then(r => r.json()),
            fetch(`${ENDPOINTS.DOCENTES}?limit=100`).then(r => r.json()),
            fetch(`${ENDPOINTS.DOCUMENTOS}?limit=100`).then(r => r.json()),
            fetch(`${ENDPOINTS.FAQ}?limit=100`).then(r => r.json()),
          ]);

        if (noticiasRes.status === 'fulfilled' && noticiasRes.value?.success) {
          setNoticias(noticiasRes.value.data?.items || []);
        }
        if (docentesRes.status === 'fulfilled' && docentesRes.value?.success) {
          setDocentes(docentesRes.value.data?.items || []);
        }
        if (documentosRes.status === 'fulfilled' && documentosRes.value?.success) {
          setDocumentos(documentosRes.value.data?.items || []);
        }
        if (faqsRes.status === 'fulfilled' && faqsRes.value?.success) {
          setFaqs(faqsRes.value.data?.items || []);
        }
      } catch (e) {
        console.error('Error cargando datos desde la API:', e);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // ---- Noticias ----
  const addNoticia = (data: Omit<Noticia, 'id' | 'created_at' | 'updated_at'>): Noticia => {
    const now = new Date().toISOString().split('T')[0];
    const newNoticia: Noticia = { ...data, id: Date.now().toString(), created_at: now, updated_at: now };
    setNoticias((prev) => [newNoticia, ...prev]);
    return newNoticia;
  };

  const updateNoticia = (id: string, data: Partial<Noticia>) => {
    const now = new Date().toISOString().split('T')[0];
    setNoticias((prev) => prev.map((n) => (n.id === id ? { ...n, ...data, updated_at: now } : n)));
  };

  const deleteNoticia = (id: string) => {
    setNoticias((prev) => prev.filter((n) => n.id !== id));
  };

  const bulkUpdateNoticias = (ids: string[], data: Partial<Noticia>) => {
    const now = new Date().toISOString().split('T')[0];
    setNoticias((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, ...data, updated_at: now } : n)));
  };

  const bulkDeleteNoticias = (ids: string[]) => {
    setNoticias((prev) => prev.filter((n) => !ids.includes(n.id)));
  };

  // ---- Docentes ----
  const addDocente = (data: Omit<Docente, 'id' | 'created_at' | 'updated_at'>): Docente => {
    const now = new Date().toISOString().split('T')[0];
    const newDocente: Docente = { ...data, id: Date.now().toString(), created_at: now, updated_at: now };
    setDocentes((prev) => [newDocente, ...prev]);
    return newDocente;
  };

  const updateDocente = (id: string, data: Partial<Docente>) => {
    const now = new Date().toISOString().split('T')[0];
    setDocentes((prev) => prev.map((d) => (d.id === id ? { ...d, ...data, updated_at: now } : d)));
  };

  const deleteDocente = (id: string) => {
    setDocentes((prev) => prev.filter((d) => d.id !== id));
  };

  const bulkUpdateDocentes = (ids: string[], data: Partial<Docente>) => {
    const now = new Date().toISOString().split('T')[0];
    setDocentes((prev) => prev.map((d) => (ids.includes(d.id) ? { ...d, ...data, updated_at: now } : d)));
  };

  const bulkDeleteDocentes = (ids: string[]) => {
    setDocentes((prev) => prev.filter((d) => !ids.includes(d.id)));
  };

  // ---- Documentos ----
  const addDocumento = (data: Omit<Documento, 'id' | 'fecha_subida' | 'updated_at'>): Documento => {
    const now = new Date().toISOString().split('T')[0];
    const newDoc: Documento = { ...data, id: Date.now().toString(), fecha_subida: now, updated_at: now };
    setDocumentos((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const updateDocumento = (id: string, data: Partial<Documento>) => {
    const now = new Date().toISOString().split('T')[0];
    setDocumentos((prev) => prev.map((d) => (d.id === id ? { ...d, ...data, updated_at: now } : d)));
  };

  const deleteDocumento = (id: string) => {
    setDocumentos((prev) => prev.filter((d) => d.id !== id));
  };

  const bulkUpdateDocumentos = (ids: string[], data: Partial<Documento>) => {
    const now = new Date().toISOString().split('T')[0];
    setDocumentos((prev) => prev.map((d) => (ids.includes(d.id) ? { ...d, ...data, updated_at: now } : d)));
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
    loading,
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
