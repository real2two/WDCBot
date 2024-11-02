import type { Card } from '../structures';

export interface WDCGame {
  // Identification
  channelId: string;
  hostId: string;
  // Settings
  mode: 'classic';
  state: WDCGameState;
  publicInventory: boolean;
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
  health: number;
  cards: WDCGamePlayerCard[];
  submittedChosenCards: boolean;
  chosenCardIds: [string | null, string | null, string | null, string | null];
}

export type WDCGamePlayerCard = {
  cardId: string;
  quantity: number;
  turnsUntilUsable: number; // 0 by default
};
