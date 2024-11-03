import { CommandWithSubcommands } from '@httpi/client';
import { ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';

import card from './wdc/card';
import disband from './wdc/disband';
import start from './wdc/start';

export default new CommandWithSubcommands({
  data: {
    name: 'wdc',
    description: 'List of Wildly Deadly Cards commands',
    integration_types: [
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ],
    contexts: [
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ],
  },
  subcommands: [card, disband, start],
});
