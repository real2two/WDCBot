import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import type { BaseInteraction, CustomAPIInteractionResponse } from '@httpi/client';
import { sendInteractionFollowup, sendInteractionResponse } from 'src/utils';
import type { WDCGame } from '../types';

export function startGameLoop({
  interaction,
  game,
}: { interaction: BaseInteraction; game: WDCGame }) {
  return handleGameLoop({ interaction, game });
}

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

  await sendInteractionResponse(interaction, {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: 'handle game loop',
    },
  });
}
