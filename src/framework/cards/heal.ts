import { Card } from '../structures/Card';

export default new Card({
  id: 'heal',
  name: 'Heal',
  description: 'Get 1 heart.',
  image: 'https://i.imgur.com/JrcaGxj.png',
  order: -2,
  suborder: 0,
  turnCooldown: 2,

  execute(ctx) {
    // WIP
  },
});
