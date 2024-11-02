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

export async function handleRoundLoop({
  interaction,
  game,
}: {
  interaction: BaseInteraction;
  game: WDCGame;
}) {
  // TODO: Save chosen cards for a player through <WDCGamePlayer>.chosenCardIds and use them when starting turn 1
  // TODO: Disallow players from selecting cards if <WDCGame>.currentlyHandlingTurns is true

  // Update the game's round (+1)
  game.round++;

  // Allows users to use cards again and set submit state as false
  for (const player of game.players) {
    player.submittedChosenCards = false;
  }
  game.currentlyHandlingTurns = false;

  // Clear cards selected from game
  for (const player of game.players) {
    player.chosenCardIds = [null, null, null, null];
  }

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

  // Set warning timers
  game.loopTimers.push(
    setTimeout(
      () =>
        sendInteractionFollowup(interaction, {
          content: '🕚 You have **10 more seconds left** to select your cards!',
        }),
      50000,
    ),
  );

  game.loopTimers.push(
    setTimeout(
      () =>
        sendInteractionFollowup(interaction, {
          content: '‼️ You have **5 more seconds left** to select your cards!',
        }),
      55000,
    ),
  );

  // Set handleTurnLoop timer if someone doesn't choose all their cards in time
  game.loopTimers.push(setTimeout(() => handleTurnLoop({ interaction, game }), 60000));
}

export async function handleTurnLoop({
  interaction,
  game,
}: {
  interaction: BaseInteraction;
  game: WDCGame;
}) {
  // Check if you're currently handling turns (prevents race-condition)
  if (game.currentlyHandlingTurns) return;
  game.currentlyHandlingTurns = true;

  // Clear all timers
  for (const timer of game.loopTimers ?? []) {
    clearTimeout(timer);
  }

  // Handle kicking AFK users
  const afkPlayers = game.players.filter((p) => !p.submittedChosenCards);
  if (afkPlayers.length) {
    for (const player of afkPlayers) {
      player.health = 0;
    }

    // TODO: Add messages for killing AFK users
    // const afkPlayerMentions = afkPlayers.map((p) => `<@${p.userId}>`);
    // if (afkPlayers.length === 1) {
    //   afkPlayerMentions[0];
    // } else {
    //   `${afkPlayerMentions.slice(0, -1).join(', ')} and ${afkPlayerMentions.slice(-1)}`;
    // }
  }

  // TODO: Have an "automatic disband" system in place if messages stop being sent
  // TODO: Have a button the host has to press to go to start the next round (to mitigate the 15 minute interaction limit issue)

  // TODO: Support "<Card>.beforeOrder" and "<Card>.afterOrder" as well.
  //       This can be done by adding cards to the "game.usedCardsWithBeforeAfterFunctions" Set<Card> after the card is used.
  //       Don't add card to Set<Card> if it's already in it or it doesn't have a <Card>.beforeOrder or <Card>.afterOrder function.

  await sendInteractionFollowup(interaction, {
    content: 'handle turn loop',
  });
}
