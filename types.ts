
export interface NegotiationResult {
  agent: string;
  score: number;
  strengths: string[];
  risks: string[];
  marketAlignment: string;
  advice: string[];
  hireSignal: 'Strong Yes' | 'Yes' | 'Borderline' | 'High Risk' | 'No';
  estimatedRange: string;
}

export interface FileData {
  name: string;
  data: string;
  mimeType: string;
  isText?: boolean;
}
