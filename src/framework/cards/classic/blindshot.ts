import { Card } from '../../structures';
import { CardType } from '../../types';
import { waitRandom } from '../../utils';

export default new Card({
  id: 'classic:blindshot',
  types: [CardType.Offensive],
  name: 'Blindshot',
  description: 'Deal 2 hearts of damage to a random player, which can be yourself.',
  image: 'https://i.imgur.com/XaCaWEo.png',
  order: 0,
  suborder: 0,

  async execute({ game, player, turn, respond }) {
    // Get random player
    const alivePlayers = game.players.filter((p) => !p.diedAt);
    const targettedPlayer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];

    // Check if player activated a power up
    const hpLost = player.chosenCards[turn - 1]?.cardId === 'classic:powerup' ? 4 : 2;

    // Send initial message
    respond(`<@${player.userId}> used blindshot and it hit...`);

    // Timeout to add intensity
    await waitRandom(2000, 8000);

    // Check if targetted player has shield/reflect up
    const targettedCardForTurn = targettedPlayer.chosenCards[turn]!;

    if (targettedCardForTurn.cardId === 'classic:shield') {
      // Handle if opponent has a shield
      return respond(
        `<@${targettedPlayer.userId}> was blindshotted and the attack was blocked by a shield!`,
      );
    }

    if (targettedCardForTurn.cardId === 'classic:reflect') {
      // Handle if opponent has a reflect
      player.health -= hpLost;
      return respond(
        `<@${targettedPlayer.userId}> was blindshotted and but the attack was reflected, making <@${player.userId}> lose **❤️ ${hpLost}**!`,
      );
    }

    // Opponent was hit
    targettedPlayer.health -= hpLost * (targettedCardForTurn.cardId === 'classic:laser' ? 2 : 1);
    respond(`<@${targettedPlayer.userId}> was blindshotted and lost **❤️ ${hpLost}**!`);
  },
});
