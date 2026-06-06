import { ENDPOINTS, fetchAPI } from '../config/api';

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
  created_by: string | null;
}

export interface DocenteCreate {
  nombre: string;
  email: string | null;
  materias: string;
  especialidad: string | null;
  activo: boolean;
}

export interface DocenteUpdate {
  nombre?: string;
  email?: string | null;
  materias?: string;
  especialidad?: string | null;
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

// Servicio de Docentes
export const docentesService = {
  // Obtener todos los docentes públicos
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: string;
  }): Promise<PaginatedResponse<Docente>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);

    const url = `${ENDPOINTS.DOCENTES}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetchAPI<ApiResponse<PaginatedResponse<Docente>>>(url);
    return response.data;
  },

  // Obtener un docente por ID
  async getById(id: string): Promise<Docente> {
    const response = await fetchAPI<ApiResponse<Docente>>(ENDPOINTS.DOCENTE_BY_ID(id));
    return response.data;
  },

  // Crear docente (requiere autenticación)
  async create(data: DocenteCreate, token: string, foto?: File): Promise<Docente> {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    if (data.email) formData.append('email', data.email);
    formData.append('materias', data.materias);
    if (data.especialidad) formData.append('especialidad', data.especialidad);
    formData.append('activo', data.activo.toString());
    if (foto) formData.append('foto', foto);

    const response = await fetch(ENDPOINTS.ADMIN_DOCENTES, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al crear docente');
    }

    const result = await response.json();
    return result.data;
  },

  // Actualizar docente (requiere autenticación)
  async update(id: string, data: DocenteUpdate, token: string, foto?: File): Promise<Docente> {
    const formData = new FormData();
    if (data.nombre !== undefined) formData.append('nombre', data.nombre);
    if (data.email !== undefined) formData.append('email', data.email || '');
    if (data.materias !== undefined) formData.append('materias', data.materias);
    if (data.especialidad !== undefined) formData.append('especialidad', data.especialidad || '');
    if (data.activo !== undefined) formData.append('activo', data.activo.toString());
    if (foto) formData.append('foto', foto);

    const response = await fetch(ENDPOINTS.ADMIN_DOCENTE_BY_ID(id), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al actualizar docente');
    }

    const result = await response.json();
    return result.data;
  },

  // Eliminar docente (requiere autenticación)
  async delete(id: string, token: string): Promise<void> {
    const response = await fetch(ENDPOINTS.ADMIN_DOCENTE_BY_ID(id), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al eliminar docente');
    }
  },

  // Eliminar múltiples docentes (requiere autenticación)
  async bulkDelete(ids: string[], token: string): Promise<void> {
    const response = await fetch(ENDPOINTS.ADMIN_DOCENTES_BULK, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || 'Error al eliminar docentes');
    }
  },
};
