
export interface NegotiationResult {
  agent: string;
  score: number;
  strengths: string[];
  risks: string[];
  marketAlignment: string;
  advice: string[];
  hireSignal: 'Yes' | 'Borderline' | 'No';
}

export interface FileData {
  name: string;
  data: string;
  mimeType: string;
}
