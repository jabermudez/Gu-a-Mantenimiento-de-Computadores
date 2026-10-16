import { ToolItem, PsuPin, TroubleshootingCase, VideoGuide, ChecklistItem, MaintenanceReport } from '../types/maintenance';

export const TOOLS_DATA: ToolItem[] = [
  {
    id: 'destornilladores-precision',
    name: 'Juego de Destornilladores de Precisión Imantados',
    category: 'precision',
    categoryLabel: 'Herramientas de Precisión',
    specification: 'Puntas Phillips PH00, PH0, PH1, PH2, Torx T5/T6/T8/T10, Planos 1.5-3.0mm, Aleación S2 (Dureza 60 HRC).',
    purpose: 'Montaje y desmontaje sin barrer roscas de tornillos M.2, disipadores, placas madre y soportes de chasis.',
    criticalWarning: 'No usar puntas desgastadas ni fuerza axial excesiva. En tornillos de notebook o M.2, usar PH00 para evitar dañar la cabeza.',
    iconName: 'Wrench',
    usageTip: 'El imán debe ser suave (neodimio controlado) para sostener tornillos sin afectar circuitos magnéticamente sensibles.'
  },
  {
    id: 'pulsera-esd',
    name: 'Pulsera Antiestática con Cable Espiral y Pinza Cocodrilo',
    category: 'seguridad',
    categoryLabel: 'Seguridad y ESD',
    specification: 'Banda elástica con filamentos de plata/carbono, resistencia limitadora integrada de 1 MΩ (±5%) para seguridad humana.',
    purpose: 'Drenaje constante del potencial electrostático del cuerpo hacia tierra física para evitar perforaciones de óxido de compuerta en semiconductores (MOSFETs, CPUs, memorias).',
    criticalWarning: 'NUNCA retirar la resistencia de 1 MΩ ni conectarla a fase/neutro. Debe fijarse al chasis metálico sin pintura o toma a tierra del banco.',
    iconName: 'ShieldAlert',
    usageTip: 'Colócala en la muñeca no dominante ajustada directamente a la piel sin prendas intermedias.'
  },
  {
    id: 'manta-antiestatica',
    name: 'Manta / Tapete de Trabajo Antiestático Disipativo',
    category: 'seguridad',
    categoryLabel: 'Seguridad y ESD',
    specification: 'Goma de doble capa (superior disipativa 10^6 - 10^9 Ω/sq, inferior conductora 10^3 - 10^5 Ω/sq), resistente a calor y soldadura.',
    purpose: 'Superficie de apoyo segura para placas base, tarjetas gráficas y discos mientras se realiza la intervención.',
    criticalWarning: 'Evitar superficies de plástico no tratado, madera plastificada o manteles sintéticos que generan cargas triboeléctricas de hasta 15,000V.',
    iconName: 'Layers',
    usageTip: 'Conectar el broche de tierra del tapete al mismo punto de tierra física central de la estación de servicio.'
  },
  {
    id: 'alcohol-isopropilico',
    name: 'Alcohol Isopropílico (Pureza 99.8%)',
    category: 'quimicos',
    categoryLabel: 'Químicos e Insumos',
    specification: 'Grado reactivo / electrónico 99.8% libre de agua y residuos aromáticos.',
    purpose: 'Disolución y remoción de pastas térmicas resecas, flux, aceites y grasas sobre el IHS de la CPU, GPU y disipadores.',
    criticalWarning: 'NUNCA utilizar alcohol etílico medicinal (70% o 96% farmacéutico), ya que contiene entre 4% y 30% de agua que corroe pistas e induce sulfatación.',
    iconName: 'FlaskConical',
    usageTip: 'Aplicar con paño de microfibra lint-free o hisopo de grado óptico. Seca en menos de 10 segundos sin dejar película aceitosa.'
  },
  {
    id: 'pasta-termica-premium',
    name: 'Pasta Térmica de Alto Rendimiento no Conductora',
    category: 'quimicos',
    categoryLabel: 'Químicos e Insumos',
    specification: 'Conductividad térmica > 8.5 W/m·K, micropartículas de óxido metálico/carbono, dieléctrica (conductividad eléctrica = 0 pS/m).',
    purpose: 'Llenar las microscópicas imperfecciones del aire (el aire conduce solo 0.026 W/m·K) entre el IHS y el bloque de refrigeración.',
    criticalWarning: 'Evitar el compuesto de metal líquido (Galio-Indio) en disipadores con base de aluminio (crea amalgama que desintegra el aluminio) y riesgo de cortocircuito.',
    iconName: 'Cpu',
    usageTip: 'El exceso actúa como aislante térmico y se desborda sobre los capacitores SMD alrededor del socket.'
  },
  {
    id: 'soplador-aire-comprimido',
    name: 'Soplador Eléctrico Antiestático / Aire Comprimido Seco',
    category: 'precision',
    categoryLabel: 'Herramientas de Precisión',
    specification: 'Motor sin escobillas con boquilla conductora disipativa, filtro de aire HEPA o latas de gas R134a sin humedad.',
    purpose: 'Expulsión de motas de polvo compactas acumuladas en radiadores, aletas de disipadores, aspas y túneles de ventilación.',
    criticalWarning: '¡REGLA FUNDAMENTAL! Trabar SIEMPRE las aspas de los ventiladores con un spudger o dedo al soplar. El giro descontrolado induce fuerza contraelectromotriz (fem inversa) que quema los transistores PWM de la placa madre.',
    iconName: 'Wind',
    usageTip: 'Efectuar ráfagas cortas de 2 a 3 segundos a una distancia mínima de 15 cm con el equipo orientado hacia la campana o exterior.'
  },
  {
    id: 'limpiador-contactos',
    name: 'Limpiador de Contactos Electrónicos Residuo Cero',
    category: 'quimicos',
    categoryLabel: 'Químicos e Insumos',
    specification: 'Solvente de secado ultrarrápido, no conductor, seguro para la mayoría de plásticos y resinas epóxicas.',
    purpose: 'Limpieza de ranuras PCIe, zócalos DIMM de memoria RAM, conectores M.2 y pines de periféricos.',
    criticalWarning: 'Esperar la evaporación completa antes de energizar cualquier equipo (mínimo 3 minutos tras la aplicación).',
    iconName: 'Sparkles',
    usageTip: 'Pulverizar con la cánula fina directamente sobre la ranura mientras se sostiene la placa en ángulo descendente.'
  },
  {
    id: 'multimetro-digital',
    name: 'Multímetro Digital True RMS con Puntas de Aguja',
    category: 'instrumentos',
    categoryLabel: 'Instrumentos de Diagnóstico',
    specification: 'Categoría CAT III 600V, medición de voltaje DC con resolución de 1mV, prueba de continuidad audible rápida y resistencia.',
    purpose: 'Medición precisa de rieles de alimentación ATX (+12V, +5V, +3.3V, +5VSB), comprobación de pulsadores de encendido y fusibles SMD.',
    criticalWarning: 'No medir voltaje en modo amperímetro o resistencia para evitar cortocircuitar líneas de alimentación.',
    iconName: 'Activity',
    usageTip: 'Las puntas ultrafinas tipo aguja facilitan sondear la parte trasera del conector ATX de 24 pines sin desconectar el mazo.'
  },
  {
    id: 'tester-fuente-atx',
    name: 'Tester Digital de Fuente de Poder con Display LCD',
    category: 'instrumentos',
    categoryLabel: 'Instrumentos de Diagnóstico',
    specification: 'Entradas para ATX 24 pines, CPU EPS 4/8 pines, PCIe 6/8 pines, SATA y Molex. Detección de retardo Power Good (PG en ms).',
    purpose: 'Comprobación rápida de voltajes de salida y retardo PG antes de conectar la fuente a componentes costosos.',
    criticalWarning: 'Si el valor de PG está fuera de 100-500 ms o parpadea en el display, la fuente tiene capacitores defectuosos y debe sustituirse.',
    iconName: 'Gauge',
    usageTip: 'Ideal para triaje rápido de equipos que no encienden o presentan reinicios aleatorios.'
  },
  {
    id: 'spudgers-pinzas',
    name: 'Spudgers de Nylon Antiestático y Pinzas de Precisión ESD',
    category: 'precision',
    categoryLabel: 'Herramientas de Precisión',
    specification: 'Polímero no conductivo de alta densidad, pinzas con recubrimiento electrostático ESD-10 y ESD-15.',
    purpose: 'Desconexión de seguros plásticos de cables, desbloqueo de pestañas de memoria RAM y retención de tornillos caídos.',
    criticalWarning: 'No usar pinzas metálicas no aisladas dentro de un equipo conectado a la red eléctrica o con cables de standby activos.',
    iconName: 'Maximize2',
    usageTip: 'El spudger plano permite abrir tapas de notebooks sin mellar los bordes del chasis.'
  }
];

export const PSU_24PIN_DATA: PsuPin[] = [
  { pin: 1, name: '+3.3V', color: '#f97316', voltage: '+3.3V DC', nominalVoltage: 3.3, toleranceMin: 3.14, toleranceMax: 3.47, description: 'Alimentación de memoria RAM, chipsets y lógica de baja potencia.', criticalFor: 'Controlador de memoria y buses digitales' },
  { pin: 2, name: '+3.3V', color: '#f97316', voltage: '+3.3V DC', nominalVoltage: 3.3, toleranceMin: 3.14, toleranceMax: 3.47, description: 'Línea de soporte para 3.3V.', criticalFor: 'Voltaje estable para circuitos integrados' },
  { pin: 3, name: 'COM', color: '#111827', voltage: '0V (Tierra)', nominalVoltage: 0, toleranceMin: 0, toleranceMax: 0, description: 'Retorno de masa común del circuito.', criticalFor: 'Referencia eléctrica de todo el sistema' },
  { pin: 4, name: '+5V', color: '#ef4444', voltage: '+5V DC', nominalVoltage: 5.0, toleranceMin: 4.75, toleranceMax: 5.25, description: 'Alimentación de puertos USB, controladores y circuitos integrados auxiliares.', criticalFor: 'Puertos periféricos USB y lógica SATA' },
  { pin: 5, name: 'COM', color: '#111827', voltage: '0V (Tierra)', nominalVoltage: 0, toleranceMin: 0, toleranceMax: 0, description: 'Retorno de masa común del circuito.', criticalFor: 'Línea de retorno para riel +5V' },
  { pin: 6, name: '+5V', color: '#ef4444', voltage: '+5V DC', nominalVoltage: 5.0, toleranceMin: 4.75, toleranceMax: 5.25, description: 'Alimentación suplementaria de +5V.', criticalFor: 'Alimentación de buses de discos duros y RGB' },
  { pin: 7, name: 'COM', color: '#111827', voltage: '0V (Tierra)', nominalVoltage: 0, toleranceMin: 0, toleranceMax: 0, description: 'Retorno de masa común del circuito.', criticalFor: 'Tierra para circuitos lógicos' },
  { pin: 8, name: 'PWR_OK', color: '#94a3b8', voltage: '+5V DC (PG)', nominalVoltage: 5.0, toleranceMin: 4.75, toleranceMax: 5.25, description: 'Señal "Power Good" enviada por la fuente tras estabilizar los voltajes (100-500ms).', criticalFor: 'Permite a la CPU iniciar el ciclo POST sin colapsar' },
  { pin: 9, name: '+5VSB', color: '#a855f7', voltage: '+5V Standby', nominalVoltage: 5.0, toleranceMin: 4.75, toleranceMax: 5.25, description: 'Voltaje permanente mientras la fuente esté enchufada, incluso con el PC apagado.', criticalFor: 'Wake-on-LAN, puertos USB con carga y circuito de encendido' },
  { pin: 10, name: '+12V1', color: '#eab308', voltage: '+12V DC', nominalVoltage: 12.0, toleranceMin: 11.40, toleranceMax: 12.60, description: 'Alimentación de alta potencia: fases VRM, ventiladores y motores.', criticalFor: 'Etapas de potencia del procesador y GPU' },
  { pin: 11, name: '+12V1', color: '#eab308', voltage: '+12V DC', nominalVoltage: 12.0, toleranceMin: 11.40, toleranceMax: 12.60, description: 'Refuerzo de corriente de la línea de 12V.', criticalFor: 'Estabilidad de ventiladores y cabezales ARGB' },
  { pin: 12, name: '+3.3V', color: '#f97316', voltage: '+3.3V DC', nominalVoltage: 3.3, toleranceMin: 3.14, toleranceMax: 3.47, description: 'Tercera vía de 3.3V (incluye cable sensor 3.3V Sense en fuentes modulares).', criticalFor: 'Compensación de caída de tensión en placa base' },
  { pin: 13, name: '+3.3V', color: '#f97316', voltage: '+3.3V DC', nominalVoltage: 3.3, toleranceMin: 3.14, toleranceMax: 3.47, description: 'Terminal de tensión de 3.3V.', criticalFor: 'Línea de zócalos PCIe' },
  { pin: 14, name: '-12V', color: '#3b82f6', voltage: '-12V DC', nominalVoltage: -12.0, toleranceMin: -13.2, toleranceMax: -10.8, description: 'Voltaje negativo de baja potencia para puertos serie COM y amplificadores operacionales de audio.', criticalFor: 'Circuitos analógicos de tarjetas de sonido antiguas' },
  { pin: 15, name: 'COM', color: '#111827', voltage: '0V (Tierra)', nominalVoltage: 0, toleranceMin: 0, toleranceMax: 0, description: 'Retorno de masa común del circuito.', criticalFor: 'Masa de seguridad' },
  { pin: 16, name: 'PS_ON#', color: '#22c55e', voltage: '0V (Activo) / 5V (Standby)', nominalVoltage: 0, toleranceMin: 0, toleranceMax: 5.0, description: 'Pin de control de encendido. Unir a tierra (COM) para arrancar la fuente de forma manual en banco.', criticalFor: 'Puente con clip para prueba en banco de trabajo' },
  { pin: 17, name: 'COM', color: '#111827', voltage: '0V (Tierra)', nominalVoltage: 0, toleranceMin: 0, toleranceMax: 0, description: 'Retorno de masa común.', criticalFor: 'Masa de circuito' },
  { pin: 18, name: 'COM', color: '#111827', voltage: '0V (Tierra)', nominalVoltage: 0, toleranceMin: 0, toleranceMax: 0, description: 'Retorno de masa común.', criticalFor: 'Masa de circuito' },
  { pin: 19, name: 'COM', color: '#111827', voltage: '0V (Tierra)', nominalVoltage: 0, toleranceMin: 0, toleranceMax: 0, description: 'Retorno de masa común.', criticalFor: 'Masa de circuito' },
  { pin: 20, name: 'NC / Reservado', color: '#64748b', voltage: '0V', nominalVoltage: 0, toleranceMin: 0, toleranceMax: 0, description: 'Antiguamente -5V (obsoleto según norma ATX 12V 2.0 en adelante).', criticalFor: 'Sin conexión requerida' },
  { pin: 21, name: '+5V', color: '#ef4444', voltage: '+5V DC', nominalVoltage: 5.0, toleranceMin: 4.75, toleranceMax: 5.25, description: 'Alimentación de 5V para la placa base.', criticalFor: 'Controladores y circuitería integrada' },
  { pin: 22, name: '+5V', color: '#ef4444', voltage: '+5V DC', nominalVoltage: 5.0, toleranceMin: 4.75, toleranceMax: 5.25, description: 'Línea adicional de 5V.', criticalFor: 'Conectores RGB y audio' },
  { pin: 23, name: '+5V', color: '#ef4444', voltage: '+5V DC', nominalVoltage: 5.0, toleranceMin: 4.75, toleranceMax: 5.25, description: 'Línea adicional de 5V.', criticalFor: 'Dispositivos de almacenamiento auxiliares' },
  { pin: 24, name: 'COM', color: '#111827', voltage: '0V (Tierra)', nominalVoltage: 0, toleranceMin: 0, toleranceMax: 0, description: 'Retorno de masa común del circuito.', criticalFor: 'Cierre de lazo de corriente' }
];

export const TROUBLESHOOTING_CASES: TroubleshootingCase[] = [
  {
    id: 'no-enciende',
    symptom: 'El equipo no enciende en absoluto: ningún ventilador gira ni se enciende ningún LED indicador.',
    category: 'energia',
    severity: 'Crítica',
    likelyCauses: [
      'Cable de alimentación AC desconectado, dañado o zapatilla/enchufe sin energía.',
      'Interruptor I/O trasero de la fuente de poder en posición O (apagado).',
      'Pulsador frontal de Power defectuoso o cables del Front Panel desconectados de la placa madre.',
      'Fuente de alimentación (PSU) en protección contra cortocircuito o con fusible interno abierto.',
      'Cortocircuito franco en la línea de +12V EPS (MOSFET de etapa VRM en corto).'
    ],
    diagnosticSteps: [
      '1. Verificar presencia de +5VSB (LED de standby en placa base encendido o pin 9 en 5.0V).',
      '2. Desconectar los cables del panel frontal y puentear brevemente los dos pines POWER_SW de la placa madre con la punta de un destornillador.',
      '3. Desconectar la fuente de la placa madre y hacer la prueba del clip (puente pin 16 verde PS_ON con pin 17 negro COM). Si el ventilador de la PSU no arranca, la fuente está dañada.',
      '4. Desconectar el conector EPS de 8 pines del CPU. Si la placa ahora enciende los ventiladores, el corto está en los MOSFETs del regulador de voltaje del procesador.'
    ],
    recommendedSolution: 'Sustituir cable o fuente de poder si falla la prueba del clip. Si hay corto en VRM, derivar a laboratorio de microelectrónica para cambio de MOSFETs o reemplazar placa base.',
    preventionTip: 'Instalar regulador de voltaje con supresor de transitorios o UPS para evitar sobretensiones en la red pública.'
  },
  {
    id: 'enciende-sin-video',
    symptom: 'El equipo enciende, ventiladores giran a máxima velocidad, pero no muestra señal de video ni responde el teclado (Bloq Num).',
    category: 'video',
    severity: 'Alta',
    likelyCauses: [
      'Módulo de memoria RAM con suciedad en los pines dorados o mal asentado en el slot DIMM.',
      'Cable de monitor conectado al puerto HDMI/DisplayPort de la placa base en vez de la tarjeta gráfica dedicada.',
      'Falla en la inicialización POST: BIOS corrupta o versión antigua no compatible con el microprocesador instalado.',
      'Tarjeta gráfica (GPU) no detectada, sin conectores PCIe auxiliares o con slot sucio.',
      'Zócalo de CPU con pines doblados (LGA) o presión desigual del disipador sobre el procesador.'
    ],
    diagnosticSteps: [
      '1. Inspeccionar los 4 LEDs de diagnóstico rápido de la placa madre (Debug LEDs: CPU, DRAM, VGA, BOOT).',
      '2. Retirar todos los módulos de RAM, limpiar contactos con goma de borrar blanca y alcohol isopropílico, y probar con UN solo módulo en el slot A2 (ranura 2 contando desde la CPU).',
      '3. Realizar un Clear CMOS retirando la pila de botón CR2032 durante 5 minutos con la fuente desenchufada, o puenteando los pines JBAT1/CLR_CMOS por 15 segundos.',
      '4. Verificar que el cable del monitor esté conectado a la GPU dedicada y no a la placa madre si el CPU no cuenta con gráficos integrados (ej. Ryzen terminados en X o Intel serie F).'
    ],
    recommendedSolution: 'Limpieza de slots DIMM y pines de memoria RAM. Si la placa madre tiene función BIOS Flashback, actualizar el firmware mediante memoria USB formateada en FAT32.',
    preventionTip: 'Sujetar siempre los módulos de RAM por los bordes sin tocar los contactos metálicos.'
  },
  {
    id: 'apagado-repentino-juego',
    symptom: 'El equipo se apaga abruptamente tras 5 a 20 minutos de ejecución de videojuegos exigentes o renderizado 3D, y no vuelve a encender de inmediato.',
    category: 'temperatura',
    severity: 'Alta',
    likelyCauses: [
      'Disipador de CPU o radiador de refrigeración líquida saturado de polvo y pelusa (Thermal Shutdown).',
      'Bomba de refrigeración líquida AIO bloqueada, sin revoluciones o con aire atrapado en el bloque.',
      'Pasta térmica totalmente degradada, seca o plástico protector de fábrica dejado por error en la base del cooler.',
      'Fuente de alimentación insuficiente o sobrecalentada activando la protección térmica OTP o sobrecorriente OCP.'
    ],
    diagnosticSteps: [
      '1. Abrir HWMonitor o HWiNFO64 y observar la temperatura en reposo y bajo estrés con FurMark o Cinebench.',
      '2. Si la temperatura del CPU escala instantáneamente de 40°C a 100°C en menos de 5 segundos, no hay contacto térmico efectivo (pasta seca o disipador suelto).',
      '3. En refrigeraciones líquidas AIO, tocar las dos mangueras: si una está ardiendo y la otra fría, el líquido no circula (bomba descompuesta).',
      '4. Comprobar si la fuente de poder expulsa aire excesivamente caliente por su rejilla trasera.'
    ],
    recommendedSolution: 'Desmontaje de cooler, limpieza química con alcohol isopropílico al 99.8%, reaplicación de pasta térmica de alta conductividad y soplado del radiador.',
    preventionTip: 'Programar mantenimiento preventivo cada 6 a 12 meses según el nivel de polvo ambiental.'
  },
  {
    id: 'pantallazos-azules-bsod',
    symptom: 'Aparición aleatoria de pantallas azules de la muerte (BSOD) con códigos WHEA_UNCORRECTABLE_ERROR o MEMORY_MANAGEMENT.',
    category: 'estabilidad',
    severity: 'Alta',
    likelyCauses: [
      'Perfil XMP / EXPO de memoria RAM inestable con el controlador de memoria (IMC) del CPU.',
      'Sectores defectuosos o degradación de celdas NAND en el SSD del sistema.',
      'Controladores de chipset o tarjeta gráfica corruptos tras una actualización incompleta.',
      'Caída de tensión en el riel de +12V bajo carga pesada.'
    ],
    diagnosticSteps: [
      '1. Analizar el archivo minidump con la herramienta BlueScreenView o WinDbg para identificar el archivo .sys causante.',
      '2. Desactivar el perfil XMP en la BIOS y ejecutar el diagnóstico de memoria de Windows o MemTest86 por al menos 4 pases completos.',
      '3. Abrir CrystalDiskInfo y revisar el estado de salud SMART del disco SSD/NVMe (revisar porcentaje de vida útil restante y errores de integridad de medios).',
      '4. Ejecutar en consola con privilegios de administrador: sfc /scannow y DISM /Online /Cleanup-Image /RestoreHealth.'
    ],
    recommendedSolution: 'Actualizar la BIOS a la última versión AGESA/Microcode estable para mejorar compatibilidad de memoria. Si MemTest86 arroja errores en rojo, reemplazar el módulo de RAM dañado.',
    preventionTip: 'Configurar la memoria a la velocidad JEDEC estándar de fábrica antes de actualizar la BIOS.'
  },
  {
    id: 'disco-100-lento',
    symptom: 'El sistema operativo tarda más de 3 minutos en arrancar, se congela constantemente y el Administrador de tareas muestra "Disco al 100%".',
    category: 'almacenamiento',
    severity: 'Moderada',
    likelyCauses: [
      'Unidad de disco mecánico (HDD) como unidad de arranque principal con cientos de accesos concurrentes de Windows.',
      'Sectores pendientes o reasignados (Current Pending Sector Count en SMART) en el disco duro.',
      'Servicio SysMain (Superfetch) o Windows Search indexando archivos dañados en bucle infinito.',
      'Infección por malware en segundo plano (minería de criptomonedas o troyanos de telemetría).'
    ],
    diagnosticSteps: [
      '1. Verificar en CrystalDiskInfo el estado de salud. Si aparece "Riesgo" en amarillo por sectores reasignados, el disco mecánico está al borde del colapso.',
      '2. Identificar en la pestaña "Rendimiento" del Administrador de tareas el tiempo de respuesta promedio del disco (valores superiores a 500 ms indican fallo de lectura).',
      '3. Deshabilitar temporalmente el servicio SysMain desde services.msc para descartar sobrecarga de caché.',
      '4. Ejecutar chkdsk C: /f /r programándolo para el próximo reinicio.'
    ],
    recommendedSolution: 'Migración / clonación obligatoria del sistema operativo hacia una unidad de estado sólido (SSD NVMe o SATA). La velocidad de lectura aumentará de 80 MB/s a más de 500-3500 MB/s.',
    preventionTip: 'Nunca someter a golpes o vibraciones a un disco mecánico mientras está girando a 5400/7200 RPM.'
  }
];

export const VIDEO_GUIDES: VideoGuide[] = [
  {
    id: 'video-desensamble-seguro',
    title: 'Desensamble Integral y Limpieza Profunda de PC Gamer y Estaciones de Trabajo',
    duration: '18:45',
    phase: 'Fase Hardware',
    youtubeId: 'OZaFz5Q532o',
    summary: 'Procedimiento profesional paso a paso para desmontar chasis, aislar componentes con pulsera ESD, desconectar seguros de alimentación y efectuar la limpieza por zonas sin inducir corriente inversa en ventiladores.',
    keyTimestamps: [
      { time: '01:20', title: 'Descarga de condensadores de fuente (procedimiento de seguridad)' },
      { time: '04:15', title: 'Técnica de bloqueo mecánico de aspas de ventiladores' },
      { time: '08:30', title: 'Extracción sin torsión de tarjetas gráficas pesadas (seguro PCIe)' },
      { time: '14:10', title: 'Limpieza de filtros magnéticos y canalizaciones de chasis' }
    ],
    criticalRules: [
      'Trabar siempre las aspas de los ventiladores antes de aplicar chorro de aire.',
      'Fotografiar las conexiones de cabezales del panel frontal antes de retirarlas.',
      'No usar pinceles de cerdas plásticas comunes por su alta generación de fricción electrostática.'
    ]
  },
  {
    id: 'video-pasta-termica',
    title: 'Ciencia de la Pasta Térmica: Comparativa de Métodos de Aplicación y Pruebas Térmicas',
    duration: '14:20',
    phase: 'Fase Térmica',
    youtubeId: 'r2MEAnRn3c4',
    summary: 'Análisis experimental de laboratorio con cámara acrílica transparente: comportamiento de expansión térmica bajo presión uniforme para métodos de Punto Central, Cruz en X, Cinco Puntos y Espátula.',
    keyTimestamps: [
      { time: '02:10', title: 'Limpieza del IHS con Isopropílico 99.8% y paño sin pelusa' },
      { time: '05:40', title: 'Diferencia de superficie entre sockets Intel LGA1700 y AMD AM5' },
      { time: '09:15', title: 'Ajuste en cruz de los 4 tornillos del disipador' },
      { time: '12:00', title: 'Medición de temperatura bajo estrés térmico en Cinebench R23' }
    ],
    criticalRules: [
      'Para procesadores modernos rectangulares (Intel 12va-14va Gen) o con dies descentralizados (AMD Ryzen), la Cruz en X o Cinco Puntos ofrece la mejor cobertura.',
      'Apretar los tornillos del disipador en patrón de cruz de forma progresiva (1/2 vuelta por tornillo) para equilibrar la tensión sobre el IHS.'
    ]
  },
  {
    id: 'video-diagnostico-fuente',
    title: 'Cómo Diagnosticar y Medir una Fuente de Poder con Multímetro Digital y Tester ATX',
    duration: '12:15',
    phase: 'Fase Diagnóstico',
    youtubeId: 'ac7YMUcBiDA',
    summary: 'Guía práctica para técnicos de servicio: cómo puentear con seguridad el pin verde PS-ON, verificar rieles de +12V, +5V, +3.3V con el multímetro y comprender la tolerancia de ±5% y la señal Power Good (PG).',
    keyTimestamps: [
      { time: '01:40', title: 'Prueba del clip de papel entre pin PS-ON y tierra' },
      { time: '04:50', title: 'Medición con multímetro de la línea de standby +5VSB' },
      { time: '07:30', title: 'Verificación de tolerancia del riel de +12V' },
      { time: '10:05', title: 'Interpretación de errores comunes en testers digitales' }
    ],
    criticalRules: [
      'NUNCA abrir la carcasa metálica de la fuente: los condensadores primarios retienen voltajes letales de más de 300V.',
      'Verificar siempre que el multímetro esté en modo Voltios DC y no Amperios antes de tocar los pines.'
    ]
  },
  {
    id: 'video-mantenimiento-software',
    title: 'Mantenimiento Preventivo de Software: Optimización del SO, TRIM de SSDs y Reparación de Archivos',
    duration: '16:10',
    phase: 'Fase Lógica',
    youtubeId: 'bA4vKip4t1k',
    summary: 'Protocolo de consola para técnicos: ejecución metódica de SFC, DISM en línea, depuración de cachés de Windows, optimización de bloques NAND en unidades SSD y configuración de arranque limpio.',
    keyTimestamps: [
      { time: '02:00', title: 'Creación de Punto de Restauración antes de intervenir' },
      { time: '05:20', title: 'Secuencia estandarizada DISM + SFC para archivos de sistema' },
      { time: '09:40', title: 'Ejecución del comando TRIM para preservar rendimiento del SSD' },
      { time: '13:30', title: 'Limpieza profunda de repositorios de temporales y Prefetch' }
    ],
    criticalRules: [
      'NUNCA desfragmentar una unidad SSD: degrada los ciclos de escritura de las celdas sin aportar beneficio de velocidad.',
      'Asegurarse de tener conexión estable a Internet al ejecutar DISM para descargar binarios sanos de Windows Update.'
    ]
  }
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  // Fase 0: Seguridad
  {
    id: 'chk-01',
    phase: 'Fase 0: Seguridad',
    title: 'Desconexión eléctrica y drenaje de condensadores',
    detail: 'Desconectar cable de corriente AC de la pared y presionar el botón frontal de encendido por 10 segundos para descargar condensadores residuales de la fuente.',
    isMandatory: true,
    completed: true
  },
  {
    id: 'chk-02',
    phase: 'Fase 0: Seguridad',
    title: 'Equipamiento de protección ESD',
    detail: 'Colocación de pulsera antiestática conectada a tierra física y verificación de superficie disipativa en el banco de trabajo.',
    isMandatory: true,
    completed: true
  },
  {
    id: 'chk-03',
    phase: 'Fase 0: Seguridad',
    title: 'Inspección visual previa y registro fotográfico',
    detail: 'Fotografiar el estado estético inicial del equipo, cableado del panel frontal y puertos para resguardo y documentación.',
    isMandatory: false,
    completed: true
  },
  // Fase 1: Desensamble
  {
    id: 'chk-04',
    phase: 'Fase 1: Desensamble',
    title: 'Extracción de tapas laterales y filtros antipolvo',
    detail: 'Retiro cuidadoso de paneles de vidrio templado o metal; extracción de filtros magnéticos frontal, inferior y superior.',
    isMandatory: true,
    completed: false
  },
  {
    id: 'chk-05',
    phase: 'Fase 1: Desensamble',
    title: 'Extracción de tarjeta gráfica con liberación de seguro PCIe',
    detail: 'Retiro de tornillos del bracket trasero y desenganche suave de la traba plástica del zócalo PCIe antes de tirar de la GPU.',
    isMandatory: true,
    completed: false
  },
  {
    id: 'chk-06',
    phase: 'Fase 1: Desensamble',
    title: 'Desmontaje de módulos de memoria RAM',
    detail: 'Apertura de trabas de los slots DIMM y retiro de módulos sujetándolos exclusivamente por los bordes de la placa de circuito.',
    isMandatory: true,
    completed: false
  },
  {
    id: 'chk-07',
    phase: 'Fase 1: Desensamble',
    title: 'Desmontaje del conjunto de disipación de CPU',
    detail: 'Aflojar tornillos en cruz alternada. Si la pasta está pegada, realizar un giro suave lateral antes de tirar hacia arriba para no arrancar el procesador.',
    isMandatory: true,
    completed: false
  },
  // Fase 2: Limpieza y Térmica
  {
    id: 'chk-08',
    phase: 'Fase 2: Limpieza y Térmica',
    title: 'Soplado de polvo con aspas de ventiladores bloqueadas',
    detail: 'Uso de soplador antiestático bloqueando mecánicamente cada ventilador para prevenir corriente inversa en cabezales PWM.',
    isMandatory: true,
    completed: false
  },
  {
    id: 'chk-09',
    phase: 'Fase 2: Limpieza y Térmica',
    title: 'Limpieza química de pasta térmica antigua en CPU e IHS',
    detail: 'Aplicación de alcohol isopropílico al 99.8% con toalla de microfibra hasta que las superficies de cobre/níquel queden libres de residuos.',
    isMandatory: true,
    completed: false
  },
  {
    id: 'chk-10',
    phase: 'Fase 2: Limpieza y Térmica',
    title: 'Limpieza de contactos dorados de RAM y ranuras',
    detail: 'Frotado suave con goma de borrar blanca sobre contactos dorados y soplado con aire del zócalo DIMM.',
    isMandatory: true,
    completed: false
  },
  {
    id: 'chk-11',
    phase: 'Fase 2: Limpieza y Térmica',
    title: 'Lavado y secado exhaustivo de filtros antipolvo',
    detail: 'Lavado con agua corriente y jabón neutro de mallas magnéticas, asegurando secado total al 100% antes de reinstalar.',
    isMandatory: false,
    completed: false
  },
  {
    id: 'chk-12',
    phase: 'Fase 2: Limpieza y Térmica',
    title: 'Aplicación metódica de nueva pasta térmica',
    detail: 'Dosificación precisa según patrón en X o punto central sin exceder la cantidad recomendada para evitar desbordes periféricos.',
    isMandatory: true,
    completed: false
  },
  // Fase 3: Reensamble
  {
    id: 'chk-13',
    phase: 'Fase 3: Reensamble',
    title: 'Fijación del disipador con par de apriete simétrico en cruz',
    detail: 'Ajustar los tornillos media vuelta cada uno en diagonal para garantizar presión uniforme sobre el die del procesador.',
    isMandatory: true,
    completed: false
  },
  {
    id: 'chk-14',
    phase: 'Fase 3: Reensamble',
    title: 'Reinstalación de RAM en canales Dual Channel prioritarios',
    detail: 'Insertar en ranuras 2 y 4 (A2 y B2) aplicando presión firme hasta escuchar el doble clic audible del seguro.',
    isMandatory: true,
    completed: false
  },
  {
    id: 'chk-15',
    phase: 'Fase 3: Reensamble',
    title: 'Reinstalación de GPU y conexión de cables de alimentación',
    detail: 'Fijar sólidamente al chasis con tornillos para evitar curvatura del PCB y conectar cables PCIe individuales dedicados.',
    isMandatory: true,
    completed: false
  },
  {
    id: 'chk-16',
    phase: 'Fase 3: Reensamble',
    title: 'Enrutamiento y peinado de cables (Cable Management)',
    detail: 'Asegurar cables con precintos de velcro detrás del panel lateral para liberar el túnel principal de ventilación.',
    isMandatory: false,
    completed: false
  },
  // Fase 4: Software y Pruebas
  {
    id: 'chk-17',
    phase: 'Fase 4: Software y Pruebas',
    title: 'Comprobación de POST y confirmación en BIOS/UEFI',
    detail: 'Encendido inicial, acceso a BIOS para verificar reconocimiento de todos los discos, módulos de RAM y perfil XMP/EXPO activo.',
    isMandatory: true,
    completed: false
  },
  {
    id: 'chk-18',
    phase: 'Fase 4: Software y Pruebas',
    title: 'Ejecución de DISM y SFC para integridad del sistema operativo',
    detail: 'Correr en CMD como administrador: DISM /Online /Cleanup-Image /RestoreHealth y luego sfc /scannow.',
    isMandatory: true,
    completed: false
  },
  {
    id: 'chk-19',
    phase: 'Fase 4: Software y Pruebas',
    title: 'Optimización y ejecución de comando TRIM en SSDs',
    detail: 'Optimizar unidades desde la herramienta de desfragmentación de Windows asegurando que ejecute TRIM y no desfragmentación convencional.',
    isMandatory: true,
    completed: false
  },
  {
    id: 'chk-20',
    phase: 'Fase 4: Software y Pruebas',
    title: 'Prueba de estrés térmico de 15 minutos (Benchmarking)',
    detail: 'Monitorear temperaturas con HWiNFO64 bajo carga de Cinebench/FurMark y verificar que el delta térmico no supere los 80°C.',
    isMandatory: true,
    completed: false
  }
];

export const DEFAULT_REPORT: MaintenanceReport = {
  clientName: 'SIA Servicios TIC / Laboratorio de Pruebas',
  equipmentModel: 'Estación de Trabajo Profesional ATX Custom',
  serialNumber: 'ST-2026-PC9941',
  cpuModel: 'AMD Ryzen 7 7800X3D (8C/16T)',
  gpuModel: 'NVIDIA GeForce RTX 4070 Ti SUPER 16GB',
  ramCapacity: '32 GB DDR5 6000MHz CL30 (2x16GB)',
  storageType: 'SSD NVMe PCIe 4.0 2TB Kingston KC3000 + HDD 4TB Backup',
  technicianName: 'Ing. Certificado de Soporte Técnico',
  date: '2026-10-16',
  tempCpuIdleBefore: 48,
  tempCpuLoadBefore: 89,
  tempCpuIdleAfter: 36,
  tempCpuLoadAfter: 72,
  tempGpuLoadBefore: 81,
  tempGpuLoadAfter: 68,
  notes: 'Se encontró saturación severa de polvo en el radiador superior de 240mm y pasta térmica original completamente cristalizada. Se aplicó pasta térmica de alta conductividad mediante técnica de Cruz en X y se enrutaron los cables traseros para optimizar la presión positiva del chasis. Todas las pruebas de estabilidad fueron aprobadas con una reducción de 17°C en carga máxima.',
  recommendedNextMaintenanceDate: '2027-04-16'
};
