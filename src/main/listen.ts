import env from './env';
import commands from './commands';
import components from './components';
import { Hono } from 'hono';
import { handleHonoRequest } from '@httpi/adapter-hono';
import { createEvents } from '@httpi/client';
import { createWDCGame, deleteWDCGame, startGame, WDCGameState } from '../framework';
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

app.post('/game', async (c) => {
  if (env.SecretAuthorization !== c.req.header('Authorization')) {
    return c.json({ message: 'unauthorized' }, 401);
  }

  const { channel_id: channelId } = await c.req.json();
  if (typeof channelId !== 'string' || !validSnowflake(channelId)) {
    return c.json({ message: 'invalid_channel_id' }, 400);
  }

  const game = createWDCGame({
    channelId,
    hostId: null,
    mode: 'classic',
    state: WDCGameState.Prep,
    publicInventory: true,
    defaultHealth: 7,
    maxHealth: 10,
    players: [],
    round: 0,
    currentlyHandlingTurns: false,
    loopTimers: [],
    usedCardsWithBeforeAfterFunctions: new Set(),
    kv: new Map(),
  });

  const res = await sendChannelMessage(channelId, {
    content: `<@${env.DiscordClientId}>`,
    embeds: createPrepEmbeds(game),
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            style: ButtonStyle.Primary,
            custom_id: 'join',
            label: 'Join',
          },
        ],
      },
    ],
  });

  if (res.status !== 200) {
    deleteWDCGame(channelId);
    return c.json({ message: 'failed_to_send' }, 403);
  }

  game.loopTimers.push(
    setTimeout(() => {
      if (game.players.length < 2) {
        return sendChannelMessage(channelId, {
          content: '❌ Game has been cancelled because not enough people joined the game!',
        });
      }
      return startGame(game);
    }, 60000),
  );

  return c.json({ message: 'success' });
});

app.all('*', (c) => c.text('Not found', 404));

export default {
  port: env.WebsitePort,
  fetch: app.fetch,
};
