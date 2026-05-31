/**
 * ! Patrón Flyweight
 * Es un patrón de diseño estructural que nos permite usar objetos compartidos
 * para soportar eficientemente grandes cantidades de objetos.
 *
 * * Es útil cuando necesitamos una gran cantidad de objetos y queremos reducir
 * * la cantidad de memoria que utilizan.
 *
 * https://refactoring.guru/es/design-patterns/flyweight
 */

import { COLORS } from "../helpers/colors.ts";

interface ILocation {
  display(coordinates: { x: number, y: number }): void;
}

//  Flyweight
class LocationIcon implements ILocation {

  private type: string;
  private iconImage: string;

  constructor(type: string, iconImage: string) {
    this.type = type;
    this.iconImage = iconImage;
  }

  display(coordinates: { x: number, y: number }): void {
    console.log(`Displaying ${this.type} icon at (${coordinates.x}, ${coordinates.y}) with image ${this.iconImage}`);
  }

}

// Flyweight Factory
class LocationFactory {

  private icons: Record<string, LocationIcon> = {};

  // school, hospital, restaurant, park
  getLocationIcon(type: string): LocationIcon {

    if (!this.icons[type]) {
      console.log(`%cCreating a New Instance Image`, COLORS.red);
      const iconImage = `image_de_${type.toLocaleLowerCase()}.png`;
      this.icons[type] = new LocationIcon(type, iconImage);
    }

    return this.icons[type];

  }

}

class MapLocation {

  private coordinates: { x: number, y: number };
  private icon: LocationIcon;

  constructor(x: number, y: number, icon: LocationIcon) {
    this.coordinates = { x, y };
    this.icon = icon;
  }

  display(): void {
    this.icon.display(this.coordinates);
  }

}

function main() {

  const factory = new LocationFactory();

  const locations = [
    new MapLocation(10, 20, factory.getLocationIcon('hospital')),
    new MapLocation(20, 40, factory.getLocationIcon('hospital')),
    new MapLocation(30, 60, factory.getLocationIcon('hospital')),
    new MapLocation(35, 75, factory.getLocationIcon('park')),
    new MapLocation(45, 75, factory.getLocationIcon('park')),
    new MapLocation(45, 75, factory.getLocationIcon('hospital')),

    new MapLocation(60, 75, factory.getLocationIcon('school')),
    new MapLocation(80, 90, factory.getLocationIcon('school')),
    new MapLocation(50, 90, factory.getLocationIcon('school')),
  ];

  locations.forEach(location => location.display());

}

main();