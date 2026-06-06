import { ReactNode, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  MessageSquare, 
  HelpCircle, 
  LogOut, 
  Menu, 
  X,
  Moon,
  Sun,
  FileText,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../theme-provider';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('uleam-admin-auth');
    if (!isAuthenticated) {
      navigate('/app-admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('uleam-admin-auth');
    navigate('/app-admin');
  };

  const menuItems = [
    { path: '/app-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app-admin/documents', label: 'Documents', icon: FileText },
    { path: '/app-admin/chatbot', label: 'Chatbot', icon: MessageSquare },
    { path: '/app-admin/faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--uleam-surface-2)' }}>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 border-r transition-transform duration-300`}
        style={{
          backgroundColor: 'var(--uleam-surface)',
          borderColor: 'var(--uleam-border)',
        }}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b" style={{ borderColor: 'var(--uleam-border)' }}>
            <Link to="/" className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: 'var(--uleam-primary)' }}
              >
                <span className="font-bold">U</span>
              </div>
              <div>
                <div className="font-bold text-sm" style={{ color: 'var(--uleam-primary)' }}>
                  ULEAM Admin
                </div>
                <div className="text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                  Panel de Control
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive ? 'shadow-sm' : 'hover:bg-[var(--uleam-surface-2)]'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--uleam-surface-2)' : 'transparent',
                    color: isActive ? 'var(--uleam-primary)' : 'var(--uleam-text)',
                  }}
                >
                  <Icon size={20} />
                  <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--uleam-border)' }}>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all hover:bg-[var(--uleam-surface-2)]"
              style={{ color: 'var(--uleam-text)' }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all hover:bg-red-50"
              style={{ color: 'var(--uleam-danger)' }}
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header
          className="sticky top-0 z-30 border-b px-4 py-4 lg:px-8"
          style={{
            backgroundColor: 'var(--uleam-surface)',
            borderColor: 'var(--uleam-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--uleam-surface-2)]"
              style={{ color: 'var(--uleam-text)' }}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: 'var(--uleam-primary)' }}
              >
                A
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold" style={{ color: 'var(--uleam-text)' }}>
                  Administrador
                </div>
                <div className="text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                  admin@uleam.edu.ec
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}