export interface RecordInter {
  id: number;
  discount?: number;
  person_id: number;
  phase?: PhaseInter[];
}

export interface PhaseInter {
  id: number;
  destination: string;
  traffic?: string;
  tel?: string;
  emergency_tel?: string;
  start_at: Date;
  end_at: Date;
  record_id: number;
}