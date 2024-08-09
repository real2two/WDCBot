import type { WDCGame, WDCPlayer } from '../types';

export function getPlayer(game: WDCGame, userId: string) {
  return game.players.find((p) => p.userId === userId);
}

export function updatePlayer(game: WDCGame, player: WDCPlayer) {
  const oldPlayer = game.players.find((p) => p.userId === player.userId);
  if (!oldPlayer) {
    game.players.push(player);
  } else {
    game.players[game.players.indexOf(oldPlayer)] = player;
  }
}

export function removePlayer(game: WDCGame, userId: string) {
  const player = getPlayer(game, userId);
  if (!player) return false;

  game.players.splice(game.players.indexOf(player), 1);
  return true;
}
