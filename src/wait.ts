// Taken from https://github.com/actions/typescript-action/blob/0cfebb2981ce6c1515b16445379303805459ea46/src/wait.ts Thank you!
export async function wait(milliseconds: number): Promise<string> {
  return new Promise((resolve) => {
    if (Number.isNaN(milliseconds)) {
      throw new Error('milliseconds not a number');
    }

    setTimeout(() => resolve('done!'), milliseconds);
  });
}
