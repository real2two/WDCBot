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
  // TODO: Have an "automatic disband" system in place if messages stop being sent

  // TODO: TO handle timeout loops, use this function
  // game.loopTimer = setTimeout(() => {});

  await sendInteractionResponse(interaction, {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: 'handle game loop',
    },
  });
}
