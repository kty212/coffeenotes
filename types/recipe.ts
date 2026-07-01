export interface PouringStep {
  timeSeconds: number;
  pourGrams: number;
  note?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  brewerId: string;
  defaultDose: number;
  ratio: number;
  waterTempC: number;
  grindSize: string;
  totalBrewTimeSec: number;
  pouringSchedule: PouringStep[];
  filter?: string;
  notes?: string;
  targetTds?: string;
  sourceUrl?: string;
}

export interface Brewer {
  id: string;
  name: string;
}
