import React, { useState, useMemo } from 'react';
import { soundFx } from '../utils/audio';
import { 
  BookMarked, ChevronDown, ChevronUp, Search, Sparkles, 
  ShieldAlert, Thermometer, Cpu, Wrench, AlertTriangle, 
  HelpCircle, CheckCircle2, Filter
} from 'lucide-react';

export interface GlossaryTerm {
  id: string;
  term: string;
  acronym?: string;
  category: 'seguridad' | 'termica' | 'hardware' | 'quimicos';
  categoryLabel: string;
  definition: string;
  workshopImpact: string;
  technicalTip: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'esd',
    term: 'Descarga Electrostática',
    acronym: 'ESD (Electrostatic Discharge)',
    category: 'seguridad',
    categoryLabel: 'Seguridad & Eléctrica',
    definition: 'Transferencia súbita y violenta de carga eléctrica entre dos cuerpos con distinto potencial electrostático al entrar en contacto directo o proximidad dieléctrica.',
    workshopImpact: 'El cuerpo humano acumula entre 3,000V y 15,000V por simple fricción. La compuerta de silicio de un MOSFET o controlador PCIe se perfora y destruye con apenas 30V a 100V, causando fallos catastróficos o latentes e intermitentes.',
    technicalTip: 'Trabajar siempre sobre tapete disipativo conectado a tierra física con pulsera antiestática provista de resistencia de seguridad de 1 MΩ.',
    icon: ShieldAlert
  },
  {
    id: 'thermal-throttling',
    term: 'Estrangulamiento Térmico',
    acronym: 'Thermal Throttling',
    category: 'termica',
    categoryLabel: 'Térmica & Refrigeración',
    definition: 'Mecanismo de autoprotección gobernado por el silicio del procesador o GPU que reduce de forma automática su multiplicador de reloj y voltaje al alcanzar la temperatura máxima de unión (TjMax ~95°C-105°C).',
    workshopImpact: 'Genera tirones (stuttering), caídas bruscas de FPS y lentitud generalizada en el sistema operativo. Es el síntoma inequívoco de pasta térmica degradada, ventiladores trabados o disipadores saturados de polvo.',
    technicalTip: 'Tras un mantenimiento correcto, un test de estrés de 15 minutos en Cinebench o AIDA64 no debe registrar caídas en las frecuencias turbo nominales.',
    icon: Thermometer
  },
  {
    id: 'conductividad-termica',
    term: 'Conductividad Térmica',
    acronym: 'W/m·K (Vatios por metro-kelvin)',
    category: 'termica',
    categoryLabel: 'Térmica & Refrigeración',
    definition: 'Propiedad física que cuantifica la tasa a la que el calor se propaga a través de un material por conducción pura a través de un gradiente de temperatura.',
    workshopImpact: 'El aire atrapado en microfisuras tiene una pésima conductividad (0.026 W/m·K). Las pastas térmicas estándar rondan 4 a 8.5 W/m·K, las premium de alta densidad alcanzan 12 a 14.2 W/m·K, y el metal líquido supera los 73 W/m·K.',
    technicalTip: 'La pasta no debe excederse en grosor; su único propósito es expulsar las bolsas de aire microscópicas entre el IHS y la base de cobre del disipador.',
    icon: Thermometer
  },
  {
    id: 'back-emf',
    term: 'Fuerza Contraelectromotriz / FEM Inversa',
    acronym: 'Back-EMF (Counter-Electromotive Force)',
    category: 'hardware',
    categoryLabel: 'Hardware & Placa',
    definition: 'Voltaje inducido en sentido inverso en los devanados inductivos de un motor brushless cuando sus imanes permanentes se desplazan forzados por una fuerza motriz externa.',
    workshopImpact: 'Al soplar aire a presión sobre un ventilador sin trabar sus aspas, gira a más de 8,000 RPM como generador eléctrico (dínamo), inyectando picos de sobretensión en los cabezales PWM de 4 pines de la placa madre y quemando microchips SMD.',
    technicalTip: 'Bloquear siempre físicamente las aspas del ventilador con un spudger plástico o el dedo antes de activar el chorro de aire comprimido.',
    icon: AlertTriangle
  },
  {
    id: 'vrm',
    term: 'Módulo Regulador de Voltaje',
    acronym: 'VRM (Voltage Regulator Module)',
    category: 'hardware',
    categoryLabel: 'Hardware & Placa',
    definition: 'Circuito conmutado de conversión DC-DC en la placa base (formado por controladores PWM, drivers, MOSFETs, bobinas/chokes y condensadores sólidos) que reduce los 12V de la fuente a 0.8V - 1.4V.',
    workshopImpact: 'Sometido a corrientes de hasta 200 Amperios en CPUs de alta gama. Si sus almohadillas térmicas (thermal pads) se secan o se cubren de hollín grasiento, los VRMs alcanzan 115°C y provocan apagados térmicos de emergencia (OVP/OTP).',
    technicalTip: 'Revisar la elasticidad de los thermal pads del VRM; si están cuarteados, reemplazarlos por almohadillas de 1.0mm o 1.5mm con conductividad mínima de 6 W/m·K.',
    icon: Cpu
  },
  {
    id: 'post',
    term: 'Autocomprobación de Encendido',
    acronym: 'POST (Power-On Self-Test)',
    category: 'hardware',
    categoryLabel: 'Hardware & Placa',
    definition: 'Rutina firmware de arranque ejecutada por la BIOS/UEFI al energizar el equipo para verificar la inicialización de la CPU, buses de memoria DRAM, GPU y subsistemas primarios.',
    workshopImpact: 'Si el hardware falla durante el POST, el equipo no emitirá señal de video ni cargará el SO. Se diagnostica mediante micro-diodos LED de depuración (Debug LEDs), altavoz de beeps sonoros o pantalla de código hexadecimal.',
    technicalTip: 'Si el LED DRAM queda encendido de forma fija, limpia los contactos dorados de los módulos con goma de migajón y confirma instalación en los slots prioritarios A2 y B2.',
    icon: CheckCircle2
  },
  {
    id: 'socket-lga-pga',
    term: 'Zócalos LGA vs PGA',
    acronym: 'LGA (Land Grid) vs PGA (Pin Grid)',
    category: 'hardware',
    categoryLabel: 'Hardware & Placa',
    definition: 'LGA ubica los pines elásticos microscópicos en la placa madre (Intel y AMD AM5). PGA mantiene los pines soldados directamente en la base inferior del chip (AMD AM4 anteriores).',
    workshopImpact: 'En zócalos PGA con pasta térmica reseca, tirar verticalmente del disipador arranca el procesador bloqueado del zócalo, doblando o partiendo pines. En LGA, tocar los pines de la placa con los dedos o herramientas deforma el array irreversiblemente.',
    technicalTip: 'Aplicar siempre movimiento de giro tangencial suave (cizallamiento de 5° a 10°) para despegar disipadores pegados al vacío antes de intentar levantarlos.',
    icon: Cpu
  },
  {
    id: 'dual-channel',
    term: 'Arquitectura de Memoria Dual Channel',
    acronym: 'Doble Canal de Memoria RAM',
    category: 'hardware',
    categoryLabel: 'Hardware & Placa',
    definition: 'Tecnología en el controlador de memoria de la CPU que habilita dos buses de datos independientes de 64 bits de forma concurrente, duplicando el ancho de banda teórico de transferencia a la caché.',
    workshopImpact: 'Instalar dos módulos en ranuras adyacentes de un mismo canal opera en Single Channel, perdiendo hasta un 25% de rendimiento en CPUs modernas con gráficos integrados o tareas multitarea intensivas.',
    technicalTip: 'En placas con 4 slots de memoria, la configuración estandarizada por fabricantes (ASUS, MSI, Gigabyte, ASRock) exige poblar primero los zócalos 2 y 4 (A2 y B2).',
    icon: Cpu
  },
  {
    id: 'alcohol-isopropilico',
    term: 'Alcohol Isopropílico al 99.8%',
    acronym: 'IPA (Isopropanol Grado Electrónico)',
    category: 'quimicos',
    categoryLabel: 'Químicos & Herramientas',
    definition: 'Solvente orgánico desengrasante anhidro de evaporación ultra rápida con menos del 0.2% de contenido de agua, dieléctrico y seguro para circuitería electrónica.',
    workshopImpact: 'Disuelve aceites de silicona y resinas térmicas carbonizadas sin corroer las pistas de cobre ni las soldaduras de estaño. El alcohol etílico común de farmacia (70% o 96%) contiene agua que causa óxido y cortocircuitos.',
    technicalTip: 'Humedecer toallitas de microfibra de polímero sin pelusa; nunca verter el líquido directamente sobre el zócalo ni empapar el PCB.',
    icon: Wrench
  },
  {
    id: 'thermal-pads',
    term: 'Almohadillas Térmicas',
    acronym: 'Thermal Pads de Silicona / Grafeno',
    category: 'quimicos',
    categoryLabel: 'Químicos & Herramientas',
    definition: 'Láminas sólidas de silicona elastomérica rellenas con partículas de óxido metálico o cerámica, con espesores milimétricos calibrados (0.5mm, 1.0mm, 1.5mm, 2.0mm) y memoria de compresión.',
    workshopImpact: 'Puentean separaciones mecánicas irregulares donde la pasta líquida se escurriría o crearía cámaras de aire, como chips de VRAM en tarjetas gráficas y ranuras M.2 NVMe.',
    technicalTip: 'Nunca sustituir un thermal pad por pasta térmica común ni usar un pad de mayor grosor, ya que impedirá que la base del disipador haga contacto firme con el núcleo principal.',
    icon: Wrench
  },
  {
    id: 'spudger',
    term: 'Espátula No Conductora / Spudger',
    acronym: 'Herramienta Antiestática POM',
    category: 'quimicos',
    categoryLabel: 'Químicos & Herramientas',
    definition: 'Instrumento manual de precisión fabricado en poliacetal (POM) o fibra de nylon antiestática con una punta plana de cuña y un extremo en gancho punteado.',
    workshopImpact: 'Permite desconectar buses planos (flex cables), desenganchar clips de retención de plástico y trabar aspas de ventiladores sin rayar pistas de cobre ni crear puentes de cortocircuito.',
    technicalTip: 'Evitar usar destornilladores metálicos como palanca cerca de condensadores SMD; un deslizamiento accidental arrancará microcomponentes del PCB.',
    icon: Wrench
  },
  {
    id: 'torque-cruz',
    term: 'Torque en Cruz / Secuencia Diagonal',
    acronym: 'Cross-Pattern Tightening',
    category: 'termica',
    categoryLabel: 'Térmica & Refrigeración',
    definition: 'Método mecánico de apriete simétrico en el que los tornillos de retención de un disipador se ajustan de forma alternada en extremos opuestos diagonales, una vuelta por ciclo.',
    workshopImpact: 'Apretar un tornillo a fondo antes de iniciar los demás ejerce una palanca asimétrica que deforma el socket, expulsa la pasta térmica hacia un solo costado y puede trizar el sustrato de silicio.',
    technicalTip: 'Seguir siempre la secuencia: Superior Izquierdo (1 vuelta) → Inferior Derecho (1 vuelta) → Superior Derecho (1 vuelta) → Inferior Izquierdo (1 vuelta) hasta hacer tope.',
    icon: Wrench
  },
  {
    id: 'presion-estatica',
    term: 'Presión Estática en Ventiladores',
    acronym: 'mmH2O (Presión vs Flujo CFM)',
    category: 'termica',
    categoryLabel: 'Térmica & Refrigeración',
    definition: 'Capacidad de un ventilador para empujar una columna de aire a través de una alta resistencia u obstáculo denso, como las aletas tupidas de un radiador o filtros antipolvo.',
    workshopImpact: 'Un ventilador de alto flujo (CFM) pero baja presión estática no logrará penetrar el radiador de una refrigeración líquida ni las rejillas de un disipador de torre, acumulando calor residual.',
    technicalTip: 'Usar ventiladores con aspas anchas y poca separación (presión estática) para radiadores y disipadores; reservar ventiladores de flujo abierto para la expulsión trasera.',
    icon: Thermometer
  },
  {
    id: 'delidding',
    term: 'Destapado de IHS / Delid',
    acronym: 'Delidding del Procesador',
    category: 'termica',
    categoryLabel: 'Térmica & Refrigeración',
    definition: 'Procedimiento avanzado de taller consistente en separar mecánicamente el disipador metálico integrado (IHS) del procesador para sustituir el compuesto interno por metal líquido.',
    workshopImpact: 'En CPUs de arquitectura densa permite reducir entre 10°C y 18°C. Sin embargo, invalida la garantía del fabricante y un error en la herramienta puede quebrar el die de silicio.',
    technicalTip: 'Es un procedimiento de nivel entusiasta/extremo; en mantenimientos preventivos estándar corporativos NUNCA debe abrirse el IHS soldado.',
    icon: AlertTriangle
  },
  {
    id: 'corrosion-galvanica',
    term: 'Corrosión Galvánica en Líquida',
    acronym: 'Reacción Electroquímica Bimetálica',
    category: 'seguridad',
    categoryLabel: 'Seguridad & Eléctrica',
    definition: 'Proceso de degradación química acelerada que ocurre al interconectar metales con diferente potencial de reducción (como cobre y aluminio) en presencia de un refrigerante conductor.',
    workshopImpact: 'El aluminio actúa como ánodo de sacrificio, desprendiendo partículas microscópicas que obstruyen los microcanales del bloque de la CPU y perforan los radiadores provocando fugas catastróficas.',
    technicalTip: 'En sistemas de refrigeración líquida personalizada (custom loop) jamás mezclar componentes de aluminio con cobre o níquel; usar siempre refrigerantes con biocidas e inhibidores galvánicos.',
    icon: ShieldAlert
  },
  {
    id: 'bateria-cmos',
    term: 'Batería RTC / Pila CMOS CR2032',
    acronym: 'CR2032 (3V Litio Dióxido de Manganeso)',
    category: 'hardware',
    categoryLabel: 'Hardware & Placa',
    definition: 'Pila de botón de litio de 3 voltios que mantiene energizado el circuito del reloj de tiempo real (RTC) y los registros volátiles de configuración de la BIOS cuando la fuente está desconectada.',
    workshopImpact: 'Si su voltaje cae por debajo de 2.7V, la placa madre pierde la hora y fecha del sistema en cada corte de energía, revoca perfiles XMP/DOCP de la memoria y causa advertencias de CMOS Checksum Error.',
    technicalTip: 'Medir el voltaje con multímetro en escala de 20V DC en cada mantenimiento anual; reemplazar si entrega menos de 2.80V.',
    icon: CheckCircle2
  }
];

export const TechnicalGlossary: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'todos' | 'seguridad' | 'termica' | 'hardware' | 'quimicos'>('todos');
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);

  const toggleGlossary = () => {
    soundFx.click();
    setIsOpen(prev => !prev);
  };

  const handleTermClick = (id: string) => {
    soundFx.click();
    setExpandedTermId(prev => (prev === id ? null : id));
  };

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(term => {
      const matchesCategory = activeCategory === 'todos' || term.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesQuery = 
        term.term.toLowerCase().includes(query) ||
        (term.acronym && term.acronym.toLowerCase().includes(query)) ||
        term.definition.toLowerCase().includes(query) ||
        term.workshopImpact.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm dark:shadow-cyan-950/20 overflow-hidden transition-all duration-300">
      
      {/* Interactive Collapsible Header Bar */}
      <div 
        onClick={toggleGlossary}
        className="p-5 sm:p-6 cursor-pointer flex items-center justify-between gap-4 bg-gradient-to-r from-slate-50 via-white to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors select-none"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 shadow-xs">
            <BookMarked className="w-5 h-5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                DICCIONARIO TÉCNICO INTERACTIVO
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 font-bold border border-cyan-200 dark:border-cyan-800">
                {GLOSSARY_TERMS.length} TÉRMINOS
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5 truncate">
              Glosario Desplegable de Términos de Mantenimiento
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline text-xs font-medium text-slate-500 dark:text-slate-400">
            {isOpen ? 'Ocultar Glosario' : 'Desplegar Glosario'}
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-transform">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Collapsible Content Body */}
      {isOpen && (
        <div className="p-5 sm:p-7 border-t border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Subtitle & Search / Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Consulta rápida de conceptos clave de ingeniería, principios físicos y terminología estandarizada para el taller de mantenimiento preventivo y correctivo.
            </p>

            {/* Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar término o acrónimo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Categoría:</span>
            </span>

            {[
              { id: 'todos', label: `Todos (${GLOSSARY_TERMS.length})` },
              { id: 'seguridad', label: 'Seguridad & ESD' },
              { id: 'termica', label: 'Térmica & Flujo' },
              { id: 'hardware', label: 'Hardware & Placa' },
              { id: 'quimicos', label: 'Químicos & Herramientas' },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundFx.click();
                    setActiveCategory(cat.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all border ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Terms Grid */}
          {filteredTerms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredTerms.map((item) => {
                const isExpanded = expandedTermId === item.id;
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'bg-cyan-50/40 dark:bg-slate-950/80 border-cyan-500/70 shadow-sm ring-1 ring-cyan-500/20'
                        : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Term Header / Accordion Clicker */}
                    <div
                      onClick={() => handleTermClick(item.id)}
                      className="p-4 cursor-pointer flex items-start justify-between gap-3 select-none"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isExpanded
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-200 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                              {item.categoryLabel}
                            </span>
                            {item.acronym && (
                              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                                · {item.acronym}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {item.term}
                          </h4>
                        </div>
                      </div>

                      <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 mt-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Quick Preview or Full Content */}
                    <div className="px-4 pb-4 pt-1 space-y-3">
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {item.definition}
                      </p>

                      {/* Expanded Deep Technical Details */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5 animate-in fade-in duration-150">
                          {/* Workshop Impact Box */}
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                            <span className="font-bold text-cyan-800 dark:text-cyan-300 block mb-1 font-mono text-[11px]">
                              ▸ IMPACTO PRÁCTICO EN EL MANTENIMIENTO:
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {item.workshopImpact}
                            </p>
                          </div>

                          {/* Technical Tip Alert */}
                          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs flex items-start gap-2 text-amber-900 dark:text-amber-200">
                            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block text-[11px] mb-0.5">Norma / Regla Técnica:</span>
                              <span className="leading-relaxed">{item.technicalTip}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No se encontraron términos que coincidan con "{searchQuery}"
              </div>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('todos'); }}
                className="mt-2 text-xs font-mono text-cyan-600 hover:underline"
              >
                Limpiar búsqueda y filtros
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
