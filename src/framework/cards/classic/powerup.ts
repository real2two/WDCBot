import { Card } from '../../structures';
import { CardType } from '../../types';

export default new Card({
  id: 'classic:powerup',
  types: [CardType.Supportive],
  name: 'Powerup',
  description: 'Double your damage for the next turn only.',
  image: 'https://i.imgur.com/KoiBNIw.png',
  emoji: '⚡',
  order: 0,
  suborder: -2,
  quantity: 1,

  execute({ player, playerCard, respond }) {
    playerCard.quantity--;
    return respond(`<@${player.userId}> activated a power up!`);
  },
});
