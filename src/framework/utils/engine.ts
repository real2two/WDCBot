import { type APIEmbed, ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { sendChannelMessage } from '../../utils';
import { deleteWDCGame } from './games';
import { convertPlayersToText, getCard } from './cards';
import { convertNamesArrayToText, sortGroupByOrder } from './utils';
import { CardStep, type WDCGame } from '../types';
import { wait, waitRandom } from './timers';

export async function handleRoundLoop({ game }: { game: WDCGame }) {
  // Check if the game was disbanded
  if (game.disbanded) return;

  // Update the game's round (+1)
  game.round++;

  // Allows users to use cards again and set submit state as false
  for (const player of game.players) {
    player.submittedChosenCards = false;
  }
  game.currentlyHandlingTurns = false;

  // Clear cards selected from game
  for (const player of game.players) {
    player.chosenCards = [null, null, null, null];
  }

  // Create response
  const res = await sendChannelMessage(game.channelId, {
    embeds: [
      {
        color: 0x57f287,
        description: `## Round ${game.round}\n\n${convertPlayersToText(game, { showEmojis: true })}`,
        footer: {
          text: 'Click on the button below to select your cards within 2 minutes!',
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
  });
  if (res.status !== 200) return deleteWDCGame(game.channelId);

  try {
    const { id } = await res.json();
    game.lastRoundMessageId = id;
  } catch (err) {
    console.error(err);
    return deleteWDCGame(game.channelId);
  }

  // Set warning timers
  game.loopTimers.push(
    setTimeout(async () => {
      const { status } = await sendChannelMessage(game.channelId, {
        content: '🕚 You have **10 more seconds left** to select your cards!',
      });
      if (status !== 200) return deleteWDCGame(game.channelId);
    }, 110000),
  );

  game.loopTimers.push(
    setTimeout(async () => {
      const { status } = await sendChannelMessage(game.channelId, {
        content: '‼️ You have **5 more seconds left** to select your cards!',
      });
      if (status !== 200) return deleteWDCGame(game.channelId);
    }, 115000),
  );

  // Set handleTurnLoop timer if someone doesn't choose all their cards in time
  game.loopTimers.push(setTimeout(() => handleTurnLoop({ game }), 120000));
}

export async function handleTurnLoop({ game }: { game: WDCGame }) {
  // Check if the game was disbanded
  if (game.disbanded) return;

  // Check if you're currently handling turns (prevents race-condition)
  if (game.currentlyHandlingTurns) return;
  game.currentlyHandlingTurns = true;

  // Clear all timers
  for (const timer of game.loopTimers ?? []) {
    clearTimeout(timer);
  }

  // Clear round message
  game.lastRoundMessageId = undefined;

  for (let turn = 1; turn <= 4; turn++) {
    // Handle turn message here
    const { status } = await sendChannelMessage(game.channelId, {
      embeds: [
        {
          color: 0xfee75c,
          description: `### Status - Turn ${turn}\n\n${convertPlayersToText(game)}`,
        },
      ],
    });
    if (status !== 200) return deleteWDCGame(game.channelId);

    // Handle kicking AFK users (turn 1 only)
    await waitRandom(1000, 3500);
    if (game.disbanded) return; // Check if the game was disbanded

    if (turn === 1) {
      const afkPlayers = game.players.filter((p) => !p.submittedChosenCards && !p.diedAt);
      if (afkPlayers.length) {
        for (const player of afkPlayers) {
          // Kill AFK player
          player.health = 0;
          // If you never submitted, you never chose any cards
          player.chosenCards = [null, null, null, null];
        }
        // Send AFK kill message
        const { status } = await sendChannelMessage(game.channelId, {
          embeds: [
            {
              color: 0xed4245,
              description: `💥 ${convertNamesArrayToText(afkPlayers.map((p) => `<@${p.userId}>`))} ${afkPlayers.length === 1 ? 'has' : 'have'} exploded for being AFK.`,
            },
          ],
        });
        if (status !== 200) return deleteWDCGame(game.channelId);

        // Check for win/tie condition after AFK kills
        await waitRandom(1000, 3500);

        if (
          await handleTurnStatusCheck({
            game,
            turn,
            order: Number.NEGATIVE_INFINITY,
            step: CardStep.Afk,
            skipDeathMessages: true,
          })
        )
          return;
      }
    }

    // Loop through orders here
    const chosenCardSortedByOrderForTurn = sortGroupByOrder(
      game.players
        .filter((p) => p.submittedChosenCards)
        .map((p) => ({ player: p, card: getCard(p.chosenCards[turn - 1]!.cardId)! })),
      ({ card }) => card.order,
    );

    for (const [order, chosenCardsForOrder] of chosenCardSortedByOrderForTurn) {
      // Handle suborders
      const chosenCardSortedBySuborderForOrder = sortGroupByOrder(
        chosenCardsForOrder,
        ({ card }) => card.suborder,
      );

      // Partial execute context
      let failedToRespond = false;
      const partialContext = {
        game,
        round: game.round,
        turn,
        order,
        respond: async (message: string | APIEmbed[]) => {
          if (failedToRespond || game.disbanded) return null;

          const res = await sendChannelMessage(game.channelId, {
            embeds:
              typeof message === 'string'
                ? [
                    {
                      color: 0xeb459e,
                      description: message,
                    },
                  ]
                : message,
          });

          if (res.status !== 200) {
            failedToRespond = true;
            deleteWDCGame(game.channelId);
          }

          return res;
        },
      };

      // Handle beforeOrder here
      for (const card of game.usedCardsWithBeforeAfterFunctions) {
        await card.beforeOrder?.({ ...partialContext, suborder: 0, step: CardStep.BeforeOrder });
        if (failedToRespond) return;

        await waitRandom(1000, 3500);
        if (game.disbanded) return; // Check if the game was disbanded
      }

      if (await handleTurnStatusCheck({ game, turn, order, step: CardStep.BeforeOrder })) return;

      for (const [suborder, chosenCardsForSuborder] of chosenCardSortedBySuborderForOrder) {
        // Handle suborder
        for (const { player, card } of chosenCardsForSuborder) {
          // Ignore dead players
          if (player.diedAt) continue;

          // Execute card
          await card.execute({
            ...partialContext,
            player,
            card,
            playerCard: player.cards.find((c) => c.cardId === card.id)!,
            playerChosenCard: player.chosenCards.find((c) => c?.cardId === card.id)!,
            suborder,
            step: CardStep.Normal,
          });

          if (failedToRespond || game.disbanded) return;

          // Add cards to set if they have the beforeOrder/afterOrder function(s)
          if (
            (card.beforeOrder || card.afterOrder) &&
            !game.usedCardsWithBeforeAfterFunctions.has(card)
          ) {
            game.usedCardsWithBeforeAfterFunctions.add(card);
          }

          await waitRandom(1000, 3500);
          if (game.disbanded) return; // Check if the game was disbanded
        }
      }

      if (await handleTurnStatusCheck({ game, turn, order, step: CardStep.Normal })) return;

      // Handle afterOrder here
      for (const card of game.usedCardsWithBeforeAfterFunctions) {
        await card.afterOrder?.({ ...partialContext, suborder: 0, step: CardStep.AfterOrder });
        if (failedToRespond) return;

        await waitRandom(1000, 3500);
        if (game.disbanded) return; // Check if the game was disbanded
      }

      if (await handleTurnStatusCheck({ game, turn, order, step: CardStep.AfterOrder })) return;
    }

    await wait(10000);
  }

  // Start next round
  return handleRoundLoop({ game });
}

async function handleTurnStatusCheck({
  game,
  turn,
  order,
  step,
  skipDeathMessages,
}: {
  game: WDCGame;
  turn: number;
  order: number;
  step: CardStep;
  skipDeathMessages?: boolean;
}): Promise<boolean> {
  // Check if the game was disbanded
  if (game.disbanded) return true;

  // Get amount of players that are still alive and declare "diedAt" if a player died.
  let alive = 0;
  for (const player of game.players) {
    if (player.health <= 0) {
      if (player.diedAt) continue;
      player.diedAt = { round: game.round, turn, order, step };
    } else {
      alive++;
    }
  }

  // If people are still alive or there isn't a winner:
  if (alive > 1) {
    // If anyone has negative health set it to 0
    for (const player of game.players.filter((p) => p.health < 0)) {
      player.health = 0;
    }

    if (!skipDeathMessages) {
      const playersWhoDiedThisRound = game.players
        .filter(
          (p) =>
            p.diedAt?.round === game.round && p.diedAt?.turn === turn && p.diedAt?.step === step,
        )
        .sort((a, b) => b.health - a.health);

      if (playersWhoDiedThisRound.length) {
        const { status } = await sendChannelMessage(game.channelId, {
          embeds: [
            {
              color: 0xed4245,
              description: `☠️ ${convertNamesArrayToText(playersWhoDiedThisRound.map((p) => `<@${p.userId}>`))} ${playersWhoDiedThisRound.length === 1 ? 'has' : 'have'} died this round!`,
            },
          ],
        });

        if (status !== 200) {
          deleteWDCGame(game.channelId);
          return true;
        }
      }
    }

    await waitRandom(1000, 3500);

    // Check if the game was disbanded
    if (game.disbanded) return true;

    // Return false if the game didn't end
    return false;
  }

  // Get winners
  const players = game.players
    .filter(
      (p) =>
        !p.diedAt ||
        (p.diedAt.round === game.round && p.diedAt.turn === turn && p.diedAt.step === step),
    )
    .sort((a, b) => b.health - a.health);
  const winners = players.filter((p) => players[0].health === p.health);

  const endOfTurnEmbed = {
    color: 0xfee75c,
    description: `### Status - End of turn ${turn}\n\n${convertPlayersToText(game, { round: game.round, turn, order, step })}`,
  };

  if (winners.length === 1) {
    // Send winner message (1 winner)
    sendChannelMessage(game.channelId, {
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
    sendChannelMessage(game.channelId, {
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
  deleteWDCGame(game.channelId);

  // Return true if the game ends
  return true;
}
