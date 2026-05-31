/**
 * ! Patrón Composite
 * Es un patrón de diseño estructural que permite componer objetos
 * en estructuras de árbol para representar jerarquías.
 *
 * El patrón permite a los clientes tratar de manera uniforme a los objetos
 * individuales y a sus composiciones.
 *
 * * Es útil cuando necesitas tratar a los objetos individuales
 * * y a sus composiciones de manera uniforme, y la estructura
 * * de los objetos forma una jerarquía en árbol.
 *
 * https://refactoring.guru/es/design-patterns/composite
 *
 */

import { COLORS } from '../helpers/colors.ts';

// types.ts — interfaz común para elementos y grupos
interface RouteComponent {
  getName(): string;
  getCost(): number;
  print(indent?: string): void;
}

// route-stop.ts — elemento simple (hoja del árbol)
class RouteStop implements RouteComponent {

  constructor(
    public name: string,
    public cost: number
  ) { }

  getName(): string {
    return this.name;
  }

  getCost(): number {
    return this.cost;
  }

  print(indent: string = ""): void {
    console.log(`${indent}📍 ${this.name} - $${this.cost}`);
  }

}

// route-group.ts — grupo que contiene elementos o más grupos
class RouteGroup implements RouteComponent {

  private children: RouteComponent[] = [];

  constructor(public name: string) { }

  add(component: RouteComponent): this {
    this.children.push(component);
    return this;
  }

  remove(component: RouteComponent): this {
    this.children = this.children.filter(c => c !== component);
    return this;
  }

  getName(): string {
    return this.name;
  }

  getCost(): number {
    return this.children.reduce((sum, child) => sum + child.getCost(), 0);
  }

  print(indent: string = ""): void {
    console.log(`${indent}📁 ${this.name} - $${this.getCost()}`);
    this.children.forEach(child => child.print(indent + "  "));
  }

}

// usage.ts
// elementos simples
const stop1 = new RouteStop("Warehouse A", 50);
const stop2 = new RouteStop("Warehouse B", 30);
const stop3 = new RouteStop("Distribution C", 40);
const stop4 = new RouteStop("Client D", 20);
const stop5 = new RouteStop("Client E", 25);

// grupos
const morningRoute = new RouteGroup("Morning Route")
  .add(stop1)
  .add(stop2);

const afternoonRoute = new RouteGroup("Afternoon Route")
  .add(stop3)
  .add(stop4)
  .add(stop5);

// grupo de grupos
const fullDayRoute = new RouteGroup("Full Day Route")
  .add(morningRoute)
  .add(afternoonRoute);

// misma interfaz para elemento simple y grupo complejo ✅
console.log(stop1.getCost());
console.log(morningRoute.getCost());
console.log(fullDayRoute.getCost());

fullDayRoute.print();
