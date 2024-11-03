import { Subcommand } from '@httpi/client';
import { InteractionResponseType } from 'discord-api-types/v10';

export default new Subcommand({
  data: {
    name: 'all_cards',
    description: 'Get all classic cards',
  },
  execute({ respond }) {
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [
          {
            color: 0xffffff,
            title: 'All cards',
            image: {
              url: 'https://media.discordapp.net/attachments/1302761241047072889/1302761294251687996/all.png',
            },
          },
        ],
      },
    });
  },
});
