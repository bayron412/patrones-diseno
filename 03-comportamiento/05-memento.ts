/**
 * !Patrón Memento
 * Permite capturar y externalizar un estado interno de un objeto,
 * de manera que el objeto pueda ser restaurado a ese estado más tarde.
 *
 * * Es útil cuando se necesita guardar el estado de un objeto para poder
 * * volver a él en un futuro.
 *
 * https://refactoring.guru/es/design-patterns/memento
 */

import { COLORS } from "../helpers/index.ts";

class GameMemento {

  private level: number;
  private health: number;
  private position: string;

  constructor(level: number, health: number, position: string) {
    this.level = level;
    this.health = health;
    this.position = position;
  }

  getLevel(): number {
    return this.level;
  }

  getHealth(): number {
    return this.health;
  }

  getPosition(): string {
    return this.position;
  }

}

class Game {

  private level: number = 1;
  private health: number = 100;
  private position: string = 'start';

  constructor() {

    console.log(`Game started at
      level: ${this.level},
      health: ${this.health},
      position: ${this.position}
    `);

  }

  save(): GameMemento {
    console.log('%cSaving game state...', COLORS.blue);
    return new GameMemento(this.level, this.health, this.position);
  }

  play(level: number, health: number, position: string): void {
    this.level = level;
    this.health = health;
    this.position = position;

    console.log(`Game played at
      level: ${this.level},
      health: ${this.health},
      position: ${this.position}
    `);
  }

  restore(memento: GameMemento): void {
    this.level = memento.getLevel();
    this.health = memento.getHealth();
    this.position = memento.getPosition();

    console.log(`Game restored at
      level: ${this.level},
      health: ${this.health},
      position: ${this.position}
    `);

  }

}

class GameHistory {

  private mementos: GameMemento[] = [];

  push(memento: GameMemento): void {
    console.log('%cSaving game state to history...', COLORS.blue);
    this.mementos.push(memento);
  }

  pop(): GameMemento | null {
    console.log('%cRestoring game state...', COLORS.blue);
    return this.mementos.pop() ?? null;
  }

}


function main() {

  const game = new Game();

  const history = new GameHistory();

  history.push(game.save());

  console.log('%cPlaying the game...', COLORS.red);
  game.play(2, 90, 'forest');
  history.push(game.save());


  console.log('%cPlaying the game...', COLORS.red);
  game.play(3, 70, 'castle');
  history.push(game.save());

  console.log('%cPlaying the game...', COLORS.red);
  game.play(4, 50, 'dungeon');

  console.log('%cCurrent state:', COLORS.green);
  game.restore(history.pop()!);
  console.log('%cAfter Restoration:', COLORS.green);

  //
}

main();