import { Card } from '../../structures';
import { CardType } from '../../types';
import { waitRandom } from '../../utils';

export default new Card({
  id: 'classic:laser',
  types: [CardType.Offensive],
  name: 'Laser',
  description: 'Remove 1 heart from every opponent, but be twice as vulnerable to attacks.',
  image: 'https://i.imgur.com/FHQ8Qma.png',
  order: 0,
  suborder: -1,

  async execute({ game, player, turn, respond }) {
    // Send initial message
    respond(`<@${player.userId}> used laser...`);

    // Check if player activated a power up
    const hpLost = player.chosenCards[turn - 1]?.cardId === 'classic:powerup' ? 2 : 1;

    for (const targettedPlayer of game.players.filter((p) => !p.diedAt)) {
      await waitRandom(2000, 5000);

      const targettedCardForTurn = targettedPlayer.chosenCards[turn]!;

      if (targettedCardForTurn.cardId === 'classic:shield') {
        // Handle if opponent has a shield
        respond(`<@${targettedPlayer.userId}> blocked the laser with a shield!`);
        continue;
      }

      if (targettedCardForTurn.cardId === 'classic:reflect') {
        // Handle if opponent has a reflect
        player.health -= hpLost * 2;
        respond(
          `<@${targettedPlayer.userId}> reflected the laser, making <@${player.userId}> lose **❤️ ${hpLost}**!`,
        );
        continue;
      }

      // Handle laser attack
      targettedPlayer.health -= hpLost * (targettedCardForTurn.cardId === 'classic:laser' ? 2 : 1);
      respond(`<@${targettedPlayer.userId}> was hit by the laser and lost **❤️ ${hpLost}**!`);
    }
  },
});
