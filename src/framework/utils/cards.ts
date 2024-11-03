import { cards } from '../cards';
import type { WDCGame } from '../types';

export function getCard(cardId: string) {
  return cards.find(({ id }) => id === cardId);
}

export function convertPlayersToText(game: WDCGame) {
  return game.players
    .sort((a, b) => b.health - a.health)
    .map((p) =>
      p.health > 0
        ? `- <@${p.userId}> ❤️ ${p.health}` +
          `${
            game.publicInventory
              ? ` ${p.cards
                  .filter((c) => c.quantity !== Number.POSITIVE_INFINITY)
                  .map(
                    (pc) =>
                      `${cards.find((c) => pc.cardId === c.id)?.emoji || '❓'} ${pc.quantity}`,
                  )
                  .join(' ')}`
              : ''
          }`
        : `- <@${p.userId}> 💀`,
    )
    .join('\n');
}
