import { Card } from '../../structures';
import { CardType } from '../../types';
import { getRandomMessage, wait } from '../../utils';

export default new Card({
  id: 'classic:laser',
  types: [CardType.Offensive],
  name: 'Laser',
  description: 'Remove 1 heart from every opponent, but be twice as vulnerable to attacks.',
  image: 'https://i.imgur.com/FHQ8Qma.png',
  order: 0,
  suborder: -1,

  async execute({ game, player, turn, respond }) {
    // Check if player activated a power up
    const playerUsedPowerup = player.chosenCards[turn - 2]?.cardId === 'classic:powerup';
    const hpLost = playerUsedPowerup ? 2 : 1;

    // Send initial message
    respond(
      getRandomMessage(this.id, playerUsedPowerup ? 'initialPowerup' : 'initial', {
        attacker: `<@${player.userId}>`,
        estimatedHpLost: hpLost,
      }),
    );

    const playersToHit = game.players.filter((p) => !p.diedAt && p.userId !== player.userId);

    for (const targettedPlayer of playersToHit) {
      await wait(1000);

      const targettedCardForTurn = targettedPlayer.chosenCards[turn - 1]!;

      if (targettedCardForTurn.cardId === 'classic:shield') {
        // Handle if opponent has a shield
        respond(
          getRandomMessage(this.id, playerUsedPowerup ? 'hasShieldPowerup' : 'hasShield', {
            attacker: `<@${player.userId}>`,
            victim: `<@${targettedPlayer.userId}>`,
            estimatedHpLost: hpLost,
          }),
        );
        continue;
      }

      if (targettedCardForTurn.cardId === 'classic:reflect') {
        // Handle if opponent has a reflect
        player.health -= hpLost * 2;
        respond(
          getRandomMessage(this.id, playerUsedPowerup ? 'hasReflectPowerup' : 'hasReflect', {
            attacker: `<@${player.userId}>`,
            victim: `<@${targettedPlayer.userId}>`,
            hpLost: hpLost * 2,
          }),
        );
        continue;
      }

      // Handle laser attack
      const opponentUsedLaser = targettedCardForTurn.cardId === 'classic:laser';
      targettedPlayer.health -=
        hpLost * (opponentUsedLaser ? 2 : 1) * (playersToHit.length <= 1 ? 2 : 1);

      // Send message
      respond(
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
    }
  },
});
