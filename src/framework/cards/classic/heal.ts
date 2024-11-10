import { Card } from '../../structures';
import { CardType } from '../../types';
import { getRandomMessage } from '../../utils';

export default new Card({
  id: 'classic:heal',
  types: [CardType.Defensive],
  name: 'Heal',
  description: 'Get 1 heart.',
  order: 0,
  suborder: -2,
  turnCooldown: 2,

  execute({ game, player, respond }) {
    // Handle if player already has the maximum amount of health
    if (player.health >= game.maxHealth) {
      player.health = game.maxHealth;
      return respond(
        getRandomMessage(this.id, 'maxedOut', {
          attacker: `<@${player.userId}>`,
        }),
      );
    }

    // Heal player by 1 heart
    player.health++;
    return respond(
      getRandomMessage(this.id, 'success', {
        attacker: `<@${player.userId}>`,
        hpGained: 1,
      }),
    );
  },
});
