import { WDCGameState, type WDCGame } from '../types';
import { getCard } from './cards';
import { handleRoundLoop } from './engine';

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

  if (game) game.disbanded = true;
  for (const timer of game?.loopTimers ?? []) {
    clearTimeout(timer);
  }

  games.delete(channelId);
}

export function startGame(game: WDCGame) {
  // Check if there are at least 2 players
  if (game.players.length < 2) {
    throw new Error('There must be at least 2 players who join to start the game');
  }

  // Set the game's state as loading
  game.state = WDCGameState.Loading;

  // Setup the game (classic gamemode)
  const classicCards = [
    'classic:slash',
    'classic:shield',
    'classic:heal',
    'classic:laser',
    'classic:reflect',
    'classic:powerup',
    'classic:blindshot',
    'classic:alternator',
  ];
  for (const player of game.players) {
    player.health = game.defaultHealth;

    player.cards = [];
    for (const cardId of classicCards) {
      const card = getCard(cardId)!;
      player.cards.push({
        cardId: card.id,
        quantity: card.quantity,
      });
    }
  }

  // Start the game
  game.state = WDCGameState.Started;

  // Start game
  handleRoundLoop({ game });
}
