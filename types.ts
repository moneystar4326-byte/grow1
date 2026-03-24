export type Gender = 'male' | 'female';

export interface ChildInfo {
  name: string;
  age: number;
  gender: Gender;
  guardianName: string;
  consultationDate: string;
  institutionName: string;
  counselorName: string;
}

export interface Scores {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
  q11: number;
  q12: number;
  q13: number;
  q14: number;
  q15: number;
}

export interface DevelopmentArea {
  name: string;
  score: number;
  interpretation: string;
}

export interface AnalysisResult {
  areas: {
    concentration: number;
    emotionalRegulation: number;
    sociality: number;
    selfExpression: number;
    selfRegulation: number;
    challenge: number;
  };
  summary: string;
  ageComparison: string;
  rootCauses: string;
  strengths: string[];
  weaknesses: string[];
  homeGuide: string[];
  institutionGuide: string;
  closing: string;
}
