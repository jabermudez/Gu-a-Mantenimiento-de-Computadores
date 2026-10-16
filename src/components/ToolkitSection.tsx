import React, { useState } from 'react';
import { TOOLS_DATA } from '../data/maintenanceData';
import { Wrench, ShieldAlert, Layers, FlaskConical, Cpu, Wind, Sparkles, Activity, Gauge, Maximize2, Calculator, AlertTriangle, Check } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Wrench: <Wrench className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  FlaskConical: <FlaskConical className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Wind: <Wind className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Gauge: <Gauge className="w-5 h-5" />,
  Maximize2: <Maximize2 className="w-5 h-5" />
};

export const ToolkitSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeToolId, setActiveToolId] = useState<string>(TOOLS_DATA[0].id);

  // Consumables Calculator state
  const [pcCountPerMonth, setPcCountPerMonth] = useState<number>(12);

  const filteredTools = selectedCategory === 'all'
    ? TOOLS_DATA
    : TOOLS_DATA.filter(t => t.category === selectedCategory);

  const activeTool = TOOLS_DATA.find(t => t.id === activeToolId) || TOOLS_DATA[0];

  // Calculations for consumables
  const isopropilicMl = pcCountPerMonth * 18; // ~18ml per full clean
  const thermalPasteGrams = Number((pcCountPerMonth * 0.45).toFixed(1)); // ~0.45g per CPU
  const thermalSyringes = Math.ceil(thermalPasteGrams / 4); // standard 4g syringe
  const microfiberCloths = Math.ceil(pcCountPerMonth / 3);
  const estimatedHours = (pcCountPerMonth * 1.5).toFixed(0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
          <Wrench className="w-4 h-4 text-cyan-500" />
          <span>FASE 02 · EQUIPAMIENTO PROFESIONAL DE LABORATORIO</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Arsenal de Herramientas, Insumos Químicos e Instrumentos
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed max-w-4xl">
          El mantenimiento preventivo de alto estándar no se realiza con destornilladores genéricos ni alcohol doméstico. Conoce los instrumentos con especificación técnica, tolerancias y advertencias operativas críticas.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: `Todo el Arsenal (${TOOLS_DATA.length})` },
          { id: 'precision', label: 'Precisión y Mecánica' },
          { id: 'quimicos', label: 'Químicos e Insumos' },
          { id: 'instrumentos', label: 'Instrumentos de Diagnóstico' },
          { id: 'seguridad', label: 'Protección ESD' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 border ${
              selectedCategory === cat.id
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid: Tool Selector + Active Tool Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Tool Cards List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
          {filteredTools.map((tool) => {
            const isSelected = tool.id === activeTool.id;
            return (
              <div
                key={tool.id}
                onClick={() => setActiveToolId(tool.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-50/70 dark:bg-slate-900 border-cyan-500 text-cyan-950 dark:text-cyan-300 shadow-sm ring-1 ring-cyan-500/30'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    isSelected ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {iconMap[tool.iconName] || <Wrench className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {tool.categoryLabel}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950">
                          ACTIVO
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">
                      {tool.purpose}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Tool Deep Inspector */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm dark:shadow-cyan-950/20">
          <div>
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                  {iconMap[activeTool.iconName] || <Wrench className="w-6 h-6" />}
                </div>
                <div>
                  <div className="text-xs text-cyan-600 dark:text-cyan-400 font-mono font-bold">
                    {activeTool.categoryLabel}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {activeTool.name}
                  </h3>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-5">
              <div>
                <h5 className="text-xs font-bold font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Especificación Técnica Recomendada
                </h5>
                <p className="text-xs sm:text-sm font-mono bg-cyan-50/70 dark:bg-slate-950 p-3.5 rounded-2xl border border-cyan-200 dark:border-slate-800 text-cyan-900 dark:text-cyan-300">
                  {activeTool.specification}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Propósito Operativo
                </h5>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeTool.purpose}
                </p>
              </div>

              {/* Critical Warning Callout */}
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                      Advertencia de Error Crítico
                    </span>
                    <p className="text-xs text-rose-900 dark:text-rose-200 mt-1 leading-relaxed">
                      {activeTool.criticalWarning}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pro Usage Tip */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Consejo del Laboratorio Técnico
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  {activeTool.usageTip}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consumables Budget Calculator */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm dark:shadow-cyan-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Calculadora de Insumos para Taller Técnico
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Calcula automáticamente los insumos químicos y materiales según tu volumen de servicio mensual
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
            <label htmlFor="pc-slider" className="text-xs font-medium text-slate-700 dark:text-slate-400 whitespace-nowrap">
              Equipos / mes:
            </label>
            <input
              id="pc-slider"
              type="range"
              min="1"
              max="60"
              value={pcCountPerMonth}
              onChange={(e) => setPcCountPerMonth(parseInt(e.target.value))}
              className="w-24 accent-cyan-500 cursor-pointer"
            />
            <span className="font-mono font-bold text-sm text-cyan-700 dark:text-cyan-300 tabular-nums w-8 text-right">
              {pcCountPerMonth}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Alcohol Isopropílico (99.8%)</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
              {isopropilicMl} ml
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              ~{(isopropilicMl / 1000).toFixed(2)} Litros
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pasta Térmica (&gt;8.5 W/mK)</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
              {thermalPasteGrams} g
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {thermalSyringes} jeringa(s) de 4 gramos
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Paños Lint-Free</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
              {microfiberCloths} unidades
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              1 paño cada 3 mantenimientos
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tiempo de Taller Estimado</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
              {estimatedHours} horas
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              ~1.5h por intervención completa
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
