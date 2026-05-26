/**
 * ! Factory Method:
 * El patrón Factory Method permite crear objetos sin especificar
 * la clase exacta del objeto que se creará.
 *
 * En lugar de eso, delegamos la creación de objetos a subclases o métodos
 * que encapsulan esta lógica.
 *
 * * Es útil cuando una clase no puede anticipar la clase
 * * de objetos que debe crear.
 *
 * https://refactoring.guru/es/design-patterns/factory-method
 */

import { COLORS } from "../helpers/colors.ts";

interface Hamburger {
  prepare(): void;
}

class ChickenHamburger implements Hamburger {
  prepare(): void {
    console.log(`Preparando hamburguesa de pollo`, COLORS.brown);
  }
}

class BeefHamburger implements Hamburger {
  prepare(): void {
    console.log(`Preparando hamburguesa de res`, COLORS.brown);
  }
}

class VeggieHamburger implements Hamburger {
  prepare(): void {
    console.log(`Preparando hamburguesa vegetariana`, COLORS.green);
  }
}

abstract class Restaurant {
  protected abstract createHamburger(): Hamburger;

  orderHamburger(): void {
    const hamburger = this.createHamburger();
    hamburger.prepare();
  }
}

class ChickenRestaurant extends Restaurant {
  override createHamburger(): Hamburger {
    return new ChickenHamburger();
  }
}

class BeefRestaurant extends Restaurant {
  override createHamburger(): Hamburger {
    return new BeefHamburger();
  }
}

class VeggieRestaurant extends Restaurant {
  override createHamburger(): Hamburger {
    return new VeggieHamburger();
  }
}

function main() {
  let restaurant: Restaurant;

  const burgerType = prompt(
    "Que Tipo de hamburguesa deseas? (chicken/beef/veggie)",
  ); // Esto podría venir de una entrada del usuario o de una configuración

  switch (burgerType) {
    case "chicken":
      restaurant = new ChickenRestaurant();
      break;

    case "beef":
      restaurant = new BeefRestaurant();
      break;

    case "veggie":
      restaurant = new VeggieRestaurant();
      break;

    default:
      throw new Error("Tipo de hamburguesa no válido");
  }

  restaurant.orderHamburger();
}

main();
