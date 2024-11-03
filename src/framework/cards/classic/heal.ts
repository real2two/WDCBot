import { Card } from '../../structures';
import { CardType } from '../../types';

export default new Card({
  id: 'classic:heal',
  types: [CardType.Defensive],
  name: 'Heal',
  description: 'Get 1 heart.',
  image: 'https://i.imgur.com/JrcaGxj.png',
  order: 0,
  suborder: -2,
  turnCooldown: 2,

  execute({ game, player, respond }) {
    // Handle if player already has the maximum amount of health
    if (player.health >= game.maxHealth) {
      player.health = game.maxHealth;
      return respond(`<@${player.userId}> tried to heal but already had the maximum amount of HP.`);
    }

    // Heal player by 1 heart
    player.health++;
    return respond(`<@${player.userId}> healed **❤️ 1**!`);
  },
});
