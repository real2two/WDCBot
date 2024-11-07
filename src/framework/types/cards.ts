import type { APIEmbed, APIGuildMember, APIUser } from 'discord-api-types/v10';
import type { InteractionRequestData } from '@httpi/client';
import type { WDCGame, WDCGameChosenCard, WDCGamePlayer, WDCGamePlayerCard } from './games';
import type { Card } from '../structures';

export enum CardType {
  Offensive = 0,
  Defensive = 1,
  Supportive = 2,
}

export enum CardStep {
  Afk = 0,
  BeforeOrder = 1,
  Normal = 2,
  AfterOrder = 3,
}

export interface CardExecuteContext extends CardBeforeAfterContext {
  player: WDCGamePlayer;
  card: Card;
  playerCard: WDCGamePlayerCard;
  playerChosenCard: WDCGameChosenCard;
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
    player: WDCGamePlayer;
    playerCard: WDCGamePlayerCard;
    cardIndex: number;
  };

export interface CardHandleCustomNameContext {
  player: WDCGamePlayer;
  playerCard: WDCGamePlayerCard;
  card: Card;
  cardIndex: number;
}

export interface CardSelectUserData {
  id: string;
  user?: APIUser;
  member?: APIGuildMember;
}
