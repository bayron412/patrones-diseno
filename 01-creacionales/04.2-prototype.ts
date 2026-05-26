/**
 * ! Patrón Prototype:

 * Es un patrón de diseño creacional que nos permite copiar objetos existentes sin hacer
 * que el código dependa de sus clases.
 *
 * * Es útil cuando queremos duplicar el contenido,
 * * el título y el autor de un documento, por ejemplo o cualquier objeto complejo.
 *
 * https://refactoring.guru/es/design-patterns/prototype
 */

interface PockemosConfig {
  name: string;
  type: string;
  level: number;
  attacks: string[];
}

class Pokemon {
  constructor(public config: PockemosConfig) {}

  // Método para clonar el Pokémon
  clone(): Pokemon {
    return new Pokemon(structuredClone(this.config));
  }

  setName(name: string): this {
    this.config.name = name;
    return this;
  }

  setType(type: string): this {
    this.config.type = type;
    return this;
  }

  setLevel(level: number): this {
    this.config.level = level;
    return this;
  }

  setAttacks(attack: string): this {
    this.config.attacks.push(attack);
    return this;
  }

  displayInfo(): void {
    console.log(
      `Nombre: ${this.config.name}\nTipo: ${this.config.type}\nNivel: ${this.config.level}\nAtaques: ${
        this.config.attacks.join(", ")
      }`,
    );
  }
}

// Tarea:
// 1. Crear un Pokémon base.
// 2. Clonar el Pokémon base y modificar algunos atributos en los clones.
// 3. Llamar a displayInfo en cada Pokémon para mostrar sus detalles.

// Ejemplo:
const basePokemon = new Pokemon({
  name: "Charmander",
  type: "Fuego",
  level: 1,
  attacks: ["Llamarada", "Arañazo"],
});

const clone1 = basePokemon.clone();

clone1.setName("Charmeleon");
clone1.setLevel(16);
clone1.setAttacks("Lanzallamas");

console.log("Pokémon Base:");
basePokemon.displayInfo(); // Aquí no debe de aparecer "Lanzallamas"

console.log("\nClon 1:");
clone1.displayInfo();
