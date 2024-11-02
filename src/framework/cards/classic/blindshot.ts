import { Card } from '../../structures';
import { CardType } from '../../types';

export default new Card({
  id: 'blindshot',
  types: [CardType.Offensive],
  name: 'Blindshot',
  description: 'Deal 2 hearts of damage to a random player, which can be yourself.',
  image: 'https://i.imgur.com/XaCaWEo.png',
  order: 0,
  suborder: 0,

  execute(ctx) {
    // WIP
  },
});
