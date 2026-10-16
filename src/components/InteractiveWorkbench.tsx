import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';
import { 
  ShieldCheck, Wrench, Wind, RotateCw, Sparkles, CheckCircle2, 
  AlertTriangle, Play, RefreshCw, Zap, Cpu, ArrowRight, Check,
  Volume2, VolumeX, ShieldAlert, Award
} from 'lucide-react';

export const InteractiveWorkbench: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [soundMuted, setSoundMuted] = useState<boolean>(soundFx.isMuted());

  // Step 1: Capacitor discharge state
  const [step1CableRemoved, setStep1CableRemoved] = useState<boolean>(false);
  const [step1Voltage, setStep1Voltage] = useState<number>(320);
  const [step1Discharging, setStep1Discharging] = useState<boolean>(false);

  // Step 2: Fan safety state
  const [step2WedgePlaced, setStep2WedgePlaced] = useState<boolean>(false);
  const [step2DustCleared, setStep2DustCleared] = useState<boolean>(false);
  const [step2Warning, setStep2Warning] = useState<string | null>(null);

  // Step 3: Cooler removal state
  const [step3Twisted, setStep3Twisted] = useState<boolean>(false);
  const [step3Lifted, setStep3Lifted] = useState<boolean>(false);

  // Step 4: Chemical cleaning canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cleanPercentage, setCleanPercentage] = useState<number>(0);
  const isDrawingRef = useRef<boolean>(false);

  // Step 5: Thermal paste dispensing
  const [step5PatternApplied, setStep5PatternApplied] = useState<'dot' | 'cross' | null>(null);

  // Step 6: Screw torque order
  const [screwOrder, setScrewOrder] = useState<number[]>([]);
  const [screwTorqueError, setScrewTorqueError] = useState<string | null>(null);

  // Step 7: POST and Benchmarking
  const [postStage, setPostStage] = useState<'off' | 'cpu' | 'dram' | 'vga' | 'boot' | 'running' | 'done'>('off');
  const [liveTemp, setLiveTemp] = useState<number>(89);

  const toggleSound = () => {
    const isMuted = soundFx.toggleMute();
    setSoundMuted(isMuted);
  };

  // Step 1 discharge logic
  const handleHoldPowerButton = () => {
    if (!step1CableRemoved) {
      soundFx.click();
      return;
    }
    soundFx.discharge();
    setStep1Discharging(true);
    let v = 320;
    const interval = setInterval(() => {
      v = Math.max(0, v - 50);
      setStep1Voltage(v);
      if (v <= 0) {
        clearInterval(interval);
        setStep1Discharging(false);
        soundFx.success();
      }
    }, 120);
  };

  // Step 2 air blast
  const handleBlowAir = () => {
    if (!step2WedgePlaced) {
      soundFx.click();
      setStep2Warning('¡ALERTA CRÍTICA! No soples sin trabar las aspas. El giro induce fem inversa que quema los cabezales PWM.');
      return;
    }
    setStep2Warning(null);
    soundFx.airBlower();
    setStep2DustCleared(true);
    soundFx.success();
  };

  // Step 4 Canvas Setup (Cleaning old crusty paste)
  useEffect(() => {
    if (currentStep !== 4) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background shiny nickel CPU IHS
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // CPU Text
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('RYZEN 7 7800X3D', 24, 34);

    // Draw crusty dried paste layer
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(150, 150, 85, 0, Math.PI * 2);
    ctx.fill();

    // Crackle lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(110, 130);
    ctx.lineTo(190, 170);
    ctx.moveTo(130, 180);
    ctx.lineTo(170, 110);
    ctx.stroke();
  }, [currentStep]);

  // Clean canvas swipe handler
  const handleCanvasClean = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    setCleanPercentage(prev => {
      const next = Math.min(100, prev + 3);
      if (next >= 90 && prev < 90) {
        soundFx.success();
      }
      return next;
    });
  };

  // Step 6: Screw torque order checking
  const handleScrewClick = (screwNum: number) => {
    soundFx.ratchet();
    setScrewTorqueError(null);

    const nextOrder = [...screwOrder, screwNum];
    setScrewOrder(nextOrder);

    if (nextOrder.length === 4) {
      if ((nextOrder[0] === 1 && nextOrder[1] === 2) || (nextOrder[0] === 3 && nextOrder[1] === 4)) {
        soundFx.success();
      } else {
        setScrewTorqueError('¡Advertencia de torsión! Se recomienda apretar primero los extremos diagonales para balancear la carga.');
      }
    }
  };

  // Step 7: POST execution
  const startPostTest = () => {
    soundFx.relayClick();
    setPostStage('cpu');
    setTimeout(() => {
      soundFx.click();
      setPostStage('dram');
      setTimeout(() => {
        soundFx.click();
        setPostStage('vga');
        setTimeout(() => {
          soundFx.click();
          setPostStage('boot');
          setTimeout(() => {
            soundFx.success();
            setPostStage('running');
            let t = 89;
            const tempInterval = setInterval(() => {
              t = Math.max(71, t - 2);
              setLiveTemp(t);
              if (t <= 71) {
                clearInterval(tempInterval);
                setPostStage('done');
                confetti({ particleCount: 100, spread: 80 });
              }
            }, 80);
          }, 600);
        }, 500);
      }, 500);
    }, 500);
  };

  const resetAll = () => {
    setCurrentStep(1);
    setStep1CableRemoved(false);
    setStep1Voltage(320);
    setStep1Discharging(false);
    setStep2WedgePlaced(false);
    setStep2DustCleared(false);
    setStep2Warning(null);
    setStep3Twisted(false);
    setStep3Lifted(false);
    setCleanPercentage(0);
    setStep5PatternApplied(null);
    setScrewOrder([]);
    setScrewTorqueError(null);
    setPostStage('off');
    setLiveTemp(89);
  };

  return (
    <div className="bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors">
      {/* Background High-Tech Grid Accent */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Sound Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1">
            <Wrench className="w-4 h-4 text-cyan-500" />
            <span>SIMULADOR DE BANCO DE TRABAJO · WORKBENCH PRO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Laboratorio de Mantenimiento Paso a Paso
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-2xl">
            Ejecuta las 7 intervenciones críticas de un técnico certificado. Cada acción emite retroalimentación acústica procedural para interiorizar las normas de taller.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSound}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-colors ${
              soundMuted
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                : 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40 shadow-xs'
            }`}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-500" />}
            <span>{soundMuted ? 'Audio Mudo' : 'Efectos FX ON'}</span>
          </button>

          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reiniciar Misión</span>
          </button>
        </div>
      </div>

      {/* 7-Step Navigation Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {[
          { num: 1, label: '01. Descarga' },
          { num: 2, label: '02. Bloqueo' },
          { num: 3, label: '03. Giro Disipador' },
          { num: 4, label: '04. Limpieza IHS' },
          { num: 5, label: '05. Pasta Térmica' },
          { num: 6, label: '06. Torque en Cruz' },
          { num: 7, label: '07. POST & Carga' }
        ].map(step => {
          const isActive = currentStep === step.num;
          const isPassed = currentStep > step.num;
          return (
            <button
              key={step.num}
              onClick={() => {
                soundFx.click();
                setCurrentStep(step.num);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-cyan-50 dark:bg-cyan-500/20 border-cyan-500 text-cyan-900 dark:text-cyan-300 ring-1 ring-cyan-500/40 shadow-xs'
                  : isPassed
                  ? 'bg-emerald-50 dark:bg-slate-900 border-emerald-500/40 text-emerald-800 dark:text-emerald-400'
                  : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1 font-bold">
                <span>PASO {step.num}</span>
                {isPassed && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <div className="text-xs font-semibold truncate">
                {step.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Workbench Interactive Stage */}
      <div className="bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 min-h-[400px] flex flex-col justify-between">
        
        {/* STEP 1: CAPACITOR DISCHARGE */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  ETAPA 1 DE 7 · SEGURIDAD ELÉCTRICA
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Desconexión y Drenado de Condensadores Primarios
                </h3>
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                CONDENSADORES: <span className={step1Voltage === 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>{step1Voltage}V DC</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              Los condensadores electrolíticos principales de la fuente retienen carga mortal de más de 300V. Primero desenchufa el cable de la red eléctrica, luego presiona el botón frontal para drenar la energía residual a través de la lógica de la placa madre.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Interactive Visual */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center shadow-xs">
                <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                  <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                    step1Voltage === 0
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                      : 'border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 animate-pulse'
                  }`}>
                    <Zap className="w-8 h-8 mb-1" />
                    <span className="font-mono text-xl font-extrabold">{step1Voltage}V</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">
                      {step1Voltage === 0 ? 'DESCARGADO' : 'CARGA RESIDUAL'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                  {step1Voltage === 0 
                    ? '✓ Rieles a potencial seguro (0V). Puedes desmontar.'
                    : '⚠ Riesgo de descarga eléctrica o corto al tocar cabezales.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => {
                    soundFx.click();
                    setStep1CableRemoved(!step1CableRemoved);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    step1CableRemoved
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">PASO 1.1</div>
                    <div className="text-sm font-bold">1. Desconectar Cable de Poder AC</div>
                  </div>
                  {step1CableRemoved ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <div className="text-xs text-cyan-600 dark:text-cyan-400 font-mono font-bold">CLIC AQUÍ</div>}
                </button>

                <button
                  disabled={!step1CableRemoved || step1Voltage === 0 || step1Discharging}
                  onClick={handleHoldPowerButton}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    !step1CableRemoved
                      ? 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                      : step1Voltage === 0
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold border-cyan-400 shadow-md'
                  }`}
                >
                  <div>
                    <div className="text-xs font-mono opacity-80">PASO 1.2</div>
                    <div className="text-sm font-bold">
                      {step1Voltage === 0 ? 'Condensadores Drenados ✓' : step1Discharging ? 'Drenando...' : '2. Presionar Botón Power (10s)'}
                    </div>
                  </div>
                  <Zap className="w-5 h-5" />
                </button>

                {step1Voltage === 0 && (
                  <button
                    onClick={() => {
                      soundFx.click();
                      setCurrentStep(2);
                    }}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
                  >
                    <span>Continuar al Paso 2: Bloqueo de Ventiladores</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FAN BLADE BLOCKING */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  ETAPA 2 DE 7 · PROTECCIÓN ELECTROMAGNÉTICA
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Bloqueo Físico de Aspas y Soplado con Aire Antiestático
                </h3>
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                ESTADO: <span className={step2DustCleared ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>{step2DustCleared ? 'LIMPIO ✓' : 'CON POLVO'}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              ¡Peligro de inducción! Nunca dispares aire a un ventilador libre. Al girar a miles de RPM por el aire, se convierte en un generador e inyecta voltaje inverso de retorno a la placa madre. Traba las aspas primero con el spudger.
            </p>

            {step2Warning && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-xs text-rose-800 dark:text-rose-200">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                <span>{step2Warning}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Fan Graphic */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center shadow-xs">
                <div className="relative w-44 h-44 mb-3">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Fan Outer Frame */}
                    <rect x="5" y="5" width="90" height="90" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                    {/* Center Hub */}
                    <circle cx="50" cy="50" r="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                    {/* Fan Blades */}
                    <g className={!step2WedgePlaced && !step2DustCleared ? 'animate-spin' : ''} style={{ transformOrigin: '50px 50px', animationDuration: '4s' }}>
                      <path d="M 50 32 C 60 15, 75 15, 68 30 Z" fill={step2DustCleared ? '#38bdf8' : '#64748b'} />
                      <path d="M 68 50 C 85 60, 85 75, 70 68 Z" fill={step2DustCleared ? '#38bdf8' : '#64748b'} />
                      <path d="M 50 68 C 40 85, 25 85, 32 70 Z" fill={step2DustCleared ? '#38bdf8' : '#64748b'} />
                      <path d="M 32 50 C 15 40, 15 25, 30 32 Z" fill={step2DustCleared ? '#38bdf8' : '#64748b'} />
                    </g>
                    {/* Dust Overlay */}
                    {!step2DustCleared && (
                      <circle cx="50" cy="50" r="32" fill="#78716c" opacity="0.35" />
                    )}
                    {/* Spudger Wedge when placed */}
                    {step2WedgePlaced && (
                      <g>
                        <line x1="8" y1="20" x2="52" y2="40" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
                        <text x="12" y="16" fill="#f43f5e" fontSize="7" fontWeight="bold">TRABADO</text>
                      </g>
                    )}
                  </svg>
                </div>
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  {step2WedgePlaced ? '✓ Aspas bloqueadas mecánicamente' : 'Aspas libres (¡Bloquéalas antes de soplar!)'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => {
                    soundFx.click();
                    setStep2WedgePlaced(!step2WedgePlaced);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    step2WedgePlaced
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">ACCIÓN 2.1</div>
                    <div className="text-sm font-bold">
                      {step2WedgePlaced ? 'Cuña Antiestática Colocada ✓' : '1. Colocar Cuña / Trabar Aspas'}
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </button>

                <button
                  onClick={handleBlowAir}
                  className="w-full p-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold border border-cyan-400 transition-all flex items-center justify-between shadow-md"
                >
                  <div>
                    <div className="text-xs opacity-80 font-mono">ACCIÓN 2.2</div>
                    <div className="text-sm">2. Soplar Ráfaga de Aire Antiestático</div>
                  </div>
                  <Wind className="w-5 h-5" />
                </button>

                {step2DustCleared && (
                  <button
                    onClick={() => {
                      soundFx.click();
                      setCurrentStep(3);
                    }}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
                  >
                    <span>Continuar al Paso 3: Desmontaje de Disipador</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: COOLER TWIST REMOVAL */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  ETAPA 3 DE 7 · MECÁNICA Y PRESERVACIÓN DE PINES
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Técnica de Giro Lateral para Desmontar Disipador (Sockets PGA / LGA)
                </h3>
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                ADHESIÓN TÉRMICA: <span className={step3Twisted ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>{step3Twisted ? 'LIBERADA (GIRO 10°)' : 'PEGADA AL VACÍO'}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              ¡Regla de oro de taller! NUNCA tires hacia arriba en vertical si la pasta térmica está reseca. En procesadores PGA como AMD AM4, tirar en vertical arranca el procesador del zócalo con el seguro cerrado, partiendo pines. Debes girar 5° a 10° en plano horizontal.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Interactive Graphic */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center shadow-xs">
                <div className="relative w-48 h-36 flex items-center justify-center">
                  <div
                    className={`w-36 h-28 rounded-xl border-2 transition-transform duration-500 flex flex-col items-center justify-center ${
                      step3Lifted
                        ? '-translate-y-8 opacity-40 border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800'
                        : step3Twisted
                        ? 'rotate-6 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                        : 'border-cyan-500 bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    <Cpu className="w-8 h-8 text-cyan-600 dark:text-cyan-300 mb-1" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">DISIPADOR CPU</span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {step3Lifted ? 'DESMONTADO' : step3Twisted ? 'GIRO 10° OK' : 'BLOQUEADO'}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-2">
                  {step3Twisted 
                    ? '✓ Tensión de succión quebrada por cizallamiento' 
                    : 'Pasta térmica actuando como adhesivo de vacío'}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button
                  onClick={() => {
                    soundFx.ratchet();
                    setStep3Twisted(true);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    step3Twisted
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">ACCIÓN 3.1</div>
                    <div className="text-sm font-bold">1. Girar en Horizontal 5° a 10°</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Rompe el sello epóxico de pasta reseca</div>
                  </div>
                  <RotateCw className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </button>

                <button
                  disabled={!step3Twisted}
                  onClick={() => {
                    soundFx.success();
                    setStep3Lifted(true);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    !step3Twisted
                      ? 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                      : step3Lifted
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold shadow-md'
                  }`}
                >
                  <div>
                    <div className="text-xs opacity-80 font-mono">ACCIÓN 3.2</div>
                    <div className="text-sm font-bold">2. Alzar Disipador Suavemente</div>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {step3Lifted && (
                  <button
                    onClick={() => {
                      soundFx.click();
                      setCurrentStep(4);
                    }}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
                  >
                    <span>Continuar al Paso 4: Limpieza Química</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CHEMICAL CLEANING CANVAS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  ETAPA 4 DE 7 · LIMPIEZA QUÍMICA DIELÉCTRICA
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Remoción de Pasta Térmica Reseca con Alcohol Isopropílico 99.8%
                </h3>
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                LIMPIEZA DE IHS: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{cleanPercentage}%</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              Pasa el ratón o desliza el dedo por el recuadro interactivo del IHS con el paño de microfibra humedecido en isopropílico para disolver la pasta térmica degradada hasta exponer el metal puro.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Interactive Canvas */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center shadow-xs">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  onMouseDown={() => (isDrawingRef.current = true)}
                  onMouseUp={() => (isDrawingRef.current = false)}
                  onMouseMove={(e) => {
                    if (isDrawingRef.current) handleCanvasClean(e);
                  }}
                  onTouchMove={handleCanvasClean}
                  className="rounded-xl shadow-inner cursor-crosshair touch-none border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
                  Arrastra sobre la mancha gris para frotar con microfibra
                </span>
              </div>

              {/* Progress and status */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600 dark:text-slate-400">Pureza Superficial IHS</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">{cleanPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-150"
                      style={{ width: `${cleanPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-slate-900/60 border border-cyan-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-cyan-800 dark:text-emerald-400 block mb-1">
                    ¿Por qué 99.8% de Pureza?
                  </span>
                  El alcohol de 70% medicinal contiene 30% de agua con sales. En menos de 20 minutos de energizado genera sulfatación en los componentes SMD que rodean al chip.
                </div>

                {cleanPercentage >= 90 && (
                  <button
                    onClick={() => {
                      soundFx.click();
                      setCurrentStep(5);
                    }}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
                  >
                    <span>Continuar al Paso 5: Dosificación de Pasta</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: THERMAL PASTE DISPENSING */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  ETAPA 5 DE 7 · INTERFAZ TÉRMICA
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Dosificación Precisa de Compuesto Térmico (&gt;8.5 W/m·K)
                </h3>
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                PATRÓN: <span className="text-cyan-600 dark:text-cyan-400 font-bold">{step5PatternApplied ? step5PatternApplied.toUpperCase() : 'PENDIENTE'}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              Elige el método de aplicación. Para el socket AM5 y procesadores rectangulares modernos, la Cruz en X ofrece cobertura simétrica en los extremos donde se concentran los núcleos (CCD) descentralizados.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Graphic IHS */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center shadow-xs">
                <div className="relative w-44 h-44 bg-slate-200 dark:bg-slate-700 rounded-2xl border-4 border-slate-300 dark:border-slate-600 flex items-center justify-center shadow-inner">
                  {step5PatternApplied === 'dot' && (
                    <div className="w-10 h-10 bg-slate-600 rounded-full shadow-md animate-scale" />
                  )}
                  {step5PatternApplied === 'cross' && (
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <div className="absolute w-28 h-2.5 bg-slate-600 rounded-full rotate-45 shadow-md" />
                      <div className="absolute w-28 h-2.5 bg-slate-600 rounded-full -rotate-45 shadow-md" />
                    </div>
                  )}
                  {!step5PatternApplied && (
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">IHS LIMPIO</span>
                  )}
                </div>
              </div>

              {/* Pattern Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    soundFx.click();
                    setStep5PatternApplied('cross');
                    soundFx.success();
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    step5PatternApplied === 'cross'
                      ? 'bg-cyan-50 dark:bg-cyan-500/20 border-cyan-500 text-cyan-900 dark:text-cyan-300 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs text-cyan-600 dark:text-cyan-400 font-mono font-bold">RECOMENDADO RYZEN AM5 / LGA1700</div>
                    <div className="text-sm font-bold">Patrón Cruz en X</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cubre los dies descentralizados sin crear bolsas de aire</div>
                  </div>
                  {step5PatternApplied === 'cross' && <Check className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
                </button>

                <button
                  onClick={() => {
                    soundFx.click();
                    setStep5PatternApplied('dot');
                    soundFx.success();
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    step5PatternApplied === 'dot'
                      ? 'bg-cyan-50 dark:bg-cyan-500/20 border-cyan-500 text-cyan-900 dark:text-cyan-300 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">MÉTODO CLÁSICO</div>
                    <div className="text-sm font-bold">Punto Central (Pea / Arveja)</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Ideal para zócalos cuadrados pequeños (AM4 / LGA1200)</div>
                  </div>
                  {step5PatternApplied === 'dot' && <Check className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
                </button>

                {step5PatternApplied && (
                  <button
                    onClick={() => {
                      soundFx.click();
                      setCurrentStep(6);
                    }}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
                  >
                    <span>Continuar al Paso 6: Secuencia de Torque</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: TORQUE EN CRUZ */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  ETAPA 6 DE 7 · APRIETE SIMÉTRICO
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Secuencia de Torque en Cruz de los 4 Tornillos del Cooler
                </h3>
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                TORNILLOS AJUSTADOS: <span className="text-cyan-600 dark:text-cyan-400 font-bold">{screwOrder.length}/4</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              Haz clic en los tornillos en orden diagonal cruzado (ej. Tornillo 1 con Tornillo 2 en diagonal, luego Tornillo 3 con Tornillo 4). Apretar un tornillo a fondo sin iniciar los otros tuerce el socket e interrumpe canales de memoria RAM.
            </p>

            {screwTorqueError && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <span>{screwTorqueError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Interactive Screw Plate */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center shadow-xs">
                <div className="relative w-48 h-48 bg-slate-100 dark:bg-slate-950 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-inner">
                  {/* Row Top */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleScrewClick(1)}
                      className={`w-11 h-11 rounded-full font-mono font-bold text-sm flex items-center justify-center transition-all ${
                        screwOrder.includes(1)
                          ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500 hover:scale-105'
                      }`}
                    >
                      {screwOrder.includes(1) ? '✓' : '1'}
                    </button>

                    <button
                      onClick={() => handleScrewClick(3)}
                      className={`w-11 h-11 rounded-full font-mono font-bold text-sm flex items-center justify-center transition-all ${
                        screwOrder.includes(3)
                          ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400'
                          : 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500 hover:scale-105'
                      }`}
                    >
                      {screwOrder.includes(3) ? '✓' : '3'}
                    </button>
                  </div>

                  {/* Center CPU Symbol */}
                  <div className="text-center font-mono text-[10px] text-slate-500 font-bold">
                    PRESIÓN HOMOGÉNEA
                  </div>

                  {/* Row Bottom */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleScrewClick(4)}
                      className={`w-11 h-11 rounded-full font-mono font-bold text-sm flex items-center justify-center transition-all ${
                        screwOrder.includes(4)
                          ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400'
                          : 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500 hover:scale-105'
                      }`}
                    >
                      {screwOrder.includes(4) ? '✓' : '4'}
                    </button>

                    <button
                      onClick={() => handleScrewClick(2)}
                      className={`w-11 h-11 rounded-full font-mono font-bold text-sm flex items-center justify-center transition-all ${
                        screwOrder.includes(2)
                          ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500 hover:scale-105'
                      }`}
                    >
                      {screwOrder.includes(2) ? '✓' : '2'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status and Next button */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">Orden de Ajuste Recomendado:</div>
                  <div className="font-mono text-cyan-700 dark:text-cyan-300 font-semibold">
                    Tornillo 1 (Sup. Izq) ➔ Tornillo 2 (Inf. Der en diagonal) ➔ Tornillo 3 (Sup. Der) ➔ Tornillo 4 (Inf. Izq)
                  </div>
                </div>

                {screwOrder.length >= 4 && (
                  <button
                    onClick={() => {
                      soundFx.click();
                      setCurrentStep(7);
                    }}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
                  >
                    <span>Continuar al Paso 7: Encendido POST & Benchmarking</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: POST & BENCHMARKING */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  ETAPA 7 DE 7 · DIAGNÓSTICO POST & CONTROL TÉRMICO
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Ciclo de Arranque POST y Validación de Temperaturas
                </h3>
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                TEMP BAJO CARGA: <span className={liveTemp <= 72 ? 'text-emerald-600 dark:text-emerald-400 font-bold text-base' : 'text-rose-600 dark:text-rose-400 font-bold text-base'}>{liveTemp}°C</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              Presiona el botón de encendido. Los 4 Debug LEDs de la placa madre probarán CPU, DRAM, VGA y BOOT en secuencia. Una vez superado el POST, el sistema ejecutará un test de estrés térmico automático para certificar la reducción de temperatura lograda.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Motherboard Debug LEDs Visual */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center shadow-xs">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-xs space-y-2">
                  <div className="text-[10px] font-mono text-slate-700 dark:text-slate-400 font-bold mb-2">DEBUG POST LEDS:</div>
                  {[
                    { key: 'cpu', label: 'CPU' },
                    { key: 'dram', label: 'DRAM (RAM)' },
                    { key: 'vga', label: 'VGA (GPU)' },
                    { key: 'boot', label: 'BOOT (DISCO)' }
                  ].map(led => {
                    const isLit = postStage === led.key || postStage === 'running' || postStage === 'done';
                    return (
                      <div key={led.key} className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{led.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full transition-colors ${
                            isLit ? 'bg-emerald-500 shadow-md shadow-emerald-500/50' : 'bg-slate-300 dark:bg-slate-800'
                          }`} />
                          <span className="text-[10px] text-slate-500 w-12 text-right">
                            {isLit ? 'OK' : 'OFF'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stress Benchmark Results */}
              <div className="space-y-4">
                {postStage === 'off' ? (
                  <button
                    onClick={startPostTest}
                    className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>Iniciar Encendido POST & Benchmarking</span>
                  </button>
                ) : postStage !== 'done' ? (
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-cyan-500/50 animate-pulse text-center shadow-xs">
                    <div className="text-xs font-mono text-cyan-700 dark:text-cyan-400 font-bold">EJECUTANDO TEST DE ESTRÉS...</div>
                    <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1">{liveTemp} °C</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Disipando carga térmica con nuevo compuesto en X</div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/60 text-center space-y-2 shadow-xs">
                    <div className="flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm">
                      <Award className="w-5 h-5" />
                      <span>¡AUDITORÍA Y MANTENIMIENTO CERTIFICADOS!</span>
                    </div>
                    <div className="text-xs text-slate-800 dark:text-slate-200">
                      Temperatura en carga reducida de <strong>89°C</strong> a <strong>71°C</strong> (<span className="text-emerald-700 dark:text-emerald-400 font-bold">-18°C Delta T</span>).
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      Equipo 100% operativo sin thermal throttling.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
