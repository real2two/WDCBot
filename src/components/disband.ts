import { Component } from '@httpi/client';
import {
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  MessageFlags,
} from 'discord-api-types/v10';
import { deleteWDCGame, getWDCGame } from '../framework';
import { hasManageGuild, sendInteractionResponse } from '../utils';

export default new Component({
  customId: /^disband:(start|confirm)$/,
  async execute({ user, interaction, respond }) {
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
          content: game.hostId
            ? `❌ Only the host (<@${game.hostId}>) or anyone with the **Manage Server** permission can disband the game!`
            : '❌ Only anyone with the **Manage Server** permission can disband the game!',
          allowed_mentions: {},
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    const customId = interaction.data.custom_id as string;
    const option = customId.slice('disband:'.length) as 'start' | 'confirm';

    if (option === 'start') {
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
                  custom_id: 'disband:confirm',
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
    }

    if (option === 'confirm') {
      deleteWDCGame(channelId);

      return sendInteractionResponse(interaction, {
        type: InteractionResponseType.UpdateMessage,
        data: {
          embeds: [
            {
              color: 0xa2231d,
              description: '🗑️ **The game has been disbanded!**',
            },
          ],
          components: [],
        },
      });
    }
  },
});
