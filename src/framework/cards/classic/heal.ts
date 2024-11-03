import { Card } from '../../structures';
import { CardType } from '../../types';

export default new Card({
  id: 'classic:heal',
  types: [CardType.Defensive],
  name: 'Heal',
  description: 'Get 1 heart.',
  image: 'https://i.imgur.com/JrcaGxj.png',
  order: -2,
  suborder: 0,
  turnCooldown: 2,

  execute({ respond }) {
    respond('test heal');
  },
});
