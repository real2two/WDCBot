export function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
}

export function waitRandom(start: number, end: number) {
  return wait(Math.floor(Math.random() * end) + start);
}
