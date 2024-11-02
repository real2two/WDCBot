import { Component } from '@httpi/client';
import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { getWDCGame, getPlayer, removePlayer, WDCGameState } from '../framework';
import { createPrepEmbeds } from '../utils';

export default new Component({
  customId: /^g:join$/,
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
          content: '❌ Cannot join a game that already started!',
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    const player = getPlayer(game, user.id);
    if (player) {
      // Leave game
      removePlayer(game, player.userId);
    } else if (game.players.length >= 25) {
      // Fails to join game, because the game is already full
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Cannot join game that is already full! (25)',
          flags: MessageFlags.Ephemeral,
        },
      });
    } else {
      game.players.push({
        // Join game
        userId: user.id,
        health: 0,
        cards: [],
        submittedChosenCards: false,
        chosenCardIds: [null, null, null, null],
      });
    }

    return respond({
      type: InteractionResponseType.UpdateMessage,
      data: {
        embeds: createPrepEmbeds(game),
      },
    });
  },
});
