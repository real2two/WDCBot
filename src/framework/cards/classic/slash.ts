import { CardSelectUser } from '../../structures';
import { CardType } from '../../types';

export default new CardSelectUser({
  id: 'classic:slash',
  types: [CardType.Offensive],
  name: 'Slash',
  description: 'Remove 1 heart from an opponent.',
  image: 'https://i.imgur.com/Pp96eh9.png',
  order: 0,
  suborder: 0,

  execute({ respond }) {
    respond('test slash');
  },
});
