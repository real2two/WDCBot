import { Card } from '../../structures';

export default new Card({
  id: 'powerup',
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
