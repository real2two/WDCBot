import { CardSelectUser } from '../../structures';
import { CardType } from '../../types';
import { getCard, getPlayer } from '../../utils';

export default new CardSelectUser({
  id: 'classic:alternator',
  types: [CardType.Supportive],
  name: 'Alternator',
  description:
    'If opponent uses an offensive card, you lose a heart; if defensive, they lose a heart. Else nothing.',
  image: 'https://i.imgur.com/10QiEwl.png',
  order: 0,
  suborder: 0,

  execute({ game, player, playerChosenCard, turn, respond }) {
    const targettedPlayer = getPlayer(game, playerChosenCard.data.id)!;

    if (targettedPlayer.diedAt) {
      // Opponent is already dead
      return respond(
        `<@${player.userId}> used alternator over <@${targettedPlayer.userId}>'s dead body. It did no effect.`,
      );
    }

    // Get opponent's card
    const targettedCardForTurn = targettedPlayer.chosenCards[turn]!;
    const card = getCard(targettedCardForTurn.cardId);

    // Check if player activated a power up
    const hpLost = player.chosenCards[turn - 1]?.cardId === 'classic:powerup' ? 2 : 1;

    // Used when opponent used an offensive card
    if (card?.types.includes(CardType.Offensive)) {
      player.health -= hpLost;
      return respond(
        `<@${player.userId}> used alternator on <@${targettedPlayer.userId}> but <@${targettedPlayer.userId}> used an offensive card! <@${player.userId}> lost **❤️ ${hpLost}**.`,
      );
    }

    // Used when opponent used an defensive card
    if (card?.types.includes(CardType.Defensive)) {
      targettedPlayer.health -= hpLost;
      return respond(
        `<@${player.userId}> used alternator on <@${targettedPlayer.userId}> and <@${targettedPlayer.userId}> used an defensive card! <@${targettedPlayer.userId}> lost **❤️ ${hpLost}**.`,
      );
    }

    // No effect
    return respond(
      `<@${player.userId}> used alternator on <@${targettedPlayer.userId}> but it had no effect.`,
    );
  },
});
