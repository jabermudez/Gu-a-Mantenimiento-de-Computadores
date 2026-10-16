import React, { useRef, useState } from 'react';
import { SectionId } from '../types/maintenance';
import { soundFx } from '../utils/audio';
import { 
  ShieldAlert, Cpu, Wrench, Thermometer, Wind, Zap, 
  AlertTriangle, CheckSquare, Play, Sparkles, Layers, BookOpen, Activity,
  ChevronLeft, ChevronRight, Grid, List, BookMarked
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (sectionId: SectionId) => void;
  activeSection: SectionId;
}

interface ModuleItem {
  id: SectionId;
  label: string;
  category: 'fundamentos' | 'taller' | 'simuladores' | 'diagnostico';
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const MODULES: ModuleItem[] = [
  { id: 'introduccion', label: '1. Fundamentos & Tipos', category: 'fundamentos', icon: BookOpen, accentColor: 'text-cyan-500' },
  { id: 'glosario', label: 'Glosario Técnico (16)', category: 'fundamentos', icon: BookMarked, accentColor: 'text-cyan-400' },
  { id: 'taller', label: '2. Taller 7 Pasos', category: 'taller', icon: Play, accentColor: 'text-violet-500' },
  { id: 'motherboard', label: '3. Placa Madre ATX', category: 'fundamentos', icon: Cpu, accentColor: 'text-indigo-500' },
  { id: 'seguridad', label: '4. Seguridad ESD', category: 'fundamentos', icon: ShieldAlert, accentColor: 'text-amber-500' },
  { id: 'herramientas', label: '5. Arsenal & Insumos', category: 'fundamentos', icon: Wrench, accentColor: 'text-blue-500' },
  { id: 'protocolo-hardware', label: '6. Protocolo Físico', category: 'taller', icon: Wrench, accentColor: 'text-emerald-500' },
  { id: 'simulador-termico', label: '7. Pasta Térmica', category: 'simuladores', icon: Thermometer, accentColor: 'text-rose-500' },
  { id: 'simulador-flujo', label: '8. Flujo de Aire', category: 'simuladores', icon: Wind, accentColor: 'text-sky-500' },
  { id: 'sonda-psu', label: '9. Sonda PSU 24P', category: 'simuladores', icon: Zap, accentColor: 'text-amber-500' },
  { id: 'thermal-pads', label: '10. Thermal Pads', category: 'simuladores', icon: Layers, accentColor: 'text-emerald-500' },
  { id: 'protocolo-software', label: '11. Mantenimiento CLI', category: 'taller', icon: Activity, accentColor: 'text-cyan-500' },
  { id: 'procedimientos', label: '12. Animaciones Técnicas', category: 'diagnostico', icon: Activity, accentColor: 'text-purple-500' },
  { id: 'diagnostico', label: '13. Árbol de Fallas', category: 'diagnostico', icon: AlertTriangle, accentColor: 'text-amber-500' },
  { id: 'checklist', label: '14. Auditoría & Acta', category: 'diagnostico', icon: CheckSquare, accentColor: 'text-emerald-500' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, activeSection }) => {
  const ribbonRef = useRef<HTMLDivElement>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'fundamentos' | 'taller' | 'simuladores' | 'diagnostico'>('all');
  const [viewMode, setViewMode] = useState<'ribbon' | 'grid'>('ribbon');

  const scrollRibbon = (direction: 'left' | 'right') => {
    soundFx.click();
    if (ribbonRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      ribbonRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredModules = filterCategory === 'all' 
    ? MODULES 
    : MODULES.filter(m => m.category === filterCategory);

  return (
    <section className="relative pt-8 sm:pt-12 pb-10 px-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-cyan-50/60 via-slate-50/40 to-slate-100/60 dark:from-slate-950 dark:via-[#070d1e] dark:to-slate-950 no-print overflow-hidden transition-colors duration-200">
      {/* Dynamic ambient cyber glow backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[300px] bg-violet-600/5 dark:bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300 mb-4 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>PLATAFORMA TÉCNICA Y OPERATIVA · ANSI/ESD S20.20</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] text-balance">
              Guía de Mantenimiento de Equipos de Cómputo
            </h1>
            
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              De la preparación técnica, seguridad electrostática y tipos de mantenimiento hasta la ejecución sistemática en banco de trabajo, termodinámica y emisión de certificados técnicos.
            </p>

            {/* Launchpad CTA Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  soundFx.click();
                  onNavigate('introduccion');
                }}
                className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>1. Fundamentos & Tipos</span>
              </button>

              <button
                onClick={() => {
                  soundFx.click();
                  onNavigate('taller');
                }}
                className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-violet-600/10 hover:bg-violet-600/20 text-violet-700 dark:text-violet-300 border border-violet-500/40 font-black text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-xs"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>2. Taller 7 Pasos</span>
              </button>

              <button
                onClick={() => {
                  soundFx.click();
                  onNavigate('motherboard');
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
              >
                <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Placa Madre</span>
              </button>

              <button
                onClick={() => {
                  soundFx.click();
                  onNavigate('checklist');
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
              >
                <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Auditoría & Acta</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 shrink-0">
            <div className="p-4 rounded-2xl tech-card border border-emerald-500/30 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">Auditoría de Calidad</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">20 Puntos de Inspección</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl tech-card border border-cyan-500/30 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">Eficiencia Térmica</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Reducción de 12°C a 20°C</div>
              </div>
            </div>
          </div>
        </div>

        {/* ORGANIZED NAVIGATION HUB (Solves overflowing menu issue) */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          
          {/* Controls Bar: Category Filters & View Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500 shrink-0" />
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                MÓDULOS DE LA GUÍA ({MODULES.length})
              </span>
            </div>

            {/* Filters & View switcher */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => { soundFx.click(); setFilterCategory('all'); }}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filterCategory === 'all'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => { soundFx.click(); setFilterCategory('fundamentos'); }}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filterCategory === 'fundamentos'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Fundamentos
                </button>
                <button
                  onClick={() => { soundFx.click(); setFilterCategory('taller'); }}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filterCategory === 'taller'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Taller
                </button>
                <button
                  onClick={() => { soundFx.click(); setFilterCategory('simuladores'); }}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filterCategory === 'simuladores'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Simuladores
                </button>
                <button
                  onClick={() => { soundFx.click(); setFilterCategory('diagnostico'); }}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filterCategory === 'diagnostico'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Diagnóstico
                </button>
              </div>

              {/* View mode toggle: Ribbon vs Grid */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => { soundFx.click(); setViewMode('ribbon'); }}
                  title="Vista en cinta deslizable con botones de navegación"
                  className={`p-1 rounded-lg transition-colors ${
                    viewMode === 'ribbon'
                      ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { soundFx.click(); setViewMode('grid'); }}
                  title="Vista en cuadrícula completa organizada"
                  className={`p-1 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>

              {/* Scroll buttons for ribbon mode */}
              {viewMode === 'ribbon' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scrollRibbon('left')}
                    aria-label="Desplazar a la izquierda"
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRibbon('right')}
                    aria-label="Desplazar a la derecha"
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Module Presentation: Ribbon or Grid */}
          {viewMode === 'ribbon' ? (
            <div 
              ref={ribbonRef}
              className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scroll-smooth scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
            >
              {filteredModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { soundFx.click(); onNavigate(item.id); }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 border ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md ring-2 ring-cyan-500/30'
                        : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : item.accentColor}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Full Grid View: Displays all modules neatly without ANY horizontal cutoff */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 pt-1 animate-in fade-in duration-200">
              {filteredModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { soundFx.click(); onNavigate(item.id); }}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      isActive
                        ? 'bg-cyan-50 dark:bg-cyan-950/70 border-cyan-500 text-cyan-950 dark:text-cyan-300 font-bold ring-1 ring-cyan-500/40 shadow-xs'
                        : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : item.accentColor}`} />
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{item.category}</span>
                    </div>
                    <div className="text-xs font-bold truncate">
                      {item.label}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
