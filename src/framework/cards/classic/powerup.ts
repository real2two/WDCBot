import { Card } from '../../structures';
import { CardType } from '../../types';

export default new Card({
  id: 'powerup',
  types: [CardType.Supportive],
  name: 'Powerup',
  description: 'Double your damage for the next turn only.',
  image: 'https://i.imgur.com/KoiBNIw.png',
  order: 0,
  suborder: 0,
  quantity: 1,

  execute(ctx) {
    // WIP
  },
});
