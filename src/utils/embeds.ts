import type { WDCGame } from '../framework/main/types';

export function createPrepEmbeds(game: WDCGame) {
  return [
    {
      color: 0x5c2de9,
      author: {
        name: `Preparation ➡ ${game.mode[0].toUpperCase() + game.mode.slice(1)}`,
      },
      description:
        `**Host**: <@${game.hostId}>\n` +
        `**Players (${game.players.length})**: ${
          game.players.length ? `<@${game.players.map((p) => p.userId).join('>, <@')}>` : 'None'
        }`,
    },
  ];
}
