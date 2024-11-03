import { Card } from '../../structures';
import { CardType } from '../../types';

export default new Card({
  id: 'classic:shield',
  types: [CardType.Defensive],
  name: 'Shield',
  description: 'Block damage for a specific turn.',
  image: 'https://i.imgur.com/rSLPXps.png',
  emoji: '🛡️',
  order: 0,
  suborder: -1,
  quantity: 6,

  execute({ player, playerCard, respond }) {
    playerCard.quantity--;
    return respond(`<@${player.userId}> activated a shield!`);
  },
});
