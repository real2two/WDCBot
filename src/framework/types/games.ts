import type { APIGuildMember, APIUser } from 'discord-api-types/v10';
import type { Card } from '../structures';
import type { CardStep } from './cards';

export interface WDCGame {
  // Identification
  channelId: string;
  hostId: string | null;
  lastRoundMessageId?: string;
  // Internal data
  disbanded: boolean;
  // metadata?: WDCMetadata;
  // Settings
  mode: 'classic';
  state: WDCGameState;
  publicInventory: boolean;
  defaultHealth: number;
  maxHealth: number;
  // Players
  players: WDCGamePlayer[];
  // Loop / Cards
  round: number;
  currentlyHandlingTurns: boolean;
  loopTimers: Timer[];
  usedCardsWithBeforeAfterFunctions: Set<Card>;
  kv: Map<string, boolean | number | string | object>;
}

export enum WDCGameState {
  Prep = 0,
  Loading = 1,
  Started = 2,
}

export interface WDCGamePlayer {
  userId: string;
  cached: {
    user?: APIUser;
    member?: APIGuildMember;
  };
  health: number;
  diedAt?: {
    round: number;
    turn: number;
    order: number;
    step: CardStep;
  };
  cards: WDCGamePlayerCard[];
  submittedChosenCards: boolean;
  chosenCards: [
    WDCGameChosenCard | null,
    WDCGameChosenCard | null,
    WDCGameChosenCard | null,
    WDCGameChosenCard | null,
  ];
}

export type WDCGamePlayerCard = {
  cardId: string;
  quantity: number;
};

export interface WDCGameChosenCard {
  cardId: string;
  data?: null | boolean | number | string | object;
}
