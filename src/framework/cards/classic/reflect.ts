import { Card } from '../../structures';
import { CardType } from '../../types';

export default new Card({
  id: 'classic:reflect',
  types: [CardType.Defensive],
  name: 'Reflect',
  description: 'Reflect a move.',
  image: 'https://i.imgur.com/qMGAGz0.png',
  emoji: '🪞',
  order: 0,
  suborder: -2,
  quantity: 3,

  execute({ player, respond }) {
    return respond(`<@${player.userId}> actived a reflect!`);
  },
});
