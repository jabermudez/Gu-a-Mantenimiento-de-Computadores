import React, { useState } from 'react';
import { soundFx } from '../utils/audio';
import { Layers, Disc, AlertTriangle, CheckCircle2, ShieldCheck, Thermometer } from 'lucide-react';

export const ThermalPadsAndBearings: React.FC = () => {
  const [selectedPadThickness, setSelectedPadThickness] = useState<number>(1.0);
  const [selectedBearing, setSelectedBearing] = useState<'sleeve' | 'ball' | 'fdb'>('fdb');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
          <Layers className="w-4 h-4 text-cyan-500" />
          <span>INGENIERÍA DE MATERIALES · TERMAL & MECÁNICA</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Guía de Almohadillas Térmicas (Thermal Pads) y Rodamientos de Ventiladores
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed max-w-4xl">
          Errores comunes como instalar un pad térmico de grosor incorrecto en una GPU o lubricar un ventilador FDB sellado con aceite convencional arruinan componentes costosos. Conoce las tolerancias exactas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Thermal Pads Thickness Guide */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm dark:shadow-cyan-950/20">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">VRAM, VRM & SSD M.2</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Calibrador de Almohadillas Térmicas</h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Las almohadillas térmicas no son universales. La tolerancia vertical entre el chip de memoria (GDDR6X) y la base de cobre del disipador suele ser de una fracción de milímetro.
          </p>

          {/* Interactive Thickness Selector */}
          <div>
            <label className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Seleccionar Grosor de Almohadilla:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0.5, 1.0, 1.5, 2.0].map(thickness => (
                <button
                  key={thickness}
                  onClick={() => {
                    soundFx.click();
                    setSelectedPadThickness(thickness);
                  }}
                  className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                    selectedPadThickness === thickness
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {thickness.toFixed(1)} mm
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Analysis for selected thickness */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-cyan-700 dark:text-cyan-400">GROSOR SELECCIONADO: {selectedPadThickness} mm</span>
              <span className="text-slate-500 dark:text-slate-400">Conductividad: 12.8 W/m·K</span>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
              {selectedPadThickness === 0.5 && (
                <span><strong>Uso Típico:</strong> SSDs M.2 ultradelgados en portátiles o backplates metálicos de tarjetas gráficas compactas. Si la holgura es mayor, no hará contacto.</span>
              )}
              {selectedPadThickness === 1.0 && (
                <span><strong>Uso Típico:</strong> El estándar más común para módulos VRAM frontales en GPUs RTX 30/40 y Radeon RX 6000/7000. Dureza recomendada Shore 00: 30-45.</span>
              )}
              {selectedPadThickness === 1.5 && (
                <span><strong>Uso Típico:</strong> Etapas de alimentación VRM (inductores Chokes y DrMOS) donde existe un escalón de altura con respecto a la VRAM.</span>
              )}
              {selectedPadThickness === 2.0 && (
                <span><strong>Uso Típico:</strong> Cara trasera de PCBs (Backplate térmico pasivo) para transferir calor desde el reverso de la GPU hacia la chapa exterior.</span>
              )}
            </div>
          </div>

          {/* Critical Warning Box */}
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-200 space-y-1.5">
            <div className="font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              Consecuencias de Elegir el Grosor Erróneo
            </div>
            <p className="leading-relaxed">
              • <strong>Si es demasiado grueso (+0.5mm):</strong> La almohadilla impide que el bloque de cobre haga contacto plano con el die del GPU, provocando que la temperatura escale instantáneamente a 105°C con apagado de emergencia (Hotspot Throttling).
              <br />
              • <strong>Si es demasiado fino (-0.5mm):</strong> Queda una bolsa de aire de micras; la memoria VRAM supera los 115°C y se degradan las celdas BGA.
            </p>
          </div>
        </div>

        {/* Right: Fan Bearing Types Comparison */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm dark:shadow-cyan-950/20">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <Disc className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">MECÁNICA DE FLUIDOS</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Comparativa de Rodamientos (Bearings)</h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            No todos los ventiladores pueden desmontarse para lubricación. Conocer el tipo de rodamiento previene averías prematuras y vibraciones resonantes en el chasis.
          </p>

          {/* Bearing Selector Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'sleeve', label: 'Sleeve (Buje)' },
              { id: 'ball', label: 'Dual Ball (Bolas)' },
              { id: 'fdb', label: 'Fluid Dynamic (FDB)' }
            ].map(b => (
              <button
                key={b.id}
                onClick={() => {
                  soundFx.click();
                  setSelectedBearing(b.id as 'sleeve' | 'ball' | 'fdb');
                }}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  selectedBearing === b.id
                    ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Deep info card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            {selectedBearing === 'sleeve' && (
              <>
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-amber-700 dark:text-amber-400">SLEEVE BEARING (BUJE DE BRONCE POROSO)</span>
                  <span className="text-slate-500 dark:text-slate-400">Vida útil: ~30,000 Horas</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Consiste en un eje de acero girando dentro de un manguito de bronce impregnado en aceite. Es económico y silencioso al inicio, pero si se monta en posición horizontal (techo), la gravedad expulsa el aceite, provocando chirridos en menos de 1 año.
                </p>
                <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  Mantenimiento: Se puede levantar el adhesivo trasero y aplicar 1 gota de aceite sintético ligero ISO VG 32.
                </div>
              </>
            )}

            {selectedBearing === 'ball' && (
              <>
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-cyan-700 dark:text-cyan-400">DUAL BALL BEARING (DOBLE RODAMIENTO DE BOLAS)</span>
                  <span className="text-slate-500 dark:text-slate-400">Vida útil: ~70,000 Horas</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Utiliza dos pistas con micro-bolas de acero de precisión. No le afecta la orientación (puede montarse en cualquier ángulo) y tolera altas temperaturas (hasta 70°C). Produce un zumbido metálico a altas RPM.
                </p>
                <div className="text-[11px] font-mono text-cyan-700 dark:text-cyan-400 font-bold">
                  Mantenimiento: Rodamientos sellados con grasa especial. No intentar desarmar; limpiar con aire comprimido.
                </div>
              </>
            )}

            {selectedBearing === 'fdb' && (
              <>
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-emerald-700 dark:text-emerald-400">FLUID DYNAMIC BEARING (FDB / HIDRODINÁMICO)</span>
                  <span className="text-slate-500 dark:text-slate-400">Vida útil: &gt;150,000 Horas</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  El pináculo de la ingeniería acústica y térmica. El eje flota sobre una película de aceite presurizada por estrías en espiga (herringbone grooves). Cero contacto metal-metal durante la rotación. Silencio absoluto y durabilidad superior a 15 años.
                </p>
                <div className="text-[11px] font-mono text-rose-700 dark:text-rose-400 font-bold">
                  ¡ADVERTENCIA! NUNCA intentar perforar la tapa para lubricar: el sistema está sellado al vacío magnéticamente.
                </div>
              </>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-300">
            <span className="font-bold text-amber-900 dark:text-white block mb-1">Regla de Oro en Chasis:</span>
            En la parte superior (techo) de gabinetes o radiadores de refrigeración líquida AIO, utiliza siempre ventiladores <strong>FDB o Dual Ball</strong>. Los ventiladores Sleeve económicos fallan prematuramente cuando se colocan mirando hacia abajo o arriba.
          </div>
        </div>
      </div>
    </div>
  );
};
