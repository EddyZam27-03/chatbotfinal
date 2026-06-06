// Configuración de la API del backend
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
export const API_PREFIX = '/api/v1';

export const API_URL = `${API_BASE_URL}${API_PREFIX}`;

// Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/auth/login`,
  LOGOUT: `${API_URL}/auth/logout`,
  ME: `${API_URL}/auth/me`,
  
  // Noticias
  NOTICIAS: `${API_URL}/noticias`,
  NOTICIA_BY_ID: (id: string) => `${API_URL}/noticias/${id}`,
  ADMIN_NOTICIAS: `${API_URL}/admin/noticias`,
  ADMIN_NOTICIA_BY_ID: (id: string) => `${API_URL}/admin/noticias/${id}`,
  ADMIN_NOTICIAS_BULK: `${API_URL}/admin/noticias/bulk`,
  
  // Docentes
  DOCENTES: `${API_URL}/docentes`,
  DOCENTE_BY_ID: (id: string) => `${API_URL}/docentes/${id}`,
  ADMIN_DOCENTES: `${API_URL}/admin/docentes`,
  ADMIN_DOCENTE_BY_ID: (id: string) => `${API_URL}/admin/docentes/${id}`,
  ADMIN_DOCENTES_BULK: `${API_URL}/admin/docentes/bulk`,
  
  // FAQ
  FAQ: `${API_URL}/faq`,
  ADMIN_FAQ: `${API_URL}/admin/faq`,
  ADMIN_FAQ_BY_ID: (id: string) => `${API_URL}/admin/faq/${id}`,
  ADMIN_FAQ_BULK: `${API_URL}/admin/faq/bulk`,
  
  // Documentos
  DOCUMENTOS: `${API_URL}/documentos`,
  DOCUMENTO_BY_ID: (id: string) => `${API_URL}/documentos/${id}`,
  ADMIN_DOCUMENTOS: `${API_URL}/admin/documentos`,
  ADMIN_DOCUMENTO_BY_ID: (id: string) => `${API_URL}/admin/documentos/${id}`,
  ADMIN_DOCUMENTOS_BULK: `${API_URL}/admin/documentos/bulk`,
  
  // Chatbot
  CHATBOT_QUERY: `${API_URL}/chatbot/query`,
  ADMIN_CHATBOT: `${API_URL}/admin/chatbot`,
  ADMIN_CHATBOT_BY_ID: (id: string) => `${API_URL}/admin/chatbot/${id}`,
  ADMIN_CHATBOT_BULK: `${API_URL}/admin/chatbot/bulk`,
  
  // Sistema
  HEALTH: `${API_URL}/health`,
  CATEGORIAS: `${API_URL}/categorias`,
} as const;

// Helper para hacer fetch con manejo de errores
export async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
    throw new Error(error.error?.message || error.message || 'Error en la petición');
  }

  return response.json();
}

// Helper para hacer fetch con token de autenticación
export async function fetchAPIWithAuth<T>(
  url: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  return fetchAPI<T>(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
