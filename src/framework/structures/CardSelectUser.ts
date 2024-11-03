import {
  type APIGuildMember,
  type APIUser,
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
} from 'discord-api-types/v10';
import { Card } from './Card';
import type { CardHandleCustomInputContext } from '../types';

export class CardSelectUser extends Card {
  constructor(data: ConstructorParameters<typeof Card>[0]) {
    super(data);
    this.handleCustomInput = handleCustomInputCardSelectUser;
    this.handleCustomName = ({ player, card }) => {
      const data = player.chosenCards.find((c) => c?.cardId === card.id)!.data as {
        id: string;
        user?: APIUser;
        member?: APIGuildMember;
      };
      return `${card.name} ${data.member?.nick || data.user?.global_name || data.user?.username || data.id}`;
    };
  }
}

export function handleCustomInputCardSelectUser({
  respond,
  card,
  cardIndex,
}: CardHandleCustomInputContext) {
  return respond({
    type: InteractionResponseType.UpdateMessage,
    data: {
      content: `### Select your cards - User\nSelect a user to use **${card.name}** on:`,
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.UserSelect,
              custom_id: `select_cards:use:${cardIndex}:select_menu:${card.id}`,
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Secondary,
              label: 'Back',
              custom_id: 'select_cards:back',
            },
          ],
        },
      ],
    },
  });
}
