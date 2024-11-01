import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import type { BaseInteraction, CustomAPIInteractionResponse } from '@httpi/client';
import { sendInteractionFollowup, sendInteractionResponse } from 'src/utils';
import type { WDCGame } from '../types';

export async function startGame({
  interaction,
  respond,
  game,
}: {
  interaction: BaseInteraction;
  respond: (message: CustomAPIInteractionResponse) => unknown;
  game: WDCGame;
}) {
  // TODO: Have a way to disband the game after it starts (yes I wrote this comment twice)
  // TODO: Have an "automatic disband" system in place if messages stop being sent

  await sendInteractionResponse(interaction, {
    type: InteractionResponseType.DeferredChannelMessageWithSource,
  });

  await sendInteractionFollowup(interaction, {
    content: 'lmao',
  });
}
