import { ENDPOINTS, fetchAPI } from '../config/api';

export interface KnowledgeItem {
  id: string;
  keywords: string[];
  respuesta: string;
  categoria: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeCreate {
  keywords: string[];
  respuesta: string;
  categoria: string;
  activo: boolean;
}

export interface KnowledgeUpdate {
  keywords?: string[];
  respuesta?: string;
  categoria?: string;
  activo?: boolean;
}

export interface ChatbotQueryResponse {
  respuesta: string;
  fuente: string;
  confianza: number;
  categoria: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Servicio de Chatbot
export const chatbotService = {
  // Consultar al chatbot
  async query(
    query: string,
    history: { role: string; content: string }[] = []
  ): Promise<ChatbotQueryResponse> {
    const response = await fetch(ENDPOINTS.CHATBOT_QUERY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, history }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al consultar chatbot');
    }

    const result = await response.json();
    return result.data;
  },

  // Obtener knowledge base (requiere autenticación)
  async getAll(token: string, params?: {
    page?: number;
    limit?: number;
    activo?: boolean;
    categoria?: string;
    search?: string;
  }): Promise<{ items: KnowledgeItem[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.activo !== undefined) queryParams.append('activo', params.activo.toString());
    if (params?.categoria) queryParams.append('categoria', params.categoria);
    if (params?.search) queryParams.append('search', params.search);

    const url = `${ENDPOINTS.ADMIN_CHATBOT}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al obtener knowledge base');
    }

    const result = await response.json();
    return result.data;
  },

  // Crear entrada de knowledge (requiere autenticación)
  async create(data: KnowledgeCreate, token: string): Promise<KnowledgeItem> {
    const response = await fetch(ENDPOINTS.ADMIN_CHATBOT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al crear entrada de chatbot');
    }

    const result = await response.json();
    return result.data;
  },

  // Actualizar entrada de knowledge (requiere autenticación)
  async update(id: string, data: KnowledgeUpdate, token: string): Promise<KnowledgeItem> {
    const response = await fetch(ENDPOINTS.ADMIN_CHATBOT_BY_ID(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al actualizar entrada de chatbot');
    }

    const result = await response.json();
    return result.data;
  },

  // Eliminar entrada de knowledge (requiere autenticación)
  async delete(id: string, token: string): Promise<void> {
    const response = await fetch(ENDPOINTS.ADMIN_CHATBOT_BY_ID(id), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al eliminar entrada de chatbot');
    }
  },

  // Eliminar múltiples entradas (requiere autenticación)
  async bulkDelete(ids: string[], token: string): Promise<void> {
    const response = await fetch(ENDPOINTS.ADMIN_CHATBOT_BULK, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al eliminar entradas de chatbot');
    }
  },
};
