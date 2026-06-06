import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme-provider';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/docentes', label: 'Docentes' },
    { path: '/noticias', label: 'Noticias' },
    { path: '/chatbot', label: 'Asistente' },
    { path: '/faq', label: 'Preguntas' },
    { path: '/contact', label: 'Contacto' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'shadow-[var(--uleam-shadow-1)]'
          : 'backdrop-blur-sm'
      }`}
      style={{ 
        height: '72px',
        backgroundColor: theme === 'dark' ? 'var(--uleam-surface)' : isScrolled ? 'white' : 'rgba(255, 255, 255, 0.95)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-colors"
              style={{ backgroundColor: 'var(--uleam-primary)' }}
            >
              <span className="font-bold text-xl">U</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg" style={{ color: 'var(--uleam-primary)' }}>
                ULEAM
              </div>
              <div className="text-xs" style={{ color: 'var(--uleam-text-muted)' }}>
                Extensión El Carmen
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full transition-all relative ${
                    isActive
                      ? 'font-semibold'
                      : 'hover:bg-[var(--uleam-surface-2)]'
                  }`}
                  style={{
                    color: isActive ? 'var(--uleam-primary)' : 'var(--uleam-text)',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--uleam-primary)' }}
                    />
                  )}
                </Link>
              );
            })}
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-full transition-all hover:bg-[var(--uleam-surface-2)]"
              style={{ color: 'var(--uleam-text)' }}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--uleam-surface-2)] transition-colors"
              style={{ color: 'var(--uleam-text)' }}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-[var(--uleam-surface-2)] transition-colors"
              style={{ color: 'var(--uleam-text)' }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t" style={{ 
          borderColor: 'var(--uleam-border)',
          backgroundColor: 'var(--uleam-surface)',
        }}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'font-semibold'
                      : ''
                  }`}
                  style={{
                    color: isActive ? 'var(--uleam-primary)' : 'var(--uleam-text)',
                    backgroundColor: isActive ? 'var(--uleam-surface-2)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}