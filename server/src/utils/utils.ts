export const PUBLIC_LOBBIES = "PUBLIC_LOBBIES";

export const sleep = (ms: number) =>
  new Promise<void>((resolve, _) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
