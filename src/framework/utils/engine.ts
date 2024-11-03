import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { sendChannelMessage } from '../../utils';
import { cards } from '../cards';
import { deleteWDCGame } from './games';
import type { WDCGame } from '../types';

export async function handleRoundLoop({
  channelId,
  game,
}: {
  channelId: string;
  game: WDCGame;
}) {
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
  const { status } = await sendChannelMessage(channelId, {
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
            custom_id: 'g:select_cards',
            label: 'Select your cards',
            emoji: {
              name: '🎴',
            },
          },
        ],
      },
    ],
  });
  if (status !== 200) return deleteWDCGame(channelId);

  // Set warning timers
  game.loopTimers.push(
    setTimeout(async () => {
      const { status } = await sendChannelMessage(channelId, {
        content: '🕚 You have **10 more seconds left** to select your cards!',
      });
      if (status !== 200) return deleteWDCGame(channelId);
    }, 50000),
  );

  game.loopTimers.push(
    setTimeout(async () => {
      const { status } = await sendChannelMessage(channelId, {
        content: '‼️ You have **5 more seconds left** to select your cards!',
      });
      if (status !== 200) return deleteWDCGame(channelId);
    }, 55000),
  );

  // Set handleTurnLoop timer if someone doesn't choose all their cards in time
  game.loopTimers.push(setTimeout(() => handleTurnLoop({ channelId, game }), 60000));
}

export async function handleTurnLoop({
  channelId,
  game,
}: {
  channelId: string;
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
      player.chosenCardIds = [null, null, null, null];
    }

    // TODO: Add messages for killing AFK users
    // const afkPlayerMentions = afkPlayers.map((p) => `<@${p.userId}>`);
    // if (afkPlayers.length === 1) {
    //   afkPlayerMentions[0];
    // } else {
    //   `${afkPlayerMentions.slice(0, -1).join(', ')} and ${afkPlayerMentions.slice(-1)}`;
    // }
  }

  // TODO: Use <WDCGamePlayer>.chosenCardIds for turns

  // TODO: Support "<Card>.beforeOrder" and "<Card>.afterOrder" as well.
  //       This can be done by adding cards to the "game.usedCardsWithBeforeAfterFunctions" Set<Card> after the card is used.
  //       Don't add card to Set<Card> if it's already in it or it doesn't have a <Card>.beforeOrder or <Card>.afterOrder function.

  const { status } = await sendChannelMessage(channelId, {
    content: 'handle turn loop',
  });
  if (status !== 200) return deleteWDCGame(channelId);

  // TODO: Make sure to disband the game if there's ever a send channel message error
}
