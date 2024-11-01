import { Subcommand } from '@httpi/client';
import {
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  MessageFlags,
} from 'discord-api-types/v10';
import { getWDCGame } from 'src/framework';
import { hasManageGuild } from '../../utils';

export default new Subcommand({
  data: {
    name: 'disband',
    description: 'Disband a Wildly Deadly Cards match',
  },
  execute({ user, interaction, respond }) {
    const channelId = interaction.channel?.id;
    if (!channelId) return;

    const game = getWDCGame(channelId);
    if (!game) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "❌ There aren't any ongoing games on this channel!",
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    if (user.id !== game.hostId && !hasManageGuild(interaction.member?.permissions)) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `❌ Only the host (<@${game.hostId}>)${interaction.guild_id ? ' or anyone with the **Manage Server** permission' : ''} can disband the game!`,
          allowed_mentions: {},
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [
          {
            color: 0xa2231d,
            author: {
              name: 'Are you sure you want to disband the game?',
            },
            description: 'This action is unreversible.',
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                style: ButtonStyle.Danger,
                custom_id: 'g:disband:confirm',
                label: 'Disband',
              },
              {
                type: ComponentType.Button,
                style: ButtonStyle.Secondary,
                custom_id: 'cancel',
                label: 'Cancel',
              },
            ],
          },
        ],
      },
    });
  },
});
