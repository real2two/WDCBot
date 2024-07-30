export interface WDCGame {
  channelId: string;
  hostId: string;
  mode: 'classic';
  state: WDCGameState;
  players: WDCPlayer[];
}

export enum WDCGameState {
  Prep = 0,
  Loading = 1,
  Started = 2,
}

export interface WDCPlayer {
  userId: string;
  cards: WDCCards[];
}

export type WDCCards = WDCCardTemplate;
export interface WDCCardTemplate {
  cardId: string;
}
