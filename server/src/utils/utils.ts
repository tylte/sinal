export const sleep = (ms: number) =>
  new Promise<void>((resolve, _) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
