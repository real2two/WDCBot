import { Component } from '@httpi/client';
import {
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  MessageFlags,
  type APIActionRowComponent,
  type APIMessageActionRowComponent,
  type APISelectMenuOption,
} from 'discord-api-types/v10';
import { getCard, getPlayer, getWDCGame, WDCGameState, type WDCGamePlayer } from '../framework';

export default new Component({
  customId: /^g:select_cards$/,
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

    const player = getPlayer(game, user.id);
    if (!player) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "❌ You aren't in this game!",
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    if (game.state !== WDCGameState.Started) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "❌ Cannot set cards in a game that hasn't started",
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    if (player.health <= 0) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ You are dead!',
          flags: MessageFlags.Ephemeral,
        },
      });
    }

    // TODO: Check if player has enough quantity to use the card on submit + check turn cooldown
    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '### Select your cards',
        components: [
          createSelectCardComponent(player, 0),
          createSelectCardComponent(player, 1),
          createSelectCardComponent(player, 2),
          createSelectCardComponent(player, 3),
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                style: ButtonStyle.Success,
                custom_id: 'g:select_cards:confirm',
                label: 'Submit',
              },
            ],
          },
        ],
        flags: MessageFlags.Ephemeral,
      },
    });
  },
});

function createSelectCardComponent(
  player: WDCGamePlayer,
  cardIndex: number,
): APIActionRowComponent<APIMessageActionRowComponent> {
  return {
    type: ComponentType.ActionRow,
    components: [
      {
        type: ComponentType.StringSelect,
        custom_id: `g:select_cards:use:${cardIndex}`,
        options: createSelectCardComponentOptions(player, cardIndex),
      },
    ],
  };
}

function createSelectCardComponentOptions(player: WDCGamePlayer, cardIndex: number) {
  const options: APISelectMenuOption[] = [];
  for (const { cardId } of player.cards) {
    const card = getCard(cardId)!;
    options.push({
      label: card.name,
      description: card.description,
      value: card.id,
      default: card.id === player.chosenCardIds[cardIndex],
    });
  }
  console.log(options);
  return options;
}
