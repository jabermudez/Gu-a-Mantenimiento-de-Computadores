export type SectionId = 
  | 'introduccion'
  | 'taller'
  | 'seguridad' 
  | 'herramientas' 
  | 'motherboard'
  | 'protocolo-hardware' 
  | 'simulador-termico' 
  | 'simulador-flujo' 
  | 'sonda-psu' 
  | 'thermal-pads'
  | 'protocolo-software' 
  | 'diagnostico' 
  | 'procedimientos' 
  | 'glosario'
  | 'checklist';

export interface ToolItem {
  id: string;
  name: string;
  category: 'precision' | 'quimicos' | 'instrumentos' | 'seguridad';
  categoryLabel: string;
  specification: string;
  purpose: string;
  criticalWarning: string;
  iconName: string;
  usageTip: string;
}

export interface PsuPin {
  pin: number;
  name: string;
  color: string;
  voltage: string;
  nominalVoltage: number;
  toleranceMin: number;
  toleranceMax: number;
  description: string;
  criticalFor: string;
}

export interface TroubleshootingCase {
  id: string;
  symptom: string;
  category: 'energia' | 'video' | 'estabilidad' | 'almacenamiento' | 'temperatura';
  severity: 'Crítica' | 'Alta' | 'Moderada';
  likelyCauses: string[];
  diagnosticSteps: string[];
  recommendedSolution: string;
  preventionTip: string;
}

export interface VideoGuide {
  id: string;
  title: string;
  duration: string;
  phase: string;
  youtubeId: string;
  summary: string;
  keyTimestamps: { time: string; title: string }[];
  criticalRules: string[];
}

export interface ChecklistItem {
  id: string;
  phase: 'Fase 0: Seguridad' | 'Fase 1: Desensamble' | 'Fase 2: Limpieza y Térmica' | 'Fase 3: Reensamble' | 'Fase 4: Software y Pruebas';
  title: string;
  detail: string;
  isMandatory: boolean;
  completed: boolean;
}

export interface MaintenanceReport {
  clientName: string;
  equipmentModel: string;
  serialNumber: string;
  cpuModel: string;
  gpuModel: string;
  ramCapacity: string;
  storageType: string;
  technicianName: string;
  date: string;
  tempCpuIdleBefore: number;
  tempCpuLoadBefore: number;
  tempCpuIdleAfter: number;
  tempCpuLoadAfter: number;
  tempGpuLoadBefore: number;
  tempGpuLoadAfter: number;
  notes: string;
  recommendedNextMaintenanceDate: string;
}
