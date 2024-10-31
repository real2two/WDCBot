import { InteractionResponseType, MessageFlags } from 'discord-api-types/v10';
import type { CustomAPIInteractionResponse } from '@httpi/client';
import type { WDCGame } from '../types';

export function startGame(
  game: WDCGame,
  respond: (message: CustomAPIInteractionResponse) => unknown,
) {
  // TODO: Have a way to disband the game after it starts
  // TODO: Have an "automatic disband" system in place if messages stop being sent

  return respond({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: 'super big wip start',
      flags: MessageFlags.Ephemeral,
    },
  });
}
