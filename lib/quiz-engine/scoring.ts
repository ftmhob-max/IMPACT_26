export interface ScoreResult {
  pointsEarned: number;
  pointsPossible: number;
  isCorrect: boolean;
}

/**
 * Single-select: full credit if the one selected letter matches the one correct letter.
 * Multi-select: partial credit with a guessing penalty.
 *
 * Partial credit formula:
 *   correctHits   = |selected ∩ correct|
 *   incorrectHits = |selected − correct|   (penalty: discourages "select all")
 *   raw           = max(0, correctHits − incorrectHits)
 *   pointsEarned  = pointValue × (raw / |correct|)
 */
export function scoreAnswer(
  selectedLetters: string[],
  correctLetters: string[],
  pointValue: number
): ScoreResult {
  if (correctLetters.length === 0) {
    return { pointsEarned: 0, pointsPossible: pointValue, isCorrect: false };
  }

  const correctSet = new Set(correctLetters);
  const selectedSet = new Set(selectedLetters);

  if (correctLetters.length === 1) {
    // Single-select: binary full/no credit
    const isCorrect = selectedSet.size === 1 && selectedSet.has(correctLetters[0]);
    return {
      pointsEarned: isCorrect ? pointValue : 0,
      pointsPossible: pointValue,
      isCorrect,
    };
  }

  // Multi-select: partial credit with guessing penalty
  let correctHits = 0;
  let incorrectHits = 0;

  for (const letter of selectedSet) {
    if (correctSet.has(letter)) {
      correctHits++;
    } else {
      incorrectHits++;
    }
  }

  const raw = Math.max(0, correctHits - incorrectHits);
  const pointsEarned = pointValue * (raw / correctLetters.length);
  const isCorrect = raw === correctLetters.length && incorrectHits === 0;

  return {
    pointsEarned: Math.round(pointsEarned * 100) / 100,
    pointsPossible: pointValue,
    isCorrect,
  };
}
