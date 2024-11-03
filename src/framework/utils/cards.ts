import { cards } from '../cards';
import type { WDCGame } from '../types';

export function getCard(cardId: string) {
  return cards.find(({ id }) => id === cardId);
}

export function convertPlayersToText(
  game: WDCGame,
  opt?: { round: number; turn: number; order: number; step: number },
) {
  const isEveryoneDead = !game.players.some((p) => p.health > 0);
  return game.players
    .sort((a, b) => {
      // Compare round, turn and order
      if (a.diedAt && b.diedAt) {
        if (a.diedAt.round !== b.diedAt.round) return b.diedAt.round - a.diedAt.round;
        if (a.diedAt.turn !== b.diedAt.turn) return b.diedAt.turn - a.diedAt.turn;
        if (a.diedAt.order !== b.diedAt.order) return b.diedAt.order - a.diedAt.order;
        if (a.diedAt.step !== b.diedAt.step) return b.diedAt.step - a.diedAt.step;
        return b.health - a.health;
      }
      // The one without diedAt comes first
      if (a.diedAt) return 1;
      if (b.diedAt) return -1;
      // Compare health
      return b.health - a.health;
    })
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
        : isEveryoneDead &&
            opt?.round === p.diedAt?.round &&
            opt?.turn === p.diedAt?.turn &&
            opt?.order === p.diedAt?.order &&
            opt?.step === p.diedAt?.step
          ? `- <@${p.userId}> ❤️‍🔥 ${p.health}`
          : `- <@${p.userId}> 💀`,
    )
    .join('\n');
}
