import { Card } from '../../structures';
import { CardType } from '../../types';

export default new Card({
  id: 'classic:shield',
  types: [CardType.Defensive],
  name: 'Shield',
  description: 'Block damage for a specific turn.',
  image: 'https://i.imgur.com/rSLPXps.png',
  order: 0,
  suborder: 0,
  quantity: 6,

  execute(ctx) {
    // WIP
  },
});
