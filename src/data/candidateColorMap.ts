import { CandidateId } from './candidates';

export const candidateColorMap: Record<CandidateId, string> = {
  LeeJM: 'bg-blue-500',
  KimMS: 'bg-red-500',
  LeeJS: 'bg-orange-500',
  KwonYG: 'bg-yellow-400',
  HwangKA: 'bg-gray-400',
} as const; 