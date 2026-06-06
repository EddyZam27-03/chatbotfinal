import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, User, AlertCircle } from 'lucide-react';
import { fetchAPI, ENDPOINTS } from '../../config/api';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetchAPI<{ success: boolean; data: { token: string; user: any } }>(ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('uleam-admin-auth', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--uleam-surface-2)' }}>
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"
            style={{ backgroundColor: 'var(--uleam-primary)' }}
          >
            <Lock size={40} />
          </div>
          <h1 className="mb-2" style={{ color: 'var(--uleam-text)' }}>
            Panel Administrativo
          </h1>
          <p style={{ color: 'var(--uleam-text-muted)' }}>
            ULEAM - Extensión El Carmen
          </p>
        </div>

        {/* Login Form */}
        <div
          className="rounded-2xl p-8 shadow-[var(--uleam-shadow-1)] border"
          style={{
            backgroundColor: 'var(--uleam-surface)',
            borderColor: 'var(--uleam-border)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="flex items-center space-x-2 p-3 rounded-lg"
                style={{
                  backgroundColor: 'rgba(224, 1, 0, 0.1)',
                  color: 'var(--uleam-danger)',
                }}
              >
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block mb-2 text-sm" style={{ color: 'var(--uleam-text)' }}>
                Usuario
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: 'var(--uleam-text-muted)' }}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as React.CSSProperties}
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm" style={{ color: 'var(--uleam-text)' }}>
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: 'var(--uleam-text-muted)' }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: 'var(--uleam-border)',
                    backgroundColor: 'var(--uleam-surface)',
                    color: 'var(--uleam-text)',
                    '--tw-ring-color': 'var(--uleam-focus-ring)',
                  } as React.CSSProperties}
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:shadow-md"
              style={{
                backgroundColor: 'var(--uleam-primary)',
                color: 'var(--uleam-text-inverse)',
              }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
              Demo: usuario: <strong>admin</strong> / contraseña: <strong>admin123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
