import { Card } from '../../structures';
import { CardType } from '../../types';
import { getRandomMessage } from '../../utils';

export default new Card({
  id: 'classic:powerup',
  types: [CardType.Supportive],
  name: 'Powerup',
  description: 'Double your damage for the next turn only.',
  emoji: '⚡',
  order: 0,
  suborder: -2,
  quantity: 2,
  turnCooldown: 1,

  execute({ player, playerCard, respond }) {
    playerCard.quantity--;
    return respond(
      getRandomMessage(this.id, 'success', {
        attacker: `<@${player.userId}>`,
      }),
    );
  },
});
