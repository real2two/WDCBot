import { Command } from '@httpi/client';
import {
  ApplicationIntegrationType,
  InteractionContextType,
  InteractionResponseType,
  MessageFlags,
} from 'discord-api-types/v10';
import { ButtonStyle, ComponentType } from '@discordjs/core';

import { fetchDbGame, createDbGame } from '../framework/main/database';
import { updatePlayer } from '../framework/main/players';
import { createPrepEmbeds } from '../utils/embeds';
import { WDCGameState, type WDCGame } from '../framework/main/types';

export default new Command({
  data: {
    name: 'classic',
    description: 'Begin a classic Wildly Deadly Cards match',
    integration_types: [
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ],
    contexts: [
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ],
  },
  async execute({ user, interaction, respond }) {
    const channelId = interaction.channel?.id;
    if (!channelId) return;

    if (await fetchDbGame(channelId)) {
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
      players: [],
    };

    updatePlayer(game, {
      userId: user.id,
      cards: [],
    });

    await createDbGame(game);

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
                custom_id: `g:${game.channelId}:join`,
                label: 'Join',
              },
              {
                type: ComponentType.Button,
                style: ButtonStyle.Secondary,
                custom_id: `g:${game.channelId}:start`,
                label: 'Start game',
              },
            ],
          },
        ],
      },
    });
  },
});
