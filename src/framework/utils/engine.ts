import {
  ButtonStyle,
  ComponentType,
  InteractionResponseType,
  MessageFlags,
} from 'discord-api-types/v10';
import type { BaseInteraction, CustomAPIInteractionResponse } from '@httpi/client';
import { sendInteractionFollowup, sendInteractionResponse } from '../../utils';
import { cards } from '../cards';
import type { WDCGame } from '../types';

export async function handleGameLoop({
  interaction,
  game,
}: {
  interaction: BaseInteraction;
  game: WDCGame;
}) {
  // TODO: Save chosen cards for a player through <WDCGamePlayer>.chosenCardIds and use them when starting turn 1
  // TODO: Make sure to clear <WDCGamePlayer>.chosenCardIds after a round ends (or turn 1 starts)

  // TODO: Have an "automatic disband" system in place if messages stop being sent

  // TODO: Handle kicking AFK users

  // TODO: Remember game.turnsPerRound exists (default: 4), so remember to support that!

  // TODO: To handle timeout loops, use this function
  //       game.loopTimer = setTimeout(() => {});

  // TODO: Support "<Card>.beforeOrder" and "<Card>.afterOrder" as well.
  //       This can be done by adding cards to the "game.usedCardsWithBeforeAfterFunctions" Set<Card> after the card is used.
  //       Don't add card to Set<Card> if it's already in it or it doesn't have a <Card>.beforeOrder or <Card>.afterOrder function.

  // Update the game's round (+1)
  game.round++;

  // Create response
  await sendInteractionResponse(interaction, {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [
        {
          color: 0x57f287,
          description: `## Round ${game.round}\n\n${game.players
            .map(
              (p) =>
                `- <@${p.userId}> ❤️ ${p.health}` +
                `${
                  game.publicInventory
                    ? ` ${p.cards
                        .filter((c) => c.quantity !== Number.POSITIVE_INFINITY)
                        .map(
                          (pc) =>
                            `${cards.find((c) => pc.cardId === c.id)?.emoji || '❓'} ${pc.quantity}`,
                        )
                        .join(' ')}`
                    : ''
                }`,
            )
            .join('\n')}`,
          footer: {
            text: 'Click on the button below to select your cards within 1 minute!',
          },
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Primary,
              custom_id: 'select_cards',
              label: 'Select your cards',
              emoji: {
                name: '🎴',
              },
            },
          ],
        },
      ],
    },
  });
}
