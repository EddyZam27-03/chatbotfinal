import { ENDPOINTS, fetchAPI, fetchAPIWithAuth } from '../config/api';

export interface Noticia {
  id: string;
  titulo: string;
  imagen_url: string | null;
  descripcion: string;
  categoria: string;
  activo: boolean;
  fecha: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface NoticiaCreate {
  titulo: string;
  descripcion: string;
  categoria: string;
  fecha: string;
  activo: boolean;
}

export interface NoticiaUpdate {
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  fecha?: string;
  activo?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Servicio de Noticias
export const noticiasService = {
  // Obtener todas las noticias públicas
  async getAll(params?: {
    page?: number;
    limit?: number;
    categoria?: string;
    search?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    sort?: string;
    order?: string;
  }): Promise<PaginatedResponse<Noticia>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.categoria) queryParams.append('categoria', params.categoria);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.fecha_desde) queryParams.append('fecha_desde', params.fecha_desde);
    if (params?.fecha_hasta) queryParams.append('fecha_hasta', params.fecha_hasta);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);

    const url = `${ENDPOINTS.NOTICIAS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetchAPI<ApiResponse<PaginatedResponse<Noticia>>>(url);
    return response.data;
  },

  // Obtener una noticia por ID
  async getById(id: string): Promise<Noticia> {
    const response = await fetchAPI<ApiResponse<Noticia>>(ENDPOINTS.NOTICIA_BY_ID(id));
    return response.data;
  },

  // Crear noticia (requiere autenticación)
  async create(data: NoticiaCreate, token: string, imagen?: File): Promise<Noticia> {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('descripcion', data.descripcion);
    formData.append('categoria', data.categoria);
    formData.append('fecha', data.fecha);
    formData.append('activo', data.activo.toString());
    if (imagen) formData.append('imagen', imagen);

    const response = await fetch(ENDPOINTS.ADMIN_NOTICIAS, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al crear noticia');
    }

    const result = await response.json();
    return result.data;
  },

  // Actualizar noticia (requiere autenticación)
  async update(id: string, data: NoticiaUpdate, token: string, imagen?: File): Promise<Noticia> {
    const formData = new FormData();
    if (data.titulo !== undefined) formData.append('titulo', data.titulo);
    if (data.descripcion !== undefined) formData.append('descripcion', data.descripcion);
    if (data.categoria !== undefined) formData.append('categoria', data.categoria);
    if (data.fecha !== undefined) formData.append('fecha', data.fecha);
    if (data.activo !== undefined) formData.append('activo', data.activo.toString());
    if (imagen) formData.append('imagen', imagen);

    const response = await fetch(ENDPOINTS.ADMIN_NOTICIA_BY_ID(id), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al actualizar noticia');
    }

    const result = await response.json();
    return result.data;
  },

  // Eliminar noticia (requiere autenticación)
  async delete(id: string, token: string): Promise<void> {
    const response = await fetch(ENDPOINTS.ADMIN_NOTICIA_BY_ID(id), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al eliminar noticia');
    }
  },

  // Eliminar múltiples noticias (requiere autenticación)
  async bulkDelete(ids: string[], token: string): Promise<void> {
    const response = await fetch(ENDPOINTS.ADMIN_NOTICIAS_BULK, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al eliminar noticias');
    }
  },
};
