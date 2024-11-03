import { cards } from '../cards';

export function getCard(cardId: string) {
  return cards.find(({ id }) => id === cardId);
}
