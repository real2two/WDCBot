import type { WDCGame } from '../types';

export function getPlayer(game: WDCGame, userId: string) {
  return game.players.find((p) => p.userId === userId);
}

export function removePlayer(game: WDCGame, userId: string) {
  const player = getPlayer(game, userId);
  if (!player) return false;

  game.players.splice(game.players.indexOf(player), 1);
  return true;
}
