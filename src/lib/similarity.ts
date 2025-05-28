import { CandidateVector } from '../data/candidates';

// Question weights
const WEIGHTS = [
  // Q1-Q24: weight = 1
  ...Array(24).fill(1),
  // Q25: weight = 0.5
  0.5,
  // Q26-Q27: weight = 2
  ...Array(2).fill(2),
  // Q28-Q31: weight = 1.5
  ...Array(4).fill(1.5)
] as const;

/**
 * Calculate similarity between user and candidate scores using weighted Euclidean distance
 * Returns a normalized similarity score between 0 and 1
 */
export function calculateSimilarity(user: number[], candidate: number[]): number {
  if (user.length !== candidate.length || user.length !== WEIGHTS.length) {
    throw new Error('Input arrays must have the same length as weights array');
  }

  // Calculate weighted squared differences
  const weightedSquaredDiff = user.reduce((sum, userScore, index) => {
    const diff = userScore - candidate[index];
    return sum + (WEIGHTS[index] * diff * diff);
  }, 0);

  // Calculate Euclidean distance
  const distance = Math.sqrt(weightedSquaredDiff);

  // Normalize to [0, 1] range
  // Maximum possible distance with weights and scores 1-5 is sqrt(sum(weights * 16))
  const maxDistance = Math.sqrt(WEIGHTS.reduce((sum, weight) => sum + (weight * 16), 0));
  
  // Convert distance to similarity score (1 - normalized distance)
  return 1 - (distance / maxDistance);
}

/**
 * Find the candidate with the highest similarity score
 */
export function findBestMatch(
  userScores: number[],
  candidates: CandidateVector[]
): { best: CandidateVector; similarity: number } {
  if (userScores.length !== WEIGHTS.length) {
    throw new Error('User scores must match the number of questions');
  }

  let bestCandidate = candidates[0];
  let bestSimilarity = calculateSimilarity(userScores, candidates[0].scores);

  for (let i = 1; i < candidates.length; i++) {
    const similarity = calculateSimilarity(userScores, candidates[i].scores);
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestCandidate = candidates[i];
    }
  }

  return {
    best: bestCandidate,
    similarity: bestSimilarity
  };
} 