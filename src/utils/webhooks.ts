import env from '../main/env';
import type { BaseInteraction } from '@httpi/client';
import type {
  APIInteractionResponse,
  APIInteractionResponseCallbackData,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
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

export function editInteractionResponse(
  interaction: BaseInteraction,
  data: RESTPatchAPIInteractionOriginalResponseJSONBody,
) {
  return editInteractionFollowup(interaction, '@original', data);
}

export function deleteInteractionResponse(interaction: BaseInteraction) {
  return deleteInteractionFollowup(interaction, '@original');
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

export function editInteractionFollowup(
  interaction: BaseInteraction,
  messageId: string,
  data: RESTPatchAPIInteractionOriginalResponseJSONBody,
) {
  return fetch(
    `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/${messageId}`,
    {
      method: 'patch',
      headers,
      body: JSON.stringify(data),
    },
  );
}

export function deleteInteractionFollowup(interaction: BaseInteraction, messageId: string) {
  return deleteWebhook(`${interaction.application_id}/${interaction.token}/messages/${messageId}`);
}

export function deleteWebhook(webhookId: string) {
  return fetch(`https://discord.com/api/v10/webhooks/${webhookId}`, {
    method: 'delete',
    headers,
  });
}
