import { ENDPOINTS, fetchAPI } from '../config/api';

export interface FAQItem {
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: string;
  orden: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQCreate {
  pregunta: string;
  respuesta: string;
  categoria: string;
  orden: number;
  activo: boolean;
}

export interface FAQUpdate {
  pregunta?: string;
  respuesta?: string;
  categoria?: string;
  orden?: number;
  activo?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Servicio de FAQ
export const faqService = {
  // Obtener todas las FAQs públicas
  async getAll(params?: {
    categoria?: string;
    search?: string;
  }): Promise<FAQItem[]> {
    const queryParams = new URLSearchParams();
    if (params?.categoria) queryParams.append('categoria', params.categoria);
    if (params?.search) queryParams.append('search', params.search);

    const url = `${ENDPOINTS.FAQ}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetchAPI<ApiResponse<FAQItem[]>>(url);
    return response.data;
  },

  // Crear FAQ (requiere autenticación)
  async create(data: FAQCreate, token: string): Promise<FAQItem> {
    const response = await fetch(ENDPOINTS.ADMIN_FAQ, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al crear FAQ');
    }

    const result = await response.json();
    return result.data;
  },

  // Actualizar FAQ (requiere autenticación)
  async update(id: string, data: FAQUpdate, token: string): Promise<FAQItem> {
    const response = await fetch(ENDPOINTS.ADMIN_FAQ_BY_ID(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al actualizar FAQ');
    }

    const result = await response.json();
    return result.data;
  },

  // Eliminar FAQ (requiere autenticación)
  async delete(id: string, token: string): Promise<void> {
    const response = await fetch(ENDPOINTS.ADMIN_FAQ_BY_ID(id), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al eliminar FAQ');
    }
  },

  // Eliminar múltiples FAQs (requiere autenticación)
  async bulkDelete(ids: string[], token: string): Promise<void> {
    const response = await fetch(ENDPOINTS.ADMIN_FAQ_BULK, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al eliminar FAQs');
    }
  },
};
