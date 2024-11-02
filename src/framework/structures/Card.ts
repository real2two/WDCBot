import type { CardType, WDCGame } from '../types';

export class Card {
  id: string;
  types: CardType[];
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
    types,
    description,
    image,
    order,
    suborder,
    turnCooldown,
    quantity,
    execute,
  }: {
    id: string;
    types: CardType[];
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
    this.types = types;
    this.name = name;
    this.description = description;
    this.image = image || 'https://upload.wikimedia.org/wikipedia/commons/e/e0/PlaceholderLC.png';
    this.order = order || 0;
    this.suborder = suborder || 0;
    this.turnCooldown = turnCooldown || 0;
    this.quantity = quantity || Number.POSITIVE_INFINITY;
    this.execute = execute;
  }
}
