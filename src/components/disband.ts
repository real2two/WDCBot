import { Component } from '@httpi/client';
import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { deleteDbGame, fetchDbGame } from '../framework/main/database';
import { WDCGameState } from '../framework/main/types';

export default new Component({
  customId: /^g:[0-9]+:disband$/,
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

    if (user.id !== game.hostId) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `❌ Only the host (<@${game.hostId}>) can disband the game!`,
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    // In the future, there might be a race condition vulnerability here
    // if I don't add a seperate "deleted" value (if I were to use Redis).
    await deleteDbGame(channelId);

    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [
          {
            color: 0xa2231d,
            description: '🗑️ **The game has been disbanded!**',
          },
        ],
      },
    });
  },
});
