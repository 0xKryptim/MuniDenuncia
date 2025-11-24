import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  AlertCircle,
  User,
  Settings,
  X,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { label: 'Inicio', path: '/', icon: <Home className="w-5 h-5" /> },
  {
    label: 'Nuevo Reporte',
    path: '/report',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: 'Mis Solicitudes',
    path: '/requests',
    icon: <AlertCircle className="w-5 h-5" />,
  },
  { label: 'Cuenta', path: '/account', icon: <User className="w-5 h-5" /> },
  {
    label: 'Configuración',
    path: '/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-16 left-4 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-700 dark:text-slate-300"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out z-30 lg:translate-x-0 overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Navigation Links */}
        <nav className="px-3 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}>
              <button
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200',
                  isActive(link.path)
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {link.icon}
                <span className="text-sm">{link.label}</span>
              </button>
            </Link>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Version 1.0.0
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
