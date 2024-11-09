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

app.post('/game/duelify', async (c) => {
  if (env.DuelifyAuthorization !== c.req.header('Authorization')) {
    return c.json({ message: 'unauthorized' }, 401);
  }

  const {
    channel_id: channelId,
    uba: unbelievaboatAuthorization,
    guild_id: guildId,
    disable_rewards: disableRewards,
  } = await c.req.json();

  if (typeof channelId !== 'string' || !validSnowflake(channelId)) {
    return c.json({ message: 'invalid_channel_id' }, 400);
  }
  if (typeof unbelievaboatAuthorization !== 'string') {
    return c.json({ message: 'invalid_uba' }, 400);
  }
  if (typeof guildId !== 'string' || !validSnowflake(guildId)) {
    return c.json({ message: 'invalid_guild_id' }, 400);
  }
  if (typeof disableRewards !== 'boolean') {
    return c.json({ message: 'invalid_disable_rewards' }, 400);
  }

  if (getWDCGame(channelId)) {
    return c.json({ message: 'ongoing_game' }, 403);
  }

  const game = createWDCGame({
    channelId,
    hostId: null,
    disbanded: false,
    mode: 'classic',
    state: WDCGameState.Prep,
    metadata: {
      type: 'duelify',
      unbelievaboatAuthorization,
      guildId,
      disableRewards,
    },
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
        deleteWDCGame(channelId);
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
