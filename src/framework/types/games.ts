export interface WDCGame {
  channelId: string;
  hostId: string;
  mode: 'classic';
  state: WDCGameState;
  players: WDCPlayer[];
  loopTimer: Timer | null;
}

export enum WDCGameState {
  Prep = 0,
  Loading = 1,
  Started = 2,
}

export interface WDCPlayer {
  userId: string;
  health: number;
  cards: WDCCards[];
  effects: WDCEffects[];
}

export type WDCCards = WDCCardBase;
export interface WDCCardBase {
  cardId: string;
  quantity: number;
  turnsUntilUsable: number; // 0 by default
}

export type WDCEffects = WDCEffectBase | WDCEffectPowerup;
export interface WDCEffectPowerup {
  effectId: 'powerup';
  turnsLeft: number;
}
export interface WDCEffectBase {
  effectId: string;
}
