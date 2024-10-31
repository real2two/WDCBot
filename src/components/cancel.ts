import { Component } from '@httpi/client';
import { InteractionResponseType } from 'discord-api-types/v10';
import { sendInteractionResponse, deleteInteractionResponse } from '../utils';

export default new Component({
  customId: /^cancel$/,
  async execute({ interaction }) {
    // Delete the interaction
    await sendInteractionResponse(interaction, {
      type: InteractionResponseType.DeferredMessageUpdate,
    });
    await deleteInteractionResponse(interaction);
  },
});
