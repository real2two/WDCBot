import { Subcommand } from '@httpi/client';
import { ApplicationCommandOptionType, InteractionResponseType } from 'discord-api-types/v10';
import { cards, convertNamesArrayToText, getCard } from '../../framework';

export default new Subcommand({
  data: {
    name: 'get_card',
    description: "Get a card's information",
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: 'card',
        description: "The card's information to fetch",
        required: true,
        autocomplete: true,
      },
    ],
  },
  autocomplete({ interaction, respond }) {
    const cardId = interaction.data?.options?.[0]?.options?.[0]?.value as string;
    return respond({
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices: cards
          .filter((c) => c.id === cardId || c.name.includes(cardId?.trim()))
          .slice(0, 25)
          .map((c) => ({
            name: c.name,
            value: c.id,
          })),
      },
    });
  },
  execute({ user, interaction, respond }) {
    const cardId = interaction.data?.options?.[0]?.options?.[0]?.value as string;
    const card = getCard(cardId);

    if (!card) {
      return respond({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: '❌ Cannot find card with given card name/ID.',
        },
      });
    }

    return respond({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [
          {
            color: 0xffffff,
            author: {
              name: `${card.name}${card.emoji ? ` [${card.emoji}]` : ''}`,
            },
            description: `**Type${card.types.length === 1 ? '' : 's'}**: ${convertNamesArrayToText(
              card.types.map((t) => ['Offensive', 'Defensive', 'Supportive'][t]),
            )}\n**Description**: ${card.description}\n**Quantity**: ${card.quantity}\n**Turn cooldown**: ${card.turnCooldown}\n**Order**: ${card.order}`,
            image: card.image ? { url: card.image } : undefined,
            footer: {
              text: `ID: ${card.id}`,
            },
          },
        ],
      },
    });
  },
});
