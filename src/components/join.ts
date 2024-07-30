import { Component } from '@httpi/client';
import {
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  MessageFlags,
} from 'discord-api-types/v10';
import { fetchDbGame, saveDbGame } from '../framework/main/database';
import { createPrepEmbeds } from '../utils/embeds';
import { getPlayer, removePlayer, updatePlayer } from '../framework/main/players';
import { WDCGameState } from '../framework/main/types';

export default new Component({
  customId: /^g:[0-9]+:join$/,
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
          content: '❌ Cannot join a game that already started!',
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    if (user.id === game.hostId) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          embeds: [
            {
              color: 0xa2231d,
              author: {
                name: 'Are you sure you want to disband the game?',
              },
              description:
                "Since you're the host, leaving the game will disband the game entirely.",
            },
          ],
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.Button,
                  style: ButtonStyle.Danger,
                  custom_id: `g:${game.channelId}:disband`,
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

    const player = getPlayer(game, user.id);
    if (player) {
      // Leave game
      removePlayer(game, player.userId);
    } else {
      updatePlayer(game, {
        // Join game
        userId: user.id,
        cards: [],
      });
    }
    await saveDbGame(game);

    return respond({
      type: InteractionResponseType.UpdateMessage,
      data: {
        embeds: createPrepEmbeds(game),
      },
    });
  },
});
