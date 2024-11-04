import { CardSelectUser } from '../../structures';
import { CardType } from '../../types';
import { getPlayer, getRandomMessage } from '../../utils';

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

    const targettedCardForTurn = targettedPlayer.chosenCards[turn - 1]!;

    if (targettedCardForTurn.cardId === 'classic:shield') {
      // Handle if opponent has a shield
      return respond(
        getRandomMessage(this.id, playerUsedPowerup ? 'hasShieldPowerup' : 'hasShield', {
          attacker: `<@${player.userId}>`,
          victim: `<@${targettedPlayer.userId}>`,
          estimatedHpLost: hpLost,
        }),
      );
    }

    if (targettedCardForTurn.cardId === 'classic:reflect') {
      // Handle if opponent has a reflect
      player.health -= hpLost;
      return respond(
        getRandomMessage(this.id, playerUsedPowerup ? 'hasReflectPowerup' : 'hasReflect', {
          attacker: `<@${player.userId}>`,
          victim: `<@${targettedPlayer.userId}>`,
          hpLost,
        }),
      );
    }

    // Handle slash attack
    const opponentUsedLaser = targettedCardForTurn.cardId === 'classic:laser';
    targettedPlayer.health -= hpLost * (opponentUsedLaser ? 2 : 1);
    return respond(
      getRandomMessage(
        this.id,
        playerUsedPowerup && opponentUsedLaser
          ? 'successPowerupAndLaser'
          : opponentUsedLaser
            ? 'successLaser'
            : playerUsedPowerup
              ? 'successPowerup'
              : 'success',
        {
          attacker: `<@${player.userId}>`,
          victim: `<@${targettedPlayer.userId}>`,
          hpLost: hpLost * (opponentUsedLaser ? 2 : 1),
        },
      ),
    );
  },
});
