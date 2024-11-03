import type { APIEmbed } from 'discord-api-types/v10';
import type { WDCGame, WDCGamePlayer } from './games';

export enum CardType {
  Offensive = 0,
  Defensive = 1,
  Supportive = 2,
}

export enum CardStep {
  BeforeOrder = 0,
  Normal = 1,
  AfterOrder = 2,
}

export interface CardExecuteContext extends CardBeforeAfterContext {
  player: WDCGamePlayer;
}

export interface CardBeforeAfterContext {
  game: WDCGame;
  round: number;
  turn: number;
  order: number;
  suborder: number;
  step: CardStep;
  respond: (message: string | APIEmbed[]) => unknown;
}
