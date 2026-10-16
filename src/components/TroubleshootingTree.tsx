import React, { useState } from 'react';
import { TROUBLESHOOTING_CASES } from '../data/maintenanceData';
import { TroubleshootingCase } from '../types/maintenance';
import { AlertTriangle, Search, CheckCircle2, ChevronRight, ShieldCheck, Stethoscope } from 'lucide-react';

export const TroubleshootingTree: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(TROUBLESHOOTING_CASES[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCases = TROUBLESHOOTING_CASES.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = c.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.likelyCauses.some(cause => cause.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.recommendedSolution.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCase: TroubleshootingCase = TROUBLESHOOTING_CASES.find(c => c.id === selectedCaseId) || TROUBLESHOOTING_CASES[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
          <Stethoscope className="w-4 h-4 text-cyan-500" />
          <span>DIAGNÓSTICO CLÍNICO DE HARDWARE · ÁRBOL DE DECISIONES</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Guía de Resolución de Fallas y Problemas Críticos
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed max-w-4xl">
          El técnico profesional no adivina ni reemplaza piezas al azar. Sigue una ruta lógica de aislamiento de componentes basada en síntomas, mediciones eléctricas y códigos de error del sistema.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar síntoma, pitido, BSOD o error..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'energia', label: 'Energía' },
            { id: 'video', label: 'Video / POST' },
            { id: 'temperatura', label: 'Temperatura' },
            { id: 'estabilidad', label: 'BSOD / Estabilidad' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 border ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Cases Sidebar + Case Resolution Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Symptoms list */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
          {filteredCases.map((item) => {
            const isSelected = item.id === activeCase.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedCaseId(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-50/70 dark:bg-slate-900 border-cyan-500 text-cyan-950 dark:text-cyan-300 shadow-sm ring-1 ring-cyan-500/30'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                    item.severity === 'Crítica'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                      : item.severity === 'Alta'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                      : 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-200 dark:border-sky-900'
                  }`}>
                    Severidad {item.severity}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono capitalize">
                    {item.category}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {item.symptom}
                </h4>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Diagnostic Flow */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm dark:shadow-cyan-950/20">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1">
              <Stethoscope className="w-4 h-4" />
              <span>RUTA DIAGNÓSTICA TÉCNICA</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {activeCase.symptom}
            </h3>
          </div>

          {/* Likely Causes */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Causas Más Probables (Orden de Incidencia)
            </h4>
            <div className="space-y-1.5">
              {activeCase.likelyCauses.map((cause, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{cause}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Diagnostic Sequence */}
          <div>
            <h4 className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2.5">
              Secuencia Metódica de Aislamiento
            </h4>
            <div className="space-y-2">
              {activeCase.diagnosticSteps.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Solution */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Solución Técnica Definitiva
                </span>
                <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 mt-1 leading-relaxed">
                  {activeCase.recommendedSolution}
                </p>
              </div>
            </div>
          </div>

          {/* Prevention Tip */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>
              <strong className="text-slate-800 dark:text-slate-200">Consejo de Prevención:</strong> {activeCase.preventionTip}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
