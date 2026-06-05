/**
 * ! Patrón Iterator
 * Este patrón permite recorrer los elementos de una colección sin exponer
 * la estructura interna de la colección.
 *
 * * Es útil cuando se necesita recorrer una colección de elementos sin importar
 * * cómo se almacenan los elementos.
 *
 * https://refactoring.guru/es/design-patterns/iterator
 */

interface Iterator<T> {
  next(): T | null;
  hasNext(): boolean;
  current(): T | null;
}

class Card {
  name: string;
  value: number;

  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }
}

class CardCollection {

  private cards: Card[] = [];

  addCard(card: Card): void {
    this.cards.push(card);
  }

  getCardAt(index: number): Card | null {

    if (index < 0 || index >= this.cards.length) return null;

    return this.cards[index];

  }

  getLength(): number {
    return this.cards.length;
  }

  //TODO:
  createIterator(): CardIterator {
    return new CardIterator(this);
  }

}

class CardIterator implements Iterator<Card> {

  private collection: CardCollection;
  private index: number = 0;

  constructor(collection: CardCollection) {
    this.collection = collection;
  }

  next(): Card | null {

    if (this.hasNext()) {
      return this.collection.getCardAt(this.index++);
    }

    return null;

  }

  hasNext(): boolean {
    return this.index < this.collection.getLength();
  }

  current(): Card | null {
    return this.collection.getCardAt(this.index);
  }

}

function main() {

  const deck = new CardCollection();

  // Agregar algunas cartas a la colección
  deck.addCard(new Card('As de Corazones', 1));
  deck.addCard(new Card('Rey de Corazones', 13));
  deck.addCard(new Card('Reina de Corazones', 12));
  deck.addCard(new Card('Jota de Corazones', 11));

  const iterator = deck.createIterator();

  while (iterator.hasNext()) {
    const card = iterator.next();
    console.log(`${card?.name} has a value of ${card?.value}.`);
  }

}

main();