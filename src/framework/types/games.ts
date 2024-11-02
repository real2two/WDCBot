import type { Card } from '../structures';

export interface WDCGame {
  // Identification
  channelId: string;
  hostId: string;
  // Settings
  mode: 'classic';
  state: WDCGameState;
  turnsPerRound: number;
  // Players
  players: WDCGamePlayer[];
  // Loop / Cards
  loopTimer: Timer | null;
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
  chosenCardIds: string[];
}

export type WDCGamePlayerCard = {
  cardId: string;
  quantity: number;
  turnsUntilUsable: number; // 0 by default
};
