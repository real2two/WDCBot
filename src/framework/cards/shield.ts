import { Card } from '../structures/Card';

export default new Card({
  id: 'shield',
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
