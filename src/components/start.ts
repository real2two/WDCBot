import { Component } from '@httpi/client';
import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { fetchDbGame, saveDbGame } from '../framework/main/database';
import { WDCGameState } from '../framework/types';

export default new Component({
  customId: /^g:start$/,
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
          content: '❌ Cannot start a game that already started!',
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    if (user.id !== game.hostId) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `❌ Only the host (<@${game.hostId}>) can start the game!`,
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

    // Set the game's state as loading
    game.state = WDCGameState.Loading;
    await saveDbGame(game);

    // Setup the game (classic gamemode)
    for (const player of game.players) {
      player.cards = [];
      /*
				slash
				shield
				heal
				laser
				reflect
				powerup
				blindshot
				alternator
			*/
    }

    // Start the game
    game.state = WDCGameState.Started;

    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'super big wip start',
        flags: MessageFlags.Ephemeral,
      },
    });
  },
});
