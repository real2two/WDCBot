import {
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  MessageFlags,
  type APIActionRowComponent,
  type APIMessageActionRowComponent,
  type APISelectMenuOption,
} from 'discord-api-types/v10';
import { getCard, type WDCGame, type WDCGamePlayer } from '../framework';
import type { CustomAPIInteractionResponse } from '@httpi/client';

export function createPrepEmbeds(game: WDCGame) {
  return [
    {
      color: 0x5c2de9,
      author: {
        name: `Preparation ➡ ${game.mode[0].toUpperCase() + game.mode.slice(1)}`,
      },
      description:
        `**Host**: <@${game.hostId}>\n` +
        `**Players (${game.players.length})**: ${
          game.players.length ? `<@${game.players.map((p) => p.userId).join('>, <@')}>` : 'None'
        }`,
    },
  ];
}

export function createSelectCardMessage(
  player: WDCGamePlayer,
  respond: (message: CustomAPIInteractionResponse) => unknown,
  additionalMessage = '',
  firstMessage = false,
) {
  return respond({
    type: firstMessage
      ? InteractionResponseType.ChannelMessageWithSource
      : InteractionResponseType.UpdateMessage,
    data: {
      content: `### Select your cards${additionalMessage ? `\n> ${additionalMessage}` : ''}`,
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
              custom_id: 'select_cards:confirm',
              label: player.submittedChosenCards ? 'Submitted!' : 'Submit',
              disabled: player.submittedChosenCards,
            },
          ],
        },
      ],
      flags: MessageFlags.Ephemeral,
    },
  });
}

function createSelectCardComponent(
  player: WDCGamePlayer,
  cardIndex: number,
): APIActionRowComponent<APIMessageActionRowComponent> {
  return {
    type: ComponentType.ActionRow,
    components: [
      {
        type: ComponentType.StringSelect,
        custom_id: `select_cards:use:${cardIndex}`,
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
      label:
        card.id === player.chosenCards[cardIndex]?.cardId && card.handleCustomName
          ? card.handleCustomName({ player, card, cardIndex })
          : card.name,
      description: card.description,
      value: card.id,
      default: card.id === player.chosenCards[cardIndex]?.cardId,
    });
  }
  return options;
}
