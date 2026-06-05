/**
 * ! Patrón Strategy
 *
 * El patrón Strategy es un patrón de diseño de software que define una
 * familia de algoritmos, los encapsula y los hace intercambiables.
 *
 *
 * * Es útil cuando se tiene una clase que tiene un comportamiento que puede
 * * cambiar en tiempo de ejecución y se quiere delegar la responsabilidad de
 * * la implementación a otra clase.
 *
 * https://refactoring.guru/es/design-patterns/strategy
 */

/**
 * !Objetivo: Explicar el patrón Strategy usando un ejemplo donde varios
 * ! patitos compiten en una carrera y cada uno tiene su propia
 * ! estrategia de movimiento (por ejemplo, nadar, volar o caminar).
 */

import { COLORS } from '../helpers/index.ts';

interface MovementStrategy {
  move(name: string): void;
}

// Strategy 1 - Mas rapida pero costosa
class SwimFast implements MovementStrategy {

  move(name: string): void {
    console.log(`%c${name} nada rápido en el agua... 🦆`, COLORS.blue);
  }

}

// Strategy 2 - No tan rapida pero no tan costosa
class FlyOverWater implements MovementStrategy {
  move(name: string): void {
    console.log(`%c${name} vuela elegantement sobre el agua... 🦆`, COLORS.cyan);
  }
}

// Strategy 3 - Lenta y economica
class WalkClumsily implements MovementStrategy {

  move(name: string): void {
    console.log(`%c${name} camina torpemente por la orilla... 🦆`, COLORS.green);
  }

}

// Implment

class Duck {

  private name: string;
  private movementStrategy: MovementStrategy;

  constructor(name: string, movementStrategy: MovementStrategy) {

    this.name = name;
    this.movementStrategy = movementStrategy;

    console.log(`%c${name} %cesta listo para competir...`, COLORS.orange, COLORS.white);

  }

  performMove(): void {
    console.log(`${this.name} se prepara para moverse...`);
    this.movementStrategy.move(this.name);
  }

  setMovementStrategy(moveStrategy: MovementStrategy): void {
    this.movementStrategy = moveStrategy;
    console.log(`%cEl Pato ${this.name} %cha cambiado su estrategia de movimiento...`, COLORS.blue, COLORS.white)
  }

}

function main() {

  console.log('\n');

  const duck1 = new Duck('Pato Nadador', new SwimFast());
  const duck2 = new Duck('Pato Volador', new FlyOverWater());
  const duck3 = new Duck('Pato Caminante', new WalkClumsily());

  console.log('\n');
  console.log(`%cLlega el momento de la competencia... `, COLORS.red);
  console.log('\n');

  duck1.performMove();
  console.log('\n');
  duck2.performMove();
  console.log('\n');
  duck3.performMove();

  console.log('\n');
  duck3.setMovementStrategy(new FlyOverWater());
  duck3.performMove();

  console.log('\n');
  duck3.setMovementStrategy(new SwimFast());
  duck3.performMove();

  console.log('\n');

}

main();
