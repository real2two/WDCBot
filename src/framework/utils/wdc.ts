import type { WDCGame } from '../types';

const games = new Map<string, WDCGame>();

export function getWDCGame(channelId: string) {
  const game = games.get(channelId);
  return game;
}

export function createWDCGame(game: WDCGame) {
  games.set(game.channelId, game);
  return game;
}

export function deleteWDCGame(channelId: string) {
  games.delete(channelId);
}
