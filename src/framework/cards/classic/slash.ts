import { CardSelectUser } from '../../structures';
import { CardType } from '../../types';
import { getPlayer } from '../../utils';

export default new CardSelectUser({
  id: 'classic:slash',
  types: [CardType.Offensive],
  name: 'Slash',
  description: 'Remove 1 heart from an opponent.',
  image: 'https://i.imgur.com/Pp96eh9.png',
  order: 0,
  suborder: 0,

  execute({ game, player, playerChosenCard, turn, respond }) {
    const targettedPlayer = getPlayer(game, playerChosenCard.data.id)!;

    if (targettedPlayer.diedAt) {
      // Player is already dead
      return respond(`<@${player.userId}> slashed <@${targettedPlayer.userId}>'s dead body.`);
    }

    const targettedCardForTurn = targettedPlayer.chosenCards[turn]!;

    if (targettedCardForTurn.cardId === 'classic:shield') {
      // Handle if opponent has a shield
      return respond(
        `<@${player.userId}> slashed <@${targettedPlayer.userId}> but the attack was blocked by a shield!`,
      );
    }

    // TODO: Check if opponent is using power up
    const healthLost = 1;

    if (targettedCardForTurn.cardId === 'classic:reflect') {
      // Handle if opponent has a shield
      player.health -= healthLost;
      return respond(
        `<@${player.userId}> slashed <@${targettedPlayer.userId}> but the attack was reflected, making <@${player.userId}> lose **❤️ ${healthLost}**!`,
      );
    }

    // Handle slash attack
    targettedPlayer.health -= healthLost;
    return respond(
      `<@${player.userId}> slashed <@${targettedPlayer.userId}> and lost **❤️ ${healthLost}**!`,
    );
  },
});
