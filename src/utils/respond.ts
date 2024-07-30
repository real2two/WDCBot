import env from '../main/env';
import type { BaseInteraction } from '@httpi/client';
import type {
  APIInteractionResponse,
  APIInteractionResponseCallbackData,
} from 'discord-api-types/v10';

const headers = {
  'content-type': 'application/json',
  authorization: env.DiscordToken,
};

export function sendInteractionResponse(
  interaction: BaseInteraction,
  data: APIInteractionResponse,
) {
  return fetch(
    `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
    {
      method: 'post',
      headers,
      body: JSON.stringify(data),
    },
  );
}

export function deleteInteractionResponse(interaction: BaseInteraction) {
  return fetch(
    `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`,
    {
      method: 'delete',
      headers,
    },
  );
}

export function sendInteractionFollowup(
  interaction: BaseInteraction,
  data: APIInteractionResponseCallbackData,
) {
  return fetch(
    `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`,
    {
      method: 'post',
      headers,
      body: JSON.stringify(data),
    },
  );
}
