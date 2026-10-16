import React, { useState, useEffect, useRef } from 'react';
import { SectionId } from '../types/maintenance';
import { 
  FileText, Cpu, Play, BookOpen, Sun, Moon, Menu, X, 
  ChevronDown, ShieldCheck, Wrench, Activity, AlertTriangle, 
  Thermometer, Wind, Zap, Layers, CheckSquare, BookMarked
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeSection: SectionId;
  onNavigate: (sectionId: SectionId) => void;
}

interface NavCategory {
  title: string;
  items: {
    id: SectionId;
    label: string;
    shortLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    tag?: string;
  }[];
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    title: '1. Fundamentos & Preparación',
    items: [
      { id: 'introduccion', label: '1. Concepto y Tipos de Mantenimiento', shortLabel: 'Fundamentos', icon: BookOpen },
      { id: 'glosario', label: 'Glosario Técnico Desplegable (16)', shortLabel: 'Glosario', icon: BookMarked, tag: 'NUEVO' },
      { id: 'motherboard', label: '3. Esquema Placa Madre ATX', shortLabel: 'Placa Madre', icon: Cpu },
      { id: 'seguridad', label: '4. Seguridad Eléctrica y ESD', shortLabel: 'Seguridad ESD', icon: ShieldCheck },
      { id: 'herramientas', label: '5. Arsenal de Herramientas', shortLabel: 'Herramientas', icon: Wrench },
    ]
  },
  {
    title: '2. Taller & Protocolos Físicos',
    items: [
      { id: 'taller', label: '2. Taller Interactivo 7 Pasos', shortLabel: 'Taller Pro', icon: Play, tag: 'SIMULADOR' },
      { id: 'protocolo-hardware', label: '6. Protocolo de Hardware Físico', shortLabel: 'Protocolo Físico', icon: Wrench },
      { id: 'protocolo-software', label: '11. Mantenimiento Lógico y CLI', shortLabel: 'Software & CLI', icon: Activity },
    ]
  },
  {
    title: '3. Simuladores de Laboratorio',
    items: [
      { id: 'simulador-termico', label: '7. Simulador de Pasta Térmica', shortLabel: 'Pasta Térmica', icon: Thermometer },
      { id: 'simulador-flujo', label: '8. Flujo de Aire en Chasis', shortLabel: 'Flujo de Aire', icon: Wind },
      { id: 'sonda-psu', label: '9. Sonda ATX 24-Pin PSU', shortLabel: 'Sonda PSU', icon: Zap },
      { id: 'thermal-pads', label: '10. Thermal Pads y Rodamientos', shortLabel: 'Thermal Pads', icon: Layers },
    ]
  },
  {
    title: '4. Diagnóstico & Certificación',
    items: [
      { id: 'procedimientos', label: '12. Procedimientos Animados', shortLabel: 'Animaciones', icon: Activity },
      { id: 'diagnostico', label: '13. Árbol de Fallas y Diagnóstico', shortLabel: 'Diagnóstico', icon: AlertTriangle },
      { id: 'checklist', label: '14. Auditoría 20 Puntos y Certificado', shortLabel: 'Auditoría & Acta', icon: CheckSquare, tag: 'INFORME' },
    ]
  }
];

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const { toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (sectionId: SectionId) => {
    soundFx.click();
    onNavigate(sectionId);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  // Find active label for dropdown button
  const getActiveLabel = () => {
    for (const cat of NAV_CATEGORIES) {
      const found = cat.items.find(i => i.id === activeSection);
      if (found) return found.shortLabel;
    }
    return 'Explorar Módulos';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#060b18]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-cyan-500/20 px-3 sm:px-6 py-2.5 sm:py-3 no-print shadow-xs dark:shadow-lg dark:shadow-cyan-950/20 transition-colors duration-200 w-full overflow-x-clip">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
        
        {/* Zone 1: Logo & Brand */}
        <a 
          href="#inicio" 
          onClick={(e) => { 
            e.preventDefault(); 
            handleNavClick('introduccion'); 
          }}
          className="flex items-center gap-2 sm:gap-2.5 text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white shrink-0 group min-w-0"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:border-cyan-500 transition-all shadow-xs group-hover:shadow-cyan-500/30 shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-600 dark:from-white dark:via-slate-100 dark:to-cyan-300 bg-clip-text text-transparent font-black tracking-tight block sm:inline">
              TécnicaPC
            </span>
            <span className="hidden sm:inline text-slate-400 dark:text-slate-500 font-light mx-1.5">|</span>
            <span className="hidden md:inline text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
              Guía Maestra
            </span>
          </div>
        </a>

        {/* Zone 2: Desktop Navigation Bar (Screens >= 1200px) */}
        <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-3 text-xs 2xl:text-sm font-semibold text-slate-600 dark:text-slate-300 shrink">
          <button
            onClick={() => handleNavClick('introduccion')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap hover:text-cyan-600 dark:hover:text-cyan-400 ${
              activeSection === 'introduccion' 
                ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 font-bold' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Fundamentos</span>
          </button>

          <button
            onClick={() => handleNavClick('taller')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap hover:text-cyan-600 dark:hover:text-cyan-400 ${
              activeSection === 'taller' 
                ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 font-bold' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Taller Pro</span>
          </button>
          
          <button
            onClick={() => handleNavClick('motherboard')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap hover:text-cyan-600 dark:hover:text-cyan-400 ${
              activeSection === 'motherboard' 
                ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 font-bold' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Placa Madre</span>
          </button>

          <button
            onClick={() => handleNavClick('seguridad')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap hover:text-cyan-600 dark:hover:text-cyan-400 ${
              activeSection === 'seguridad' || activeSection === 'herramientas' 
                ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 font-bold' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Seguridad</span>
          </button>

          <button
            onClick={() => handleNavClick('simulador-termico')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap hover:text-cyan-600 dark:hover:text-cyan-400 ${
              activeSection === 'simulador-termico' || activeSection === 'simulador-flujo' || activeSection === 'sonda-psu' || activeSection === 'thermal-pads'
                ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 font-bold' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Simuladores</span>
          </button>

          <button
            onClick={() => handleNavClick('procedimientos')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap hover:text-cyan-600 dark:hover:text-cyan-400 ${
              activeSection === 'procedimientos' 
                ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 font-bold' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Animaciones</span>
          </button>

          <button
            onClick={() => handleNavClick('diagnostico')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap hover:text-cyan-600 dark:hover:text-cyan-400 ${
              activeSection === 'diagnostico' 
                ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 font-bold' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Diagnóstico</span>
          </button>
        </nav>

        {/* Medium Screen Dropdown Menu (Laptops / Tablets 768px - 1199px) */}
        <div className="hidden md:flex xl:hidden items-center gap-2 relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 transition-all shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="max-w-[130px] truncate">{getActiveLabel()}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick shortcuts for intermediate view */}
          <button
            onClick={() => handleNavClick('taller')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-transparent hover:border-cyan-300 dark:hover:border-cyan-800 transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Taller</span>
          </button>

          <button
            onClick={() => handleNavClick('simulador-termico')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Thermometer className="w-3 h-3 text-rose-500" />
            <span>Térmico</span>
          </button>

          {/* Dropdown Floating Panel */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-3 max-h-[75vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
              {NAV_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-2 pt-1">
                    {cat.title}
                  </div>
                  {cat.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                          isActive
                            ? 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-200 dark:border-cyan-800'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.tag && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 shrink-0">
                            {item.tag}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zone 3: Global Actions (Theme, Auditoría CTA, Mobile Hamburger) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Global Light/Dark Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}
            className="p-2 sm:p-2 rounded-xl border transition-all flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-cyan-300 dark:border-slate-800 shadow-xs hover:scale-105 active:scale-95"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Primary Action Button (Auditoría & Reporte) */}
          <button
            onClick={() => handleNavClick('checklist')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-xl transition-all shadow-md shadow-cyan-400/20 shrink-0 hover:scale-[1.02] active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auditoría 20 Pts</span>
            <span className="sm:hidden">Reporte</span>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
            className="xl:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 transition-colors shadow-xs"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-rose-500" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE / TABLET SLIDE-DOWN DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[57px] sm:top-[61px] bottom-0 bg-slate-950/80 backdrop-blur-md z-40 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto p-4 sm:p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Catálogo de Módulos Técnicos (14)
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Cerrar [×]
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NAV_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/60 pb-1">
                    {cat.title}
                  </div>
                  <div className="space-y-1">
                    {cat.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                            isActive
                              ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-bold border border-cyan-300 dark:border-cyan-800 shadow-xs'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.tag && (
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 shrink-0">
                              {item.tag}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Footer Drawer Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                <span>{isDark ? 'Tema Claro' : 'Tema Oscuro'}</span>
              </button>

              <button
                onClick={() => handleNavClick('checklist')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md shadow-cyan-400/20"
              >
                <FileText className="w-4 h-4" />
                <span>Auditoría & Certificado</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
