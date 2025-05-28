import { create } from 'zustand';
import { CandidateId } from '../data/candidates';

export interface SurveyStore {
  // User's answers to 31 questions (1-5)
  userScores: number[];
  
  // Current question index (0-30)
  currentStep: number;
  
  // Best matching candidate and similarity score
  bestMatch: { id: CandidateId; similarity: number } | null;
  
  // Actions
  setAnswer: (index: number, value: number) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setBestMatch: (match: { id: CandidateId; similarity: number }) => void;
}

export const useSurveyStore = create<SurveyStore>((set) => ({
  // Initialize with empty scores array
  userScores: Array(31).fill(0),
  
  // Start at first question
  currentStep: 0,
  
  // No match initially
  bestMatch: null,
  
  // Set answer for a specific question
  setAnswer: (index: number, value: number) => 
    set((state: SurveyStore) => ({
      userScores: state.userScores.map((score: number, i: number) => 
        i === index ? value : score
      )
    })),
  
  // Move to next question if not at end
  nextStep: () => 
    set((state: SurveyStore) => ({
      currentStep: Math.min(state.currentStep + 1, 30)
    })),
  
  // Move to previous question if not at start
  prevStep: () => 
    set((state: SurveyStore) => ({
      currentStep: Math.max(state.currentStep - 1, 0)
    })),
  
  // Set the best matching candidate
  setBestMatch: (match: { id: CandidateId; similarity: number }) => 
    set({ bestMatch: match }),
  
  // Set the current step
  setCurrentStep: (step: number) => set({ currentStep: step })
}));
