import { Component } from '@httpi/client';
import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { startGame, getWDCGame, WDCGameState } from '../framework';

export default new Component({
  customId: /^start$/,
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

    if (game.state !== WDCGameState.Prep) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Cannot start a game that already started!',
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    if (user.id !== game.hostId) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: game.hostId
            ? `❌ Only the host (<@${game.hostId}>) can start the game!`
            : '❌ This game will automatically start within 1 minute!',
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    if (game.players.length < 2) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ There must be at least **2 players** to start the game!',
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    startGame(game);

    // Defer interaction
    return respond({
      type: InteractionResponseType.DeferredMessageUpdate,
    });
  },
});
