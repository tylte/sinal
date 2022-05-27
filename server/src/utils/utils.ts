export const PUBLIC_LOBBIES = "PUBLIC_LOBBIES";
export const PUBLIC_CHAT = "PUBLIC_CHAT";

export const sleep = (ms: number) =>
  new Promise<void>((resolve, _) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
