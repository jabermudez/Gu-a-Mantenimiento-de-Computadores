import React, { useState } from 'react';
import { PSU_24PIN_DATA } from '../data/maintenanceData';
import { PsuPin } from '../types/maintenance';
import { Zap, Activity, CheckCircle, AlertTriangle, Info, ToggleLeft, ToggleRight } from 'lucide-react';

export const PsuTester: React.FC = () => {
  const [selectedPinNumber, setSelectedPinNumber] = useState<number>(10); // Pin 10 (+12V1)
  const [isJumpStarted, setIsJumpStarted] = useState<boolean>(true); // PS_ON bridged to COM

  const activePin: PsuPin = PSU_24PIN_DATA.find(p => p.pin === selectedPinNumber) || PSU_24PIN_DATA[9];

  // Dynamic voltage reading simulation
  const getSimulatedReading = (pin: PsuPin): number => {
    if (!isJumpStarted && pin.pin !== 9) {
      return 0.00;
    }
    if (pin.nominalVoltage === 12.0) return 12.08;
    if (pin.nominalVoltage === 5.0) return 5.04;
    if (pin.nominalVoltage === 3.3) return 3.32;
    if (pin.nominalVoltage === -12.0) return -11.95;
    return 0.00;
  };

  const currentVoltageReading = getSimulatedReading(activePin);
  const isWithinTolerance = activePin.nominalVoltage === 0 
    ? true 
    : currentVoltageReading >= activePin.toleranceMin && currentVoltageReading <= activePin.toleranceMax;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
          <Zap className="w-4 h-4 text-cyan-500" />
          <span>INSTRUMENTACIÓN DE TALLER · DIAGNÓSTICO ELÉCTRICO ATX</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Sonda Interactiva de Voltajes de Fuente de Poder (ATX 24-Pin Pinout)
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed max-w-4xl">
          El conector principal ATX de 24 pines suministra las tensiones vitales para la placa base. Utiliza la sonda virtual para comprobar las tolerancias oficiales de la especificación ATX 3.0 (±5% para líneas positivas) y aprende la prueba del clip de banco.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Interactive 24-Pin Diagram */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm dark:shadow-cyan-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Mapeo de Pines del Conector ATX Molex 24-Pin
              </h3>
            </div>

            {/* Jump-start toggle switch */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Puente PS-ON:
              </span>
              <button
                onClick={() => setIsJumpStarted(!isJumpStarted)}
                className="flex items-center gap-1.5 text-xs font-bold font-mono transition-colors"
              >
                {isJumpStarted ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ToggleRight className="w-5 h-5 text-emerald-500" /> ACTIVO (Fuente ON)
                  </span>
                ) : (
                  <span className="text-slate-500 flex items-center gap-1">
                    <ToggleLeft className="w-5 h-5 text-slate-400" /> STANDBY (+5VSB)
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Interactive 24-Pin Socket Matrix */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800/90 flex flex-col items-center justify-center shadow-inner">
            <div className="text-xs text-slate-400 mb-4 font-mono text-center">
              Vista frontal de la clavija macho (Placa base) · Pasa el ratón o toca un pin
            </div>

            {/* 2 columns of 12 pins */}
            <div className="relative border-4 border-slate-700 bg-slate-900 p-4 rounded-xl shadow-2xl flex gap-6">
              
              {/* Latch clip representation on side */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-600 rounded-t-sm border border-slate-500" />

              {/* Column 1: Pins 1 to 12 */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-slate-400 text-center font-mono font-bold">Pines 1-12</span>
                {PSU_24PIN_DATA.slice(0, 12).map((pin) => {
                  const isSelected = pin.pin === selectedPinNumber;
                  return (
                    <button
                      key={pin.pin}
                      onClick={() => setSelectedPinNumber(pin.pin)}
                      onMouseEnter={() => setSelectedPinNumber(pin.pin)}
                      className={`w-14 h-9 rounded-md border flex items-center justify-between px-2 transition-all font-mono text-xs ${
                        isSelected
                          ? 'ring-2 ring-cyan-400 scale-105 z-10 border-white shadow-lg'
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                      style={{
                        backgroundColor: pin.color === '#111827' ? '#1f2937' : `${pin.color}25`,
                        color: pin.color === '#111827' ? '#cbd5e1' : pin.color
                      }}
                    >
                      <span className="font-bold text-[11px]">{pin.pin}</span>
                      <span className="text-[10px] font-semibold">{pin.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Column 2: Pins 13 to 24 */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-slate-400 text-center font-mono font-bold">Pines 13-24</span>
                {PSU_24PIN_DATA.slice(12, 24).map((pin) => {
                  const isSelected = pin.pin === selectedPinNumber;
                  return (
                    <button
                      key={pin.pin}
                      onClick={() => setSelectedPinNumber(pin.pin)}
                      onMouseEnter={() => setSelectedPinNumber(pin.pin)}
                      className={`w-14 h-9 rounded-md border flex items-center justify-between px-2 transition-all font-mono text-xs ${
                        isSelected
                          ? 'ring-2 ring-cyan-400 scale-105 z-10 border-white shadow-lg'
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                      style={{
                        backgroundColor: pin.color === '#111827' ? '#1f2937' : `${pin.color}25`,
                        color: pin.color === '#111827' ? '#cbd5e1' : pin.color
                      }}
                    >
                      <span className="font-bold text-[11px]">{pin.pin}</span>
                      <span className="text-[10px] font-semibold">{pin.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Jump start explanation ribbon */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5 max-w-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span>
                <strong>Prueba del Clip:</strong> Une el <strong>Pin 16 (PS_ON Verde)</strong> con el <strong>Pin 17 (COM Negro)</strong> con un clip metálico doblado para encender la fuente de poder en banco sin placa madre.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Virtual True-RMS Multimeter Display & Pin Specs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Virtual Multimeter LCD Display */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-cyan-950/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-400">
                <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>MULTÍMETRO DIGITAL TRUE RMS</span>
              </div>
              <span className="text-[10px] font-mono bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800 font-bold">
                AUTO-RANGO DCV
              </span>
            </div>

            {/* High-Tech LCD Screen */}
            <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-2xl p-5 shadow-inner">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">
                  PIN #{activePin.pin} · {activePin.name}
                </span>
                <span className="text-xs font-mono text-emerald-500 font-semibold">
                  DC VOLTAGE
                </span>
              </div>

              <div className="my-3 flex items-baseline justify-center gap-2">
                <span className="text-4xl sm:text-5xl font-mono font-extrabold text-emerald-300 tracking-wider tabular-nums">
                  {currentVoltageReading.toFixed(2)}
                </span>
                <span className="text-2xl font-mono font-bold text-emerald-400">
                  V
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-emerald-900/50 text-emerald-400/90">
                <span>NOMINAL: {activePin.nominalVoltage}V</span>
                <span>
                  TOLERANCIA: {activePin.nominalVoltage === 0 ? 'N/A' : `${activePin.toleranceMin}V - ${activePin.toleranceMax}V`}
                </span>
              </div>
            </div>

            {/* Tolerance Status Badge */}
            <div className="mt-4 flex items-center justify-between text-xs p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Estado de Riel ATX 3.0:</span>
              <div className="flex items-center gap-1.5 font-bold font-mono">
                {isWithinTolerance ? (
                  <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> DENTRO DE TOLERANCIA (±5%)
                  </span>
                ) : (
                  <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> FUERA DE NORMA (REVISAR)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Active Pin Detailed Technical Information */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-cyan-950/20">
            <div>
              <div className="text-xs text-cyan-600 dark:text-cyan-400 font-mono font-bold">
                PIN SELECCIONADO #{activePin.pin}
              </div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                {activePin.name} ({activePin.voltage})
              </h4>
            </div>

            <div>
              <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Descripción Funcional
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activePin.description}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-slate-800">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block mb-1">
                Crítico Para:
              </span>
              <p className="text-xs text-slate-800 dark:text-slate-300">
                {activePin.criticalFor}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
