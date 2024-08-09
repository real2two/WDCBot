import { Component } from '@httpi/client';
import {
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  MessageFlags,
} from 'discord-api-types/v10';
import { deleteDbGame, fetchDbGame } from '../framework/main/database';
import { WDCGameState } from '../framework/types';
import { hasManageGuild } from '../utils/permissions';
import {
  deleteInteractionFollowup,
  editInteractionFollowup,
  sendInteractionFollowup,
  sendInteractionResponse,
} from '../utils/webhooks';

export default new Component({
  customId: /^g:disband:(start|confirm)$/,
  async execute({ user, interaction, respond }) {
    const channelId = interaction.channel?.id;
    if (!channelId) return;

    const game = await fetchDbGame(channelId);
    if (!game) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "❌ There aren't any ongoing games on this channel!",
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    if (game.state !== WDCGameState.Prep) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Cannot disband a game that already started!',
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

    const customId = interaction.data.custom_id as string;
    const option = customId.slice('g:disband:'.length) as 'start' | 'confirm';

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
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    if (option === 'confirm') {
      // In the future, there might be a race condition vulnerability here
      // if I don't add a seperate "deleted" value (if I were to use Redis).
      await deleteDbGame(channelId);

      await sendInteractionResponse(interaction, {
        type: InteractionResponseType.DeferredMessageUpdate,
      });

      if (interaction.message?.id) {
        await editInteractionFollowup(interaction, interaction.message?.id, {
          embeds: [
            {
              color: 0xa2231d,
              description: '**💣 Disbanding game...**',
            },
          ],
          components: [],
        });
      }

      return sendInteractionFollowup(interaction, {
        embeds: [
          {
            color: 0xa2231d,
            description: '🗑️ **The game has been disbanded!**',
          },
        ],
      });
    }
  },
});
