import React, { useState, useEffect } from 'react';
import { SectionId } from './types/maintenance';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IntroductionSection } from './components/IntroductionSection';
import { TechnicalGlossary } from './components/TechnicalGlossary';
import { InteractiveWorkbench } from './components/InteractiveWorkbench';
import { MotherboardExplorer } from './components/MotherboardExplorer';
import { SafetyEsdSection } from './components/SafetyEsdSection';
import { ToolkitSection } from './components/ToolkitSection';
import { HardwareProtocolSection } from './components/HardwareProtocolSection';
import { ThermalSimulator } from './components/ThermalSimulator';
import { AirflowSimulator } from './components/AirflowSimulator';
import { PsuTester } from './components/PsuTester';
import { ThermalPadsAndBearings } from './components/ThermalPadsAndBearings';
import { SoftwareProtocolSection } from './components/SoftwareProtocolSection';
import { TroubleshootingTree } from './components/TroubleshootingTree';
import { InteractiveProceduresCenter } from './components/InteractiveProceduresCenter';
import { ChecklistAndReport } from './components/ChecklistAndReport';
import { Footer } from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('introduccion');

  const handleNavigate = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // account for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Scroll spy to highlight active section in navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections: SectionId[] = [
        'introduccion',
        'glosario',
        'taller',
        'motherboard',
        'seguridad',
        'herramientas',
        'protocolo-hardware',
        'simulador-termico',
        'simulador-flujo',
        'sonda-psu',
        'thermal-pads',
        'protocolo-software',
        'diagnostico',
        'procedimientos',
        'checklist'
      ];

      const scrollPos = window.scrollY + 220;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-slate-50 dark:bg-[#040711] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-600 dark:selection:text-cyan-300 transition-colors duration-300">
      <Header activeSection={activeSection} onNavigate={handleNavigate} />
      
      <main className="flex-1 w-full max-w-full overflow-x-clip">
        <HeroSection activeSection={activeSection} onNavigate={handleNavigate} />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-12 space-y-16 sm:space-y-24">
          
          {/* 1. Definición Formal y los 4 Tipos de Mantenimiento */}
          <section id="introduccion" className="scroll-mt-24">
            <IntroductionSection />
          </section>

          {/* Glosario Desplegable de Términos Técnicos */}
          <section id="glosario" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <TechnicalGlossary />
          </section>

          {/* 2. Simulador de Taller Paso a Paso (Workbench) */}
          <section id="taller" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <InteractiveWorkbench />
          </section>

          {/* 3. Explorador Topológico de Placa Madre */}
          <section id="motherboard" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <MotherboardExplorer />
          </section>

          {/* 4. Seguridad Eléctrica y Control ESD */}
          <section id="seguridad" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <SafetyEsdSection />
          </section>

          {/* 5. Arsenal de Herramientas e Insumos */}
          <section id="herramientas" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <ToolkitSection />
          </section>

          {/* 6. Protocolo de Intervención Hardware */}
          <section id="protocolo-hardware" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <HardwareProtocolSection />
          </section>

          {/* 7. Simulador Dinámico de Pasta Térmica */}
          <section id="simulador-termico" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <ThermalSimulator />
          </section>

          {/* 8. Laboratorio de Flujo de Aire de Chasis */}
          <section id="simulador-flujo" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <AirflowSimulator />
          </section>

          {/* 9. Sonda de Multímetro ATX 24-Pin */}
          <section id="sonda-psu" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <PsuTester />
          </section>

          {/* 10. Thermal Pads y Rodamientos de Ventiladores */}
          <section id="thermal-pads" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <ThermalPadsAndBearings />
          </section>

          {/* 11. Mantenimiento Lógico y Comandos de Consola */}
          <section id="protocolo-software" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <SoftwareProtocolSection />
          </section>

          {/* 12. Centro de Procedimientos Técnicos Animados */}
          <section id="procedimientos" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <InteractiveProceduresCenter />
          </section>

          {/* 13. Árbol de Fallas y Diagnóstico */}
          <section id="diagnostico" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <TroubleshootingTree />
          </section>

          {/* 14. Auditoría 20 Puntos y Certificado Técnico Imprimible */}
          <section id="checklist" className="scroll-mt-24 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <ChecklistAndReport />
          </section>

        </div>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
