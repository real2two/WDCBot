import env from './env';
import commands from './commands';
import components from './components';
import { Hono } from 'hono';
import { handleHonoRequest } from '@httpi/adapter-hono';
import { createEvents } from '@httpi/client';
import { createWDCGame, deleteWDCGame, getWDCGame, startGame, WDCGameState } from '../framework';
import { createPrepEmbeds, sendChannelMessage, validSnowflake } from '../utils';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';

const app = new Hono();

app.get('/', (c) => c.text(`👋 ${env.DiscordClientId}`));

app.post(
  '/',
  async (c) =>
    await handleHonoRequest({
      context: c,
      publicKey: env.DiscordPublicKey,
      events: createEvents({
        commands,
        components,
      }),
    }),
);

app.all('*', (c) => c.text('Not found', 404));

export default {
  port: env.WebsitePort,
  fetch: app.fetch,
};
