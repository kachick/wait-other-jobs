// Taken from https://github.com/actions/typescript-action/blob/0cfebb2981ce6c1515b16445379303805459ea46/src/wait.ts Thank you!
export async function wait(milliseconds: number): Promise<string> {
  return new Promise((resolve) => {
    if (Number.isNaN(milliseconds)) {
      throw new Error('milliseconds not a number');
    }

    setTimeout(() => resolve('done!'), milliseconds);
  });
}

// Taken from MDN
// The maximum is exclusive and the minimum is inclusive
function getRandomInt(min: number, max: number) {
  const flooredMin = Math.ceil(min);
  return Math.floor(Math.random() * (Math.floor(max) - flooredMin) + flooredMin);
}

// 454356 millseconds => 7.5725999999999996 minutes => approximately 7.57 minutes
export function readableDuration(milliseconds: number): string {
  const msecToSec = 1000;
  const secToMin = 60;
  const wantPrecision = 2;
  const adjustor = 10 ** wantPrecision;
  const minutes = milliseconds / (msecToSec * secToMin);
  return `approximately ${(Math.round(minutes * adjustor) / adjustor).toFixed(
    wantPrecision
  )} minutes`;
}

export const MIN_JITTER_MILLISECONDS = 1000;
export const MAX_JITTER_MILLISECONDS = 7000;

export function calculateIntervalMillisecondsAsExponentialBackoffAndJitter(
  minIntervalSeconds: number,
  attempts: number
): number {
  const jitterMilliseconds = getRandomInt(MIN_JITTER_MILLISECONDS, MAX_JITTER_MILLISECONDS);
  return minIntervalSeconds * 2 ** (attempts - 1) * 1000 + jitterMilliseconds;
}
