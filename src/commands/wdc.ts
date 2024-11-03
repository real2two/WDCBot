import { CommandWithSubcommands } from '@httpi/client';
import { ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';

import start from './wdc/start';
import disband from './wdc/disband';
import getCard from './wdc/getCard';
import allCards from './wdc/allCards';

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
  subcommands: [start, disband, getCard, allCards],
});
