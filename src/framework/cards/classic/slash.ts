import { CardSelectUser } from '../../structures';
import { getPlayer } from '../../utils';
import { CardType } from '../../types';

export default new CardSelectUser({
  id: 'classic:slash',
  types: [CardType.Offensive],
  name: 'Slash',
  description: 'Remove 1 heart from an opponent.',
  image: 'https://i.imgur.com/Pp96eh9.png',
  order: 0,
  suborder: 0,

  execute({ game, player, playerChosenCard, round, turn, step, respond }) {
    const targettedPlayer = getPlayer(game, playerChosenCard.data.id)!;

    if (targettedPlayer.diedAt) {
      // Opponent is already dead
      return respond(`<@${player.userId}> slashed <@${targettedPlayer.userId}>'s dead body.`);
    }

    const targettedCardForTurn = targettedPlayer.chosenCards[turn]!;

    if (targettedCardForTurn.cardId === 'classic:shield') {
      // Handle if opponent has a shield
      return respond(
        `<@${player.userId}> slashed <@${targettedPlayer.userId}> but the attack was blocked by a shield!`,
      );
    }

    // Check if player activated a power up
    const hpLost = player.chosenCards[turn - 1]?.cardId === 'classic:powerup' ? 2 : 1;

    if (targettedCardForTurn.cardId === 'classic:reflect') {
      // Handle if opponent has a reflect
      player.health -= hpLost;
      return respond(
        `<@${player.userId}> slashed <@${targettedPlayer.userId}> but the attack was reflected, making <@${player.userId}> lose **❤️ ${hpLost}**!`,
      );
    }

    // Handle slash attack
    targettedPlayer.health -= hpLost * (targettedCardForTurn.cardId === 'classic:laser' ? 2 : 1);
    return respond(
      `<@${player.userId}> slashed <@${targettedPlayer.userId}> and lost **❤️ ${hpLost}**!`,
    );
  },
});
