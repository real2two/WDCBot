import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { sendChannelMessage } from '../../utils';
import { deleteWDCGame } from './games';
import { convertPlayersToText } from './cards';
import { convertNamesArrayToText } from './text';
import type { WDCGame } from '../types';
import { wait, waitRandom } from './timers';

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
        description: `## Round ${game.round}\n\n${convertPlayersToText(game)}`,
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

  for (let turn = 1; turn <= 4; turn++) {
    // Handle turn message here
    const { status } = await sendChannelMessage(channelId, {
      embeds: [
        {
          color: 0xfee75c,
          description: `### Status - Turn ${turn}\n\n${convertPlayersToText(game)}`,
        },
      ],
    });
    if (status !== 200) return deleteWDCGame(channelId);

    await waitRandom(2000, 5000);

    // Handle kicking AFK users (turn 1 only)
    if (turn === 1) {
      const afkPlayers = game.players.filter((p) => !p.submittedChosenCards);
      if (afkPlayers.length) {
        for (const player of afkPlayers) {
          // Kill AFK player
          player.health = 0;
          // If you never submitted, you never chose any cards
          player.chosenCardIds = [null, null, null, null];
        }
        // Send AFK kill message
        const { status } = await sendChannelMessage(channelId, {
          embeds: [
            {
              color: 0xeb459e,
              description: `💥 ${convertNamesArrayToText(afkPlayers.map((p) => `<@${p.userId}>`))} ${afkPlayers.length === 1 ? 'has' : 'have'} exploded for being AFK.`,
            },
          ],
        });
        if (status !== 200) return deleteWDCGame(channelId);
      }
    }

    await waitRandom(1000, 2000);

    if (handleTurnStatusCheck({ channelId, game, turn, order: 0 })) return;

    // Handle turn actions here

    // TODO: Use <WDCGamePlayer>.chosenCardIds for turns
    // TODO: Make sure to disband the game if there's ever a send channel message error

    // TODO: Support "<Card>.beforeOrder" and "<Card>.afterOrder" as well.
    //       This can be done by adding cards to the "game.usedCardsWithBeforeAfterFunctions" Set<Card> after the card is used.
    //       Don't add card to Set<Card> if it's already in it or it doesn't have a <Card>.beforeOrder or <Card>.afterOrder function.

    await wait(10000);
  }

  // Start next round
  return handleRoundLoop({ channelId, game });
}

function handleTurnStatusCheck({
  channelId,
  game,
  turn,
  order,
}: {
  channelId: string;
  game: WDCGame;
  turn: number;
  order: number;
}): boolean {
  // Get amount of players that are still alive and declare "diedAt" if a player died.
  let alive = 0;
  for (const player of game.players) {
    if (player.health <= 0) {
      if (player.diedAt) continue;
      player.diedAt = { round: game.round, turn, order };
    } else {
      alive++;
    }
  }

  // If people are still alive or there isn't a winner:
  if (alive > 1) {
    // If anyone has negative health set it to 0
    for (const player of game.players) {
      player.health = 0;
    }
    // Return false if the game didn't end
    return false;
  }

  // Get winners
  const players = game.players
    .filter((p) => !p.diedAt || (p.diedAt.round === game.round && p.diedAt.turn === turn))
    .sort((a, b) => b.health - a.health);
  const winners = players.filter((p) => players[0].health === p.health);

  const endOfTurnEmbed = {
    color: 0xfee75c,
    description: `### Status - End of turn ${turn}\n\n${convertPlayersToText(game, { round: game.round, turn, order })}`,
  };

  if (winners.length === 1) {
    // Send winner message (1 winner)
    sendChannelMessage(channelId, {
      embeds: [
        endOfTurnEmbed,
        {
          color: 0x57f287,
          description: `# 🎉 <@${winners[0].userId}> has won the match!`,
        },
      ],
    });
  } else {
    // Send tied message
    sendChannelMessage(channelId, {
      embeds: [
        endOfTurnEmbed,
        {
          color: 0x57f287,
          description: `# 🎉 ${convertNamesArrayToText(winners.map((p) => `<@${p.userId}>`))} have tied in the match!`,
        },
      ],
    });
  }

  // Delete the game
  deleteWDCGame(channelId);

  // Return true if the game ends
  return true;
}
