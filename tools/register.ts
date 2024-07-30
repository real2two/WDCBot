import env from '../src/main/env';
import { createCommands } from '@httpi/client';
import commands from '../src/main/commands';

const result = await createCommands({
  id: env.DiscordClientId,
  token: env.DiscordToken,
  commands,
});

console.log(result);
process.exit();
