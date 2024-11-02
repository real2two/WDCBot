import type { WDCGame } from '../types';

const games = new Map<string, WDCGame>();

export function getWDCGame(channelId: string) {
  return games.get(channelId);
}

export function createWDCGame(game: WDCGame) {
  games.set(game.channelId, game);
  return game;
}

export function deleteWDCGame(channelId: string) {
  const game = games.get(channelId);
  for (const timer of game?.loopTimers ?? []) {
    clearTimeout(timer);
  }

  games.delete(channelId);
}
