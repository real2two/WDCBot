import { Card } from '../../structures';
import { CardType } from '../../types';
import { getRandomMessage } from '../../utils';

export default new Card({
  id: 'classic:shield',
  types: [CardType.Defensive],
  name: 'Shield',
  description: 'Block damage for a specific turn.',
  emoji: '🛡️',
  order: 0,
  suborder: -1,
  quantity: 6,

  execute({ player, playerCard, respond }) {
    playerCard.quantity--;
    return respond(
      getRandomMessage(this.id, 'success', {
        attacker: `<@${player.userId}>`,
      }),
    );
  },
});
