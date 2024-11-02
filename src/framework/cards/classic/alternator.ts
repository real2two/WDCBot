import { Card } from '../../structures';
import { CardType } from '../../types';

export default new Card({
  id: 'alternator',
  types: [CardType.Supportive],
  name: 'Alternator',
  description:
    'Use this on an opponent. If they use an offensive card, you lose a heart, but if they use a defensive card, they lose a heart. Otherwise, nothing happens.',
  image: 'https://i.imgur.com/10QiEwl.png',
  order: 0,
  suborder: 0,

  execute(ctx) {
    // WIP
  },
});
