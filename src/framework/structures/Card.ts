import type { CardBeforeAfterContext, CardExecuteContext, CardType, WDCGame } from '../types';

export class Card {
  id: string;
  types: CardType[];
  name: string;
  description: string;
  image: string;
  emoji?: string;
  order: number;
  suborder: number;
  turnCooldown: number;
  quantity: number;
  execute: (ctx: CardExecuteContext) => void | Promise<void>;
  beforeOrder?: (ctx: CardBeforeAfterContext) => void | Promise<void>;
  afterOrder?: (ctx: CardBeforeAfterContext) => void | Promise<void>;

  constructor({
    id,
    name,
    types,
    description,
    image,
    emoji,
    order,
    suborder,
    turnCooldown,
    quantity,
    execute,
    beforeOrder,
    afterOrder,
  }: {
    id: string;
    types: CardType[];
    name: string;
    description: string;
    image?: string;
    emoji?: string;
    order?: number;
    suborder?: number;
    turnCooldown?: number;
    quantity?: number;
    execute: Card['execute'];
    beforeOrder?: Card['beforeOrder'];
    afterOrder?: Card['afterOrder'];
  }) {
    this.id = id;
    this.types = types;
    this.name = name;
    this.description = description;
    this.image = image || 'https://upload.wikimedia.org/wikipedia/commons/e/e0/PlaceholderLC.png';
    this.emoji = emoji;
    this.order = order || 0;
    this.suborder = suborder || 0;
    this.turnCooldown = turnCooldown || 0;
    this.quantity = quantity || Number.POSITIVE_INFINITY;
    this.execute = execute;
    this.beforeOrder = beforeOrder;
    this.afterOrder = afterOrder;

    if (this.id.length > 30 || this.name.length > 100 || this.description.length > 100)
      throw new Error(`Card id, name or description's length is too long: ${this.id}`);
  }
}
