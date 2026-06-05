/**
 * !Patrón Visitor
 *
 * El patrón Visitor es un patrón de diseño de comportamiento
 * que te permite separar algoritmos de los objetos sobre
 * los que operan.
 *
 * * Es útil cuando necesitas añadir nuevas operaciones a
 * * clases estables sin cambiar su código.
 *
 * https://refactoring.guru/es/design-patterns/visitor
 */

/**
 * Contexto: Imagina que estás diseñando un sistema para un parque
 * temático con diferentes tipos de atracciones:
 * montañas rusas, casas del terror y ruedas de la fortuna.
 *
 * Cada atracción tiene su propio precio de entrada y ofrece un descuento
 * dependiendo del tipo de visitante (niño, adulto o adulto mayor).
 *
 * Aquí es donde entra el patrón Visitor, que permite aplicar operaciones
 * específicas (como calcular el precio con descuento) dependiendo tanto
 * de la atracción como del tipo de visitante,
 * sin modificar las clases originales.
 */

import {COLORS} from '../helpers/index.ts'

interface Visitor {
  visitRollerCoaster(rollerCoaster: RollerCoaster): void;
  visitHauntedHouse(hauntedHouse: HauntedHouse): void;
  visitFerrisWheel(ferrisWheel: FerrisWheel): void;
}

interface Attraction {
  accept(visitor: Visitor): void;
  getName(): string;
  getPrice(): number;
}

class RollerCoaster implements Attraction {

  private name: string = 'Montaña Rusa';
  private price: number = 50;

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  accept(visitor: Visitor): void {
    visitor.visitRollerCoaster(this);
  }

}

class HauntedHouse implements Attraction {

  private name: string = 'Casa del Terror';
  private price: number = 40;

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  accept(visitor: Visitor): void {
    visitor.visitHauntedHouse(this);
  }

}

class FerrisWheel implements Attraction {

  private name: string = 'Rueda de la Fortuna';
  private price: number = 30;

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  accept(visitor: Visitor): void {
    visitor.visitFerrisWheel(this);
  }

}

// Visitors
class ChildVisitor implements Visitor {

  visitRollerCoaster(rollerCoaster: RollerCoaster): void {
    console.log(`
      Visitando: Montaña Rusa (Niño):
      Tiene un precio con descuento $${rollerCoaster.getPrice() * 0.5}
    `);
  }

  visitHauntedHouse(hauntedHouse: HauntedHouse): void {
    console.log(`
      Visitando: Casa del Terror (Niño):
      Tiene un precio con descuento $${hauntedHouse.getPrice() * 0.7}
    `);
  }

  visitFerrisWheel(ferrisWheel: FerrisWheel): void {
    console.log(`
      Visitando: Rueda de la Fortuna (Niño):
      Tiene un precio con descuento $${ferrisWheel.getPrice() * 0.6}
    `);
  }

}

class AdultVisitor implements Visitor {

  visitRollerCoaster(rollerCoaster: RollerCoaster): void {
    console.log(`
      Visitando: Montaña Rusa (Adulto):
      Tiene un precio normal $${rollerCoaster.getPrice()}
    `);
  }

  visitHauntedHouse(hauntedHouse: HauntedHouse): void {
    console.log(`
      Visitando: Casa del Terror (Adulto):
      Tiene un precio normal $${hauntedHouse.getPrice()}
    `);
  }

  visitFerrisWheel(ferrisWheel: FerrisWheel): void {
    console.log(`
      Visitando: Rueda de la Fortuna (Adulto):
      Tiene un precio normal $${ferrisWheel.getPrice()}
    `);
  }

}

class ElderVisitor implements Visitor {

  visitRollerCoaster(rollerCoaster: RollerCoaster): void {
    console.log(`
      Visitando: Montaña Rusa (Adulto Mayor):
      Tiene un precio con descuento $${rollerCoaster.getPrice() * 0.8}
    `);
  }

  visitHauntedHouse(hauntedHouse: HauntedHouse): void {
    console.log(`
      Visitando: Casa del Terror (Adulto Mayor):
      Tiene un precio con descuento $${hauntedHouse.getPrice() * 0.9}
    `);
  }

  visitFerrisWheel(ferrisWheel: FerrisWheel): void {
    console.log(`
      Visitando: Rueda de la Fortuna (Adulto Mayor):
      Tiene un precio con descuento $${ferrisWheel.getPrice() * 0.6}
    `);
  }

}

function main() {

  const attractions: Attraction[] = [
    new RollerCoaster(),
    new HauntedHouse(),
    new FerrisWheel(),
  ];

  attractions.forEach(a => console.log(`%cAtraccion: ${a.getName()} - $${a.getPrice()}`, COLORS.yellow));

  console.log('\n')
  console.log(`%c Visitante Niño:`, COLORS.green)

  const childVisitor = new ChildVisitor();
  attractions.forEach(a => a.accept(childVisitor));

  console.log('\n')
  console.log(`%c Visitante Adulto:`, COLORS.cyan)

  const adultVisitor = new AdultVisitor();
  attractions.forEach(a => a.accept(adultVisitor));

  console.log('\n')
  console.log(`%c Visitante Adulto Mayor:`, COLORS.blue)

  const elderVisitor = new ElderVisitor();
  attractions.forEach(a => a.accept(elderVisitor));

}

main();