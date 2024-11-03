import { Subcommand } from '@httpi/client';
import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { ButtonStyle, ComponentType } from '@discordjs/core';

import { getWDCGame, createWDCGame, WDCGameState, type WDCGame } from '../../framework';
import { createPrepEmbeds, hasViewChannelSendMessagesAndEmbedLinks } from '../../utils';

export default new Subcommand({
  data: {
    name: 'start',
    description: 'Begin a classic Wildly Deadly Cards match',
  },
  async execute({ user, interaction, respond }) {
    if (!hasViewChannelSendMessagesAndEmbedLinks(interaction.app_permissions)) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content:
            '❌ Missing permissions! Make sure the bot has `VIEW_CHANNEL`, `SEND_MESSAGES` and `EMBED_LINKS` permissions on this channel!',
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    const channelId = interaction.channel?.id;
    if (!channelId) return;

    if (getWDCGame(channelId)) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ There is already an ongoing game on this channel!',
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    const game: WDCGame = {
      channelId,
      hostId: user.id,
      mode: 'classic',
      state: WDCGameState.Prep,
      publicInventory: true,
      defaultHealth: 7,
      maxHealth: 10,
      players: [],
      round: 0,
      currentlyHandlingTurns: false,
      loopTimers: [],
      usedCardsWithBeforeAfterFunctions: new Set(),
      kv: new Map(),
    };

    game.players.push({
      userId: user.id,
      health: 0,
      cards: [],
      submittedChosenCards: false,
      chosenCards: [null, null, null, null],
    });

    createWDCGame(game);

    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `<@${user.id}>`,
        embeds: createPrepEmbeds(game),
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                style: ButtonStyle.Primary,
                custom_id: 'join',
                label: 'Join',
              },
              {
                type: ComponentType.Button,
                style: ButtonStyle.Success,
                custom_id: 'start',
                label: 'Start',
              },
              {
                type: ComponentType.Button,
                style: ButtonStyle.Danger,
                custom_id: 'disband:start',
                label: 'Disband',
              },
            ],
          },
        ],
      },
    });
  },
});
