import type { WDCGame } from '../main/types';

export class Card {
  id: string;
  name: string;
  description: string;
  image: string;
  order: number;
  suborder: number;
  turnCooldown: number;
  quantity: number;
  execute: (ctx: { game: WDCGame }) => void;

  constructor({
    id,
    name,
    description,
    image = 'https://upload.wikimedia.org/wikipedia/commons/e/e0/PlaceholderLC.png',
    order = 0,
    suborder = 0,
    turnCooldown = 0,
    quantity = Number.POSITIVE_INFINITY,
    execute,
  }: {
    id: string;
    name: string;
    description: string;
    image?: string;
    order?: number;
    suborder?: number;
    turnCooldown?: number;
    quantity?: number;
    execute: Card['execute'];
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.order = order;
    this.suborder = suborder;
    this.turnCooldown = turnCooldown;
    this.quantity = quantity;
    this.execute = execute;
  }
}
