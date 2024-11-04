import { Card } from '../../structures';
import { CardType } from '../../types';
import { getRandomMessage, waitRandom } from '../../utils';

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
    const playerUsedPowerup = player.chosenCards[turn - 2]?.cardId === 'classic:powerup';
    const hpLost = playerUsedPowerup ? 4 : 2;

    // Send initial message
    respond(
      getRandomMessage(this.id, playerUsedPowerup ? 'initialPowerup' : 'initial', {
        attacker: `<@${player.userId}>`,
        estimatedHpLost: hpLost,
      }),
    );

    // Timeout to add intensity
    await waitRandom(2000, 8000);

    // Check if targetted player has shield/reflect up
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

    // Opponent was hit
    const opponentUsedLaser = targettedCardForTurn.cardId === 'classic:laser';
    targettedPlayer.health -= hpLost * (opponentUsedLaser ? 2 : 1);

    respond(
      getRandomMessage(
        this.id,
        playerUsedPowerup && opponentUsedLaser
          ? 'successPowerupAndLaser'
          : opponentUsedLaser
            ? 'successLaser'
            : playerUsedPowerup
              ? player.userId === targettedPlayer.userId
                ? 'successPowerupSelf'
                : 'successPowerup'
              : player.userId === targettedPlayer.userId
                ? 'successSelf'
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
