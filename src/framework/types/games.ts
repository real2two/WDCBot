import type { Card } from '../structures';

export interface WDCGame {
  channelId: string;
  hostId: string;
  mode: 'classic';
  state: WDCGameState;
  players: WDCGamePlayer[];
  loopTimer: Timer | null;
  usedCardsWithBeforeAfterFunctions: Set<Card>;
  kv: Map<string, boolean | number | string | object>;
  turnsPerRound: number;
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
}

export type WDCGamePlayerCard = {
  cardId: string;
  quantity: number;
  turnsUntilUsable: number; // 0 by default
};
