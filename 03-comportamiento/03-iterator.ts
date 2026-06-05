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

class Pokemon {

  public name: string;
  public type: string;

  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }

}


class PokemonCollection {

  private pokemons: Pokemon[] = [];

  addPokemon(pokemon: Pokemon): void {
    this.pokemons.push(pokemon);
  }

  getPokemonAt(index: number): Pokemon | null {

    if (index < 0 || index >= this.pokemons.length) return null;

    return this.pokemons[index];

  }

  getLength(): number {
    return this.pokemons.length;
  }

  //TODO:
  createIterator(): PokemonIterator {
    return new PokemonIterator(this);
  }

}

class PokemonIterator implements Iterator<Pokemon> {

  private collection: PokemonCollection;
  private index: number = 0;

  constructor(collection: PokemonCollection) {
    this.collection = collection;
  }

  next(): Pokemon | null {

    if (this.hasNext()) {
      return this.collection.getPokemonAt(this.index++);
    }

    return null;

  }

  hasNext(): boolean {
    return this.index < this.collection.getLength();
  }

  current(): Pokemon | null {
    return this.collection.getPokemonAt(this.index);
  }

}

function main() {

  const pokedex = new PokemonCollection();

  pokedex.addPokemon(new Pokemon('Pikachu', 'Electric'));
  pokedex.addPokemon(new Pokemon('Charmander', 'Fire'));
  pokedex.addPokemon(new Pokemon('Squirtle', 'Water'));
  pokedex.addPokemon(new Pokemon('Bulbasaur', 'Grass'));
  pokedex.addPokemon(new Pokemon('Eevee', 'Normal'));

  const iterator = pokedex.createIterator();

  while (iterator.hasNext()) {
    const pokemon = iterator.next();
    console.log(`${pokemon?.name} is a ${pokemon?.type} type.`);
  }

}

main();