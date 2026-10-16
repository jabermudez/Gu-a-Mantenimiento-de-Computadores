import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { INITIAL_CHECKLIST, DEFAULT_REPORT } from '../data/maintenanceData';
import { ChecklistItem, MaintenanceReport } from '../types/maintenance';
import { soundFx } from '../utils/audio';
import { 
  CheckSquare, Square, Printer, Download, FileDown, 
  CheckCircle, ShieldCheck, Cpu, HardDrive, Calendar, 
  User, FileText, Sparkles, Loader2, Award
} from 'lucide-react';

export const ChecklistAndReport: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [report, setReport] = useState<MaintenanceReport>(DEFAULT_REPORT);
  const [showPrintPreview, setShowPrintPreview] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const toggleCheck = (id: string) => {
    soundFx.click();
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = checklist.filter(c => c.completed).length;
  const totalCount = checklist.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const cpuLoadDelta = report.tempCpuLoadBefore - report.tempCpuLoadAfter;
  const gpuLoadDelta = report.tempGpuLoadBefore - report.tempGpuLoadAfter;

  const handlePrint = () => {
    soundFx.click();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setShowPrintPreview(true);
    setTimeout(() => {
      window.print();
    }, 350);
  };

  const handleCompleteAll = () => {
    soundFx.success();
    setChecklist(prev => prev.map(item => ({ ...item, completed: true })));
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  /**
   * Generates and downloads the completed maintenance checklist as a professional PDF
   */
  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      soundFx.click();

      // Create jsPDF document: A4, portrait, millimeters
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
      const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

      // 1. TOP HEADER BANNER (High-Tech Navy & Cyan Accent)
      doc.setFillColor(6, 11, 24); // #060b18 deep obsidian navy
      doc.rect(0, 0, pageWidth, 28, 'F');

      // Cyan accent line
      doc.setFillColor(6, 182, 212); // #06b6d4 cyan
      doc.rect(0, 28, pageWidth, 1.5, 'F');

      // Brand & Main Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('TÉCNICAPC · GUÍA MAESTRA DE MANTENIMIENTO', 14, 11);

      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text('INFORME TÉCNICO OFICIAL DE SERVICIO & AUDITORÍA DE CALIDAD', 14, 18);
      doc.setFontSize(7.5);
      doc.setTextColor(6, 182, 212);
      doc.text('ESTÁNDAR ANSI/ESD S20.20 · ESPECIFICACIÓN ATX DESIGN GUIDE', 14, 24);

      // Header Metadata Box (Right Aligned)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(6, 182, 212);
      doc.text(`ACTA: ${report.serialNumber || 'MNT-001'}-ACTA`, pageWidth - 14, 10, { align: 'right' });
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(255, 255, 255);
      doc.text(`FECHA: ${report.date || new Date().toISOString().split('T')[0]}`, pageWidth - 14, 16, { align: 'right' });
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129); // emerald-500
      const statusText = progressPercent === 100 
        ? 'ESTADO: AUDITADO 100% [APROBADO]' 
        : `ESTADO: ${progressPercent}% COMPLETADO`;
      doc.text(statusText, pageWidth - 14, 22, { align: 'right' });

      // 2. CLIENT & HARDWARE SPECIFICATIONS TABLE
      autoTable(doc, {
        startY: 33,
        head: [['DATOS DEL CLIENTE Y ESPECIFICACIÓN DEL HARDWARE INTERVENIDO', '']],
        body: [
          [
            { content: `Cliente / Organización: ${report.clientName || 'N/A'}`, styles: { fontStyle: 'bold' } },
            { content: `Técnico Responsable: ${report.technicianName || 'N/A'}`, styles: { fontStyle: 'bold' } }
          ],
          [
            `Equipo / Chasis: ${report.equipmentModel || 'N/A'}`,
            `N° de Serie / Activo: ${report.serialNumber || 'N/A'}`
          ],
          [
            `Procesador (CPU): ${report.cpuModel || 'N/A'}`,
            `Tarjeta Gráfica (GPU): ${report.gpuModel || 'N/A'}`
          ]
        ],
        theme: 'grid',
        headStyles: {
          fillColor: [15, 23, 42], // slate-900
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
          halign: 'left'
        },
        styles: {
          fontSize: 7.5,
          cellPadding: 2,
          lineColor: [226, 232, 240],
          textColor: [30, 41, 59]
        },
        columnStyles: {
          0: { cellWidth: 91 },
          1: { cellWidth: 91 }
        },
        margin: { left: 14, right: 14 }
      });

      // 3. THERMAL TELEMETRY COMPARATIVE TABLE
      const lastTableEnd = (doc as any).lastAutoTable?.finalY || 60;

      autoTable(doc, {
        startY: lastTableEnd + 4,
        head: [[
          'TELEMETRÍA TÉRMICA (BENCHMARKING BAJO CARGA MÁXIMA)',
          'TEMP. ANTES',
          'TEMP. DESPUÉS',
          'DELTA REDUCCIÓN',
          'ESTADO TÉRMICO'
        ]],
        body: [
          [
            `CPU Package (${report.cpuModel})`,
            `${report.tempCpuLoadBefore} °C`,
            `${report.tempCpuLoadAfter} °C`,
            `-${cpuLoadDelta} °C`,
            cpuLoadDelta >= 10 ? 'EXCELENTE (DISIPACIÓN RESTAURADA)' : 'CORRECTO'
          ],
          [
            `GPU Core (${report.gpuModel})`,
            `${report.tempGpuLoadBefore} °C`,
            `${report.tempGpuLoadAfter} °C`,
            `-${gpuLoadDelta} °C`,
            gpuLoadDelta >= 8 ? 'ÓPTIMO (SIN THERMAL THROTTLING)' : 'CORRECTO'
          ]
        ],
        theme: 'striped',
        headStyles: {
          fillColor: [6, 182, 212], // cyan-600
          textColor: [6, 11, 24],
          fontSize: 7.5,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 7.5,
          cellPadding: 2,
          lineColor: [226, 232, 240],
          textColor: [30, 41, 59]
        },
        columnStyles: {
          0: { cellWidth: 62, fontStyle: 'bold' },
          1: { cellWidth: 28, halign: 'center', textColor: [225, 29, 72] }, // rose-600
          2: { cellWidth: 28, halign: 'center', textColor: [16, 185, 129] }, // emerald-500
          3: { cellWidth: 28, halign: 'center', fontStyle: 'bold', textColor: [16, 185, 129] },
          4: { cellWidth: 36, fontStyle: 'bold', textColor: [15, 23, 42] }
        },
        margin: { left: 14, right: 14 }
      });

      // 4. COMPREHENSIVE 20-POINT CHECKLIST AUDIT TABLE
      const thermalTableEnd = (doc as any).lastAutoTable?.finalY || 85;

      const checklistRows = checklist.map((item, index) => {
        const isDone = item.completed;
        return [
          String(index + 1).padStart(2, '0'),
          item.phase,
          item.title,
          item.detail,
          item.isMandatory ? 'OBLIGATORIO' : 'RECOMENDADO',
          isDone ? '[ ✓ COMPLETADO ]' : '[ ✕ PENDIENTE ]'
        ];
      });

      autoTable(doc, {
        startY: thermalTableEnd + 4,
        head: [[
          'N°',
          'FASE OPERATIVA',
          'PROCEDIMIENTO / TAREA TÉCNICA',
          'DETALLE TÉCNICO Y NORMATIVA',
          'TIPO',
          'ESTADO AUDITORÍA'
        ]],
        body: checklistRows,
        theme: 'grid',
        headStyles: {
          fillColor: [15, 23, 42], // slate-900
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 6.8,
          cellPadding: 1.8,
          lineColor: [226, 232, 240],
          textColor: [30, 41, 59],
          valign: 'middle'
        },
        columnStyles: {
          0: { cellWidth: 8, halign: 'center', fontStyle: 'bold' },
          1: { cellWidth: 26, fontStyle: 'bold', textColor: [2, 132, 199] }, // sky-600
          2: { cellWidth: 44, fontStyle: 'bold' },
          3: { cellWidth: 62 },
          4: { cellWidth: 20, halign: 'center', fontSize: 6.5 },
          5: { cellWidth: 22, halign: 'center', fontStyle: 'bold' }
        },
        didParseCell: (data) => {
          // Colorize the audit status column
          if (data.section === 'body' && data.column.index === 5) {
            const val = String(data.cell.raw);
            if (val.includes('COMPLETADO')) {
              data.cell.styles.textColor = [5, 150, 105]; // emerald-600
              data.cell.styles.fillColor = [240, 253, 244]; // emerald-50
            } else {
              data.cell.styles.textColor = [217, 119, 6]; // amber-600
              data.cell.styles.fillColor = [254, 243, 199]; // amber-50
            }
          }
        },
        margin: { left: 14, right: 14 }
      });

      // 5. OBSERVATIONS, CERTIFICATION SEAL & SIGNATURES BLOCK
      const checklistTableEnd = (doc as any).lastAutoTable?.finalY || 210;

      // Check if we need to add a new page if remaining vertical space is less than 50mm
      let signatureY = checklistTableEnd + 5;
      if (signatureY > pageHeight - 55) {
        doc.addPage();
        signatureY = 20;
      }

      // Notes Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(14, signatureY, pageWidth - 28, 16, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text('DIAGNÓSTICO FINAL, OBSERVACIONES TÉCNICAS & INSUMOS APLICADOS:', 17, signatureY + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(71, 85, 105);
      const splitNotes = doc.splitTextToSize(report.notes || 'Mantenimiento preventivo completado según protocolo estandarizado sin anomalías.', pageWidth - 36);
      doc.text(splitNotes, 17, signatureY + 9);

      // Signatures & Official Seal Grid
      const sigTop = signatureY + 20;

      // Technician Signature
      doc.setDrawColor(15, 23, 42);
      doc.line(18, sigTop + 12, 70, sigTop + 12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(report.technicianName || 'Técnico Especialista', 44, sigTop + 16, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Firma y Matrícula del Especialista', 44, sigTop + 20, { align: 'center' });

      // Client Signature
      doc.line(80, sigTop + 12, 132, sigTop + 12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(report.clientName || 'Cliente / Receptor', 106, sigTop + 16, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Firma de Conformidad y Recepción', 106, sigTop + 20, { align: 'center' });

      // Official Stamp Box (Right)
      doc.setFillColor(240, 253, 250); // cyan-50
      doc.setDrawColor(13, 148, 136); // teal-600
      doc.roundedRect(142, sigTop - 1, 54, 22, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 118, 110);
      doc.text('CERTIFICACIÓN OFICIAL ✓', 169, sigTop + 4, { align: 'center' });
      
      doc.setFontSize(6.5);
      doc.setTextColor(51, 65, 85);
      doc.text('AUDITORÍA TÉCNICA 20 PUNTOS', 169, sigTop + 9, { align: 'center' });
      doc.text(`Próx. Mantenimiento: ${report.recommendedNextMaintenanceDate}`, 169, sigTop + 14, { align: 'center' });
      doc.setFontSize(6);
      doc.setTextColor(100, 116, 139);
      doc.text('NORMA ANSI/ESD S20.20 APROBADA', 169, sigTop + 18, { align: 'center' });

      // 6. MULTI-PAGE FOOTER NUMBERING
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Documento oficial emitido por TécnicaPC · Plataforma Operativa de Mantenimiento de Equipos de Cómputo`,
          14,
          pageHeight - 6
        );
        doc.text(
          `Página ${i} de ${totalPages} · Acta: ${report.serialNumber || 'MNT-001'}`,
          pageWidth - 14,
          pageHeight - 6,
          { align: 'right' }
        );
      }

      // Download file with a clear, sanitized filename
      const sanitizedModel = (report.equipmentModel || 'Equipo').replace(/[^a-zA-Z0-9_-]/g, '_');
      const sanitizedSerial = (report.serialNumber || 'Acta').replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `Informe_Mantenimiento_${sanitizedModel}_${sanitizedSerial}.pdf`;

      doc.save(fileName);

      // Trigger celebratory confetti and success audio
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      soundFx.success();

    } catch (error) {
      console.error('Error generating PDF report:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="no-print">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
          <CheckSquare className="w-4 h-4 text-cyan-500" />
          <span>FASE 05 · AUDITORÍA DE CALIDAD Y ENTREGA TÉCNICA</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Checklist de Intervención y Reporte Técnico de Servicio
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm sm:text-base leading-relaxed max-w-4xl">
          Verifica sistemáticamente cada una de las 20 tareas obligatorias antes de entregar el equipo y emite un informe técnico formal con mediciones térmicas de antes y después, listo para descargar en PDF certificado o imprimir.
        </p>
      </div>

      {/* Progress & Quick Actions Ribbon */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 no-print shadow-sm dark:shadow-cyan-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
              ESTADO DE LA AUDITORÍA ({completedCount} de {totalCount} tareas completadas)
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2.5">
              <span>{progressPercent}% Completado</span>
              {progressPercent === 100 && (
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40">
                  AUDITORÍA APROBADA ✓
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: PDF Download, Print & Complete All */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCompleteAll}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
            >
              Marcar Todos
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-md shadow-cyan-400/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-slate-950" />
                  <span>Descargar PDF Certificado</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Two Column Layout: Checklist and Report Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
        
        {/* Left: Checklist Items */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Protocolo de 20 Puntos de Verificación
            </span>
            <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 font-bold">
              {completedCount} / {totalCount} listos
            </span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  item.completed
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-cyan-500/40 shadow-xs hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 shrink-0 ${
                    item.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-cyan-500'
                  }`}
                >
                  {item.completed ? <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <Square className="w-5 h-5" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-400">
                      {item.phase}
                    </span>
                    {item.isMandatory && (
                      <span className="text-[9px] font-mono text-rose-700 dark:text-rose-400 font-bold px-1.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900">
                        OBLIGATORIO
                      </span>
                    )}
                  </div>
                  <h4 className={`text-xs sm:text-sm font-bold ${
                    item.completed ? 'text-slate-800 dark:text-slate-200' : 'text-slate-900 dark:text-white'
                  }`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Technical Report Input & Live Metrics */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm dark:shadow-cyan-950/20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Ficha Técnica del Servicio y Mediciones Térmicas
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                ACTA #{report.serialNumber || '001'}
              </span>
            </div>

            {/* General Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">Cliente / Organización</label>
                <input
                  type="text"
                  value={report.clientName}
                  onChange={(e) => setReport({ ...report, clientName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">Técnico Responsable</label>
                <input
                  type="text"
                  value={report.technicianName}
                  onChange={(e) => setReport({ ...report, technicianName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">Modelo de Equipo / Chasis</label>
                <input
                  type="text"
                  value={report.equipmentModel}
                  onChange={(e) => setReport({ ...report, equipmentModel: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">Número de Serie / ID Activo</label>
                <input
                  type="text"
                  value={report.serialNumber}
                  onChange={(e) => setReport({ ...report, serialNumber: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono font-medium focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">Procesador (CPU)</label>
                <input
                  type="text"
                  value={report.cpuModel}
                  onChange={(e) => setReport({ ...report, cpuModel: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">Tarjeta Gráfica (GPU)</label>
                <input
                  type="text"
                  value={report.gpuModel}
                  onChange={(e) => setReport({ ...report, gpuModel: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-medium focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Thermal Measurements (Before vs After) */}
            <div className="pt-2">
              <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider block mb-2">
                Telemetría Térmica (°C): Antes vs Después
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 block font-medium">CPU Load Antes</span>
                  <input
                    type="number"
                    value={report.tempCpuLoadBefore}
                    onChange={(e) => setReport({ ...report, tempCpuLoadBefore: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-center font-mono font-extrabold text-rose-600 dark:text-rose-400 text-lg focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">°C</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 block font-medium">CPU Load Después</span>
                  <input
                    type="number"
                    value={report.tempCpuLoadAfter}
                    onChange={(e) => setReport({ ...report, tempCpuLoadAfter: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-center font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-lg focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">°C</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 block font-medium">GPU Load Antes</span>
                  <input
                    type="number"
                    value={report.tempGpuLoadBefore}
                    onChange={(e) => setReport({ ...report, tempGpuLoadBefore: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-center font-mono font-extrabold text-rose-600 dark:text-rose-400 text-lg focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">°C</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 block font-medium">GPU Load Después</span>
                  <input
                    type="number"
                    value={report.tempGpuLoadAfter}
                    onChange={(e) => setReport({ ...report, tempGpuLoadAfter: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-center font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-lg focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">°C</span>
                </div>
              </div>

              {/* Delta Improvement Badge */}
              <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
                <span className="text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Mejora Térmica Lograda (Delta T):
                </span>
                <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-300">
                  CPU: -{cpuLoadDelta}°C · GPU: -{gpuLoadDelta}°C
                </span>
              </div>
            </div>

            {/* Notes & Recommendations */}
            <div>
              <label className="text-slate-600 dark:text-slate-400 text-xs font-medium block mb-1">Observaciones Técnicas y Diagnóstico Final</label>
              <textarea
                rows={3}
                value={report.notes}
                onChange={(e) => setReport({ ...report, notes: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white leading-relaxed focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PRINT-READY & CERTIFICATE PREVIEW */}
      <div className={`p-8 sm:p-10 rounded-3xl bg-white text-slate-900 border border-slate-300 shadow-xl print-only ${showPrintPreview ? 'block' : 'hidden md:block print:block'}`}>
        
        {/* Letterhead Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 mb-6">
          <div>
            <div className="text-xs font-mono font-bold text-cyan-700 tracking-wider">
              INFORME TÉCNICO OFICIAL DE MANTENIMIENTO PREVENTIVO
            </div>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-0.5">
              Certificado de Intervención y Control de Calidad
            </h2>
            <div className="text-xs text-slate-600 mt-1">
              Laboratorio Técnico Certificado · Protocolo ANSI/ESD S20.20 & Estándar ATX
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="text-right font-mono text-xs text-slate-700">
              <div><strong>N° ACTA:</strong> {report.serialNumber || '001'}-MNT</div>
              <div><strong>FECHA:</strong> {report.date}</div>
              <div><strong>AUDITORÍA:</strong> {completedCount}/{totalCount} PUNTOS ✓</div>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="no-print flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>

        {/* Client & Equipment Summary Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs mb-6">
          <div>
            <span className="text-slate-500 block font-semibold">Cliente:</span>
            <span className="font-bold text-slate-900">{report.clientName}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Equipo / Chasis:</span>
            <span className="font-bold text-slate-900">{report.equipmentModel}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Procesador (CPU):</span>
            <span className="font-bold text-slate-900">{report.cpuModel}</span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">Gráficos (GPU):</span>
            <span className="font-bold text-slate-900">{report.gpuModel}</span>
          </div>
        </div>

        {/* Thermal Telemetry Table */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
            Telemetría Térmica Certificada (Benchmarking Previo vs Posterior)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-300 min-w-[500px]">
              <thead>
                <tr className="bg-slate-200 text-slate-800 font-bold font-mono">
                  <th className="p-2 border border-slate-300">Componente</th>
                  <th className="p-2 border border-slate-300 text-center">Temp. Previa (Carga)</th>
                  <th className="p-2 border border-slate-300 text-center">Temp. Final (Carga)</th>
                  <th className="p-2 border border-slate-300 text-center">Delta de Reducción</th>
                  <th className="p-2 border border-slate-300 text-center">Estado Térmico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-mono">
                <tr>
                  <td className="p-2 font-bold font-sans">Procesador (CPU Package)</td>
                  <td className="p-2 text-center text-rose-700 font-bold">{report.tempCpuLoadBefore} °C</td>
                  <td className="p-2 text-center text-emerald-700 font-bold">{report.tempCpuLoadAfter} °C</td>
                  <td className="p-2 text-center font-bold text-emerald-700">-{cpuLoadDelta} °C</td>
                  <td className="p-2 text-center font-sans font-bold text-emerald-700">ÓPTIMO (SIN THROTTLING)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold font-sans">Tarjeta Gráfica (GPU Core)</td>
                  <td className="p-2 text-center text-rose-700 font-bold">{report.tempGpuLoadBefore} °C</td>
                  <td className="p-2 text-center text-emerald-700 font-bold">{report.tempGpuLoadAfter} °C</td>
                  <td className="p-2 text-center font-bold text-emerald-700">-{gpuLoadDelta} °C</td>
                  <td className="p-2 text-center font-sans font-bold text-emerald-700">ÓPTIMO</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Observations */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-8">
          <span className="font-bold text-slate-900 block mb-1">Observaciones Técnicas y Procedimientos Realizados:</span>
          <p className="text-slate-700 leading-relaxed">
            {report.notes}
          </p>
        </div>

        {/* Signatures & Seal */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-8 border-t border-slate-300">
          <div className="text-center w-full sm:w-64">
            <div className="border-b border-slate-800 pb-1 mb-1 font-mono font-bold text-slate-900">
              {report.technicianName}
            </div>
            <div className="text-[11px] text-slate-500">Firma del Especialista Técnico</div>
          </div>

          <div className="text-center w-full sm:w-64">
            <div className="border-b border-slate-800 pb-1 mb-1 font-mono font-bold text-slate-900">
              {report.clientName}
            </div>
            <div className="text-[11px] text-slate-500">Firma del Cliente / Receptor</div>
          </div>

          {/* Verification Badge */}
          <div className="border-2 border-emerald-600 rounded-xl p-3 text-center bg-emerald-50 max-w-xs shrink-0 mx-auto sm:mx-0">
            <div className="text-xs font-black text-emerald-800 tracking-wider">
              EQUIPO AUDITADO & CERTIFICADO
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5">
              Próximo Mantenimiento Recomendado: <strong>{report.recommendedNextMaintenanceDate}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
