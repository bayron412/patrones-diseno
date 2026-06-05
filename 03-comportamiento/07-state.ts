/**
 * ! Patrón State
 * Este patrón permite a un objeto cambiar su comportamiento
 * cuando su estado interno cambia.
 *
 * * Es útil cuando un objeto tiene un comportamiento que depende de su estado
 * * y debe cambiar su comportamiento en tiempo de ejecución dependiendo de ese estado.
 *
 * https://refactoring.guru/es/design-patterns/state
 */

import { COLORS } from "../helpers/colors.ts";
import { sleep } from "../helpers/sleep.ts";

/**
 * * Objetivo: Implementar el patrón State para simular el funcionamiento
 * * de una máquina expendedora.
 * * La máquina tiene diferentes estados,
 *  * Como Esperando Dinero,
 *  * Seleccionando Producto,
 *  * Entregando Producto,
 * * y su comportamiento varía dependiendo del estado actual.
 */

interface State {

  name: string;

  insertMoney(amount: number): void;
  selectProduct(product: string): void;
  dispenseProduct(): void;

}

class VendingMachine {

  private state: State;

  constructor() {
    this.state = new WaitingForMoney(this);
    console.log(`%cEstado actual: ${this.state.name}`, COLORS.yellow);
  }

  instertMoney(amount: number): void {
    this.state.insertMoney(amount);
  }

  selectProduct(product: string): void {
    this.state.selectProduct(product);
  }

  dispenseProduct(): void {
    this.state.dispenseProduct();
  }

  setState(newState: State): void {
    this.state = newState;
    console.log(`%cEstado actual: ${newState.name}`, COLORS.yellow);
  }

  getStateName(): String {
    return this.state.name;
  }

}

class WaitingForMoney implements State {

  public name = 'WaitingForMoney';
  private vendingMachine: VendingMachine;

  constructor(vendingMachine: VendingMachine) {
    this.vendingMachine = vendingMachine;
  }

  insertMoney(amount: number): void {

    console.log(`Dinero insertado: ${amount}: %cahora puedes seleccionar un producto.`, COLORS.green);
    this.vendingMachine.setState(new ProductSelected(this.vendingMachine));

  }

  selectProduct(): void {
    console.log(`%cNo puedes seleccionar un producto sin insertar dinero.`, COLORS.red);
  }

  dispenseProduct(): void {
    console.log(`%cNo puedes dispensar un producto sin insertar dinero.`, COLORS.red);
  }

}

class ProductSelected implements State {

  public name = 'ProductSelected';
  private vendingMachine: VendingMachine;

  constructor(vendingMachine: VendingMachine) {
    this.vendingMachine = vendingMachine;
  }

  insertMoney(amount: number): void {
    console.log(`%cYa inserto el dinero: $${amount}, no puedes insertar mas dinero.`, COLORS.red);
  }

  selectProduct(product: string): void {
    console.log(`%cProducto seleccionado: ${product}.`, COLORS.green);
    this.vendingMachine.setState(new DispensingProduct(this.vendingMachine));
  }

  dispenseProduct(): void {
    console.log(`%cNo puedes dispensar un producto sin seleccionar uno.`, COLORS.red);
  }

}

class DispensingProduct implements State {

  public name = 'DispensingProduct';
  private vendingMachine: VendingMachine;

  constructor(vendingMachine: VendingMachine) {
    this.vendingMachine = vendingMachine;
  }

  insertMoney(amount: number): void {
    console.log(`%cYa inserto el dinero: $${amount}, no puedes insertar mas dinero.`, COLORS.red);
  }

  selectProduct(product: string): void {
    console.log(`%cNo puedes seleccionar un producto si se esta dispensando uno.`, COLORS.red);
  }

  dispenseProduct(): void {
    console.log(`%cDispensando producto.`, COLORS.green);
    this.vendingMachine.setState(new WaitingForMoney(this.vendingMachine));
  }

}

async function main() {

  const vendingMachine = new VendingMachine();

  let selectedOption: string | null = '4';

  do {

    console.clear();

    console.log(`%c ¿Que deseas hacer?`, COLORS.cyan);
    console.log(`%c1. Insertar Dinero`, COLORS.yellow);
    console.log(`%c2. Seleccionar Producto`, COLORS.yellow);
    console.log(`%c3. Dispensar Producto`, COLORS.yellow);
    console.log(`%c4. Salir`, COLORS.yellow);


    console.log(`\nEstado actual: ${vendingMachine.getStateName()}\n`);

    selectedOption = prompt(`Selecciona una opcion: `);

    console.log(selectedOption);

    switch(selectedOption) {
      case '1':
        const amount = prompt(`Dinero insertado: `);
        vendingMachine.instertMoney(Number(amount));
        break;
      case '2':
        vendingMachine.selectProduct('Coca Cola');
        break;
      case '3':
        vendingMachine.dispenseProduct();
        break;
      case '4':
        console.log('Saliendo...');
        break;
      default:
        console.log(`%cOpcion no valida.`, COLORS.red);
        break;
    }

    await sleep(3000);

  } while (selectedOption !== '4');

}

main();

