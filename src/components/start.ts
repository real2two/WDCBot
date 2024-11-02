import { Component } from '@httpi/client';
import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import { cards, getWDCGame, handleGameLoop, WDCGameState } from '../framework';

export default new Component({
  customId: /^g:start$/,
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

    // Setup the game (classic gamemode)
    const classicCards = [
      'classic:slash',
      'classic:shield',
      'classic:heal',
      'classic:laser',
      'classic:reflect',
      'classic:powerup',
      'classic:blindshot',
      'classic:alternator',
    ];
    for (const player of game.players) {
      player.health = 7;

      player.cards = [];
      for (const cardId of classicCards) {
        const card = cards.find(({ id }) => cardId === id)!;
        player.cards.push({
          cardId: card.id,
          quantity: card.quantity,
          turnsUntilUsable: 0,
        });
      }
    }

    // Start the game
    game.state = WDCGameState.Started;

    // Start game
    return handleGameLoop({ interaction, game });
  },
});
