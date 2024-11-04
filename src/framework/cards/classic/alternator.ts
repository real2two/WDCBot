import { CardSelectUser } from '../../structures';
import { CardType } from '../../types';
import { getCard, getPlayer, getRandomMessage } from '../../utils';

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

    // Check if player activated a power up
    const playerUsedPowerup = player.chosenCards[turn - 2]?.cardId === 'classic:powerup';
    const hpLost = playerUsedPowerup ? 2 : 1;

    // Check if opponent is already dead
    if (targettedPlayer.diedAt) {
      return respond(
        getRandomMessage(this.id, playerUsedPowerup ? 'alreadyDeadPowerup' : 'alreadyDead', {
          attacker: `<@${player.userId}>`,
          victim: `<@${targettedPlayer.userId}>`,
          estimatedHpLost: hpLost,
        }),
      );
    }

    // Get opponent's card
    const targettedCardForTurn = targettedPlayer.chosenCards[turn - 1]!;
    const card = getCard(targettedCardForTurn.cardId);

    // Used when opponent used an offensive card
    if (card?.types.includes(CardType.Offensive)) {
      player.health -= hpLost;
      return respond(
        getRandomMessage(
          this.id,
          playerUsedPowerup ? 'usedOffensiveCardPowerup' : 'usedOffensiveCard',
          {
            attacker: `<@${player.userId}>`,
            victim: `<@${targettedPlayer.userId}>`,
            hpLost,
          },
        ),
      );
    }

    // Used when opponent used an defensive card
    if (card?.types.includes(CardType.Defensive)) {
      targettedPlayer.health -= hpLost;
      return respond(
        getRandomMessage(
          this.id,
          playerUsedPowerup ? 'usedDefensiveCardPowerup' : 'usedDefensiveCard',
          {
            attacker: `<@${player.userId}>`,
            victim: `<@${targettedPlayer.userId}>`,
            hpLost,
          },
        ),
      );
    }

    // No effect
    return respond(
      getRandomMessage(this.id, playerUsedPowerup ? 'noEffectPowerup' : 'noEffect', {
        attacker: `<@${player.userId}>`,
        victim: `<@${targettedPlayer.userId}>`,
        estimatedHpLost: hpLost,
      }),
    );
  },
});
