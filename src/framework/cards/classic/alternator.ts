import { CardSelectUser } from '../../structures';
import { CardType } from '../../types';

export default new CardSelectUser({
  id: 'classic:alternator',
  types: [CardType.Supportive],
  name: 'Alternator',
  description:
    'If opponent uses an offensive card, you lose a heart; if defensive, they lose a heart. Else nothing.',
  image: 'https://i.imgur.com/10QiEwl.png',
  order: 0,
  suborder: 0,

  execute({ respond }) {
    respond('test alternator');
  },
});
