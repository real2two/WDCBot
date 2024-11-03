import { Card } from '../../structures';
import { CardType } from '../../types';

export default new Card({
  id: 'classic:laser',
  types: [CardType.Offensive],
  name: 'Laser',
  description: 'Remove 1 heart from every opponent, but be twice as vulnerable to attacks.',
  image: 'https://i.imgur.com/FHQ8Qma.png',
  order: -1,
  suborder: 0,

  execute({ respond }) {
    respond('test laser');
  },
});
