/**
 * ! Patrón State
 * Este patrón permite a un objeto cambiar su comportamiento
 * cuando su estado interno cambia.
 *
 * * Es útil cuando un objeto tiene un comportamiento que depende de su estado
 * * y debe cambiar su comportamiento en tiempo de ejecución dependiendo de ese estado.
 */

import { COLORS, sleep } from '../helpers/index.ts';

/**
 * !Objetivo:
 * Implementar el patrón State para simular el funcionamiento de una puerta
 * automática.
 *
 * La puerta tiene diferentes estados:
 *  - Cerrada
 *  - Abriéndose
 *  - Abierta
 *  - Cerrándose
 * Su comportamiento varía dependiendo del estado actual.
 */

// Interfaz State
interface State {
  name: string;

  open(): void;
  close(): void;
}

// Clase Context - AutomaticDoor
class AutomaticDoor {

  private state: State;

  constructor() {
    this.state = new Closed(this);
  }

  open(): void {
    this.state.open();
  }

  close(): void {
    this.state.close();
  }

  setState(state: State): void {
    this.state = state;
    console.log(`%cEstado cambiado a: ${state.name}`, COLORS.green);
  }

  getStateName(): string {
    return this.state.name;
  }

}

// Estado 1 - Cerrada
class Closed implements State {

  public name: string = 'closed';
  private door: AutomaticDoor;

  constructor(door: AutomaticDoor) {
    this.door = door;
  }

  open(): void {
    console.log('Abriendo la puerta...');
    this.door.setState(new Opening(this.door));
  }

  close(): void {
    console.log('La puerta ya está cerrada.');
  }

}

// Estado 2 - Abriéndose
class Opening implements State {

  public name: string = 'opening';
  private door: AutomaticDoor;

  constructor(door: AutomaticDoor) {
    this.door = door;
    this.afterOpen();
  }

  private async afterOpen() {

    await sleep(2000);

    console.log('La puerta se ha abierto.');
    this.door.setState(new Open(this.door));
  }

  open(): void {
    console.log('La puerta ya se está abriendo.');
  }

  close(): void {
    console.log('La puerta no puede cerrarse mientras se abre.');
  }

}

// Estado 3 - Abierta
class Open implements State {

  public name: string = 'open';
  private door: AutomaticDoor;

  constructor(door: AutomaticDoor) {
    this.door = door;
  }

  open(): void {
    console.log('La puerta ya está abierta.');
  }

  close(): void {
    console.log('Cerrando la puerta...');
    this.door.setState(new Closing(this.door));
  }

}

// Estado 4 - Cerrándose
class Closing implements State {

  public name: string = 'closing';
  private door: AutomaticDoor;

  constructor(door: AutomaticDoor) {
    this.door = door;
    this.afterClose();
  }

  private async afterClose() {

    await sleep(2000);

    console.log('La puerta se ha cerrado.');
    this.door.setState(new Closed(this.door));

  }

  open(): void {
    console.log('%cLa puerta no se puede abrir mientras se está cerrando.', COLORS.red);
  }

  close(): void {
    console.log('%cLa puerta ya se está cerrando.', COLORS.red);
  }

}

// Código Cliente para probar el patrón State
async function main() {
  const door = new AutomaticDoor();

  let selectedOption: string | null = '3';

  do {
    console.clear();

    console.log(`Estado actual: ${door.getStateName()}`);

    selectedOption = prompt(`
      1. Abrir puerta
      2. Cerrar puerta
      3. Salir

      Selecciona una opción:
    `);

    switch (selectedOption) {
      case '1':
        door.open();
        break;
      case '2':
        door.close();
        break;
      case '3':
        console.log(`Estado actual: ${door.getStateName()}`);
        break;

      default:
        console.log('Opción no válida.');
        break;
    }

    await sleep(3000);


  } while (selectedOption !== '3');
}

main();
