const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

export function buildImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE}/${cleanPath}`;
}
