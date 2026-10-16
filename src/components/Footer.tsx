import React from 'react';
import { SectionId } from '../types/maintenance';
import { Cpu, Github } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FooterProps {
  onNavigate: (sectionId: SectionId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#030611] py-12 px-6 text-slate-600 dark:text-slate-400 text-xs no-print transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-600 dark:from-white dark:to-cyan-300 bg-clip-text text-transparent font-extrabold">
              Guía de Mantenimiento de Equipos de Cómputo
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-md leading-relaxed text-xs">
            Plataforma tecnológica interactiva de preparación técnica, seguridad electrostática (ESD), herramientas de laboratorio, termodinámica y auditoría de software. Adaptada para GitHub Pages.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <button 
            onClick={() => { soundFx.click(); onNavigate('introduccion'); }} 
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-slate-600 dark:text-slate-300 font-medium"
          >
            Tipos de Mantenimiento
          </button>
          <button 
            onClick={() => { soundFx.click(); onNavigate('taller'); }} 
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-slate-600 dark:text-slate-300 font-medium"
          >
            Taller Paso a Paso
          </button>
          <button 
            onClick={() => { soundFx.click(); onNavigate('motherboard'); }} 
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-slate-600 dark:text-slate-300 font-medium"
          >
            Placa Madre
          </button>
          <button 
            onClick={() => { soundFx.click(); onNavigate('simulador-termico'); }} 
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-slate-600 dark:text-slate-300 font-medium"
          >
            Simulador Térmico
          </button>
          <button 
            onClick={() => { soundFx.click(); onNavigate('procedimientos'); }} 
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-slate-600 dark:text-slate-300 font-medium"
          >
            Procedimientos Animados
          </button>
          <button 
            onClick={() => { soundFx.click(); onNavigate('checklist'); }} 
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-slate-600 dark:text-slate-300 font-medium"
          >
            Auditoría & Reporte
          </button>
        </div>

        <div className="text-slate-500 font-mono text-[11px] whitespace-nowrap flex items-center gap-2">
          <span>ANSI/ESD S20.20 · ATX 3.0</span>
          <span>·</span>
          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">GitHub Pages Ready</span>
        </div>
      </div>
    </footer>
  );
};
