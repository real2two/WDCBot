import type { WDCGame } from '../types';

const games = new Map<string, WDCGame>();
const cloneGameObj = (v: WDCGame) => JSON.parse(JSON.stringify(v)) as WDCGame;

export async function fetchDbGame(channelId: string) {
  const game = games.get(channelId);
  if (!game) return;
  return cloneGameObj(game);
}

export async function createDbGame(game: WDCGame) {
  games.set(game.channelId, cloneGameObj(game));
  return cloneGameObj(game);
}

export async function saveDbGame(game: WDCGame) {
  games.set(game.channelId, cloneGameObj(game));
  return cloneGameObj(game);
}

export async function deleteDbGame(channelId: string) {
  games.delete(channelId);
}
