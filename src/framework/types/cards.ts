import type { APIEmbed } from 'discord-api-types/v10';
import type { InteractionRequestData } from '@httpi/client';
import type { WDCGame, WDCGamePlayer, WDCGamePlayerCard } from './games';
import type { Card } from '../structures';

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

export interface CardBeforeAfterContext extends CardGameContext {
  round: number;
  turn: number;
  order: number;
  suborder: number;
  step: CardStep;
  respond: (message: string | APIEmbed[]) => unknown;
}

export interface CardGameContext {
  game: WDCGame;
}

export type CardHandleCustomInputContext = Omit<InteractionRequestData, 'env'> &
  CardGameContext & {
    card: Card;
    playerCard: WDCGamePlayerCard;
    cardIndex: number;
  };

export interface CardHandleCustomNameContext {
  player: WDCGamePlayer;
  card: Card;
  cardIndex: number;
}
