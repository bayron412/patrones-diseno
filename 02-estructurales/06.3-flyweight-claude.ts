/**
 * ! Patrón Flyweight
 * Es un patrón de diseño estructural que nos permite usar objetos compartidos
 * para soportar eficientemente grandes cantidades de objetos.
 *
 * * Es útil cuando necesitamos una gran cantidad de objetos y queremos reducir
 * * la cantidad de memoria que utilizan.
 */

// types.ts
// estado intrínseco — compartido, nunca cambia
interface PinStyle {
  icon:  string;
  color: string;
  size:  number;
  label: string;
}

// estado extrínseco — único por instancia
interface MapPin {
  lat:   number;
  lng:   number;
  style: PinStyle; // referencia compartida, no copia
}

type PinType = "warehouse" | "client" | "distribution";


// pin-style.factory.ts — la flyweight factory
class PinStyleFactory {

  private static cache = new Map<PinType, PinStyle>();

  static getStyle(type: PinType): PinStyle {

    if (!this.cache.has(type)) {
      this.cache.set(type, this.createStyle(type));
      console.log(`PinStyleFactory: created style for "${type}"`);
    }

    return this.cache.get(type)!; // retorna la misma referencia siempre ✅

  }

  private static createStyle(type: PinType): PinStyle {

    const styles: Record<PinType, PinStyle> = {
      warehouse:    {icon: "🏭", color: "#FF0000", size: 32, label: "Warehouse"},
      client:       {icon: "🏠", color: "#00FF00", size: 24, label: "Client"},
      distribution: {icon: "🚛", color: "#0000FF", size: 28, label: "Distribution"},
    };

    return styles[type];

  }

}

// map.service.ts
class MapService {

  private pins: MapPin[] = [];

  addPin(lat: number, lng: number, type: PinType): void {
    this.pins.push({
      lat,
      lng,
      style: PinStyleFactory.getStyle(type), // referencia compartida
    });
  }

  getPinCount(): number {
    return this.pins.length;
  }

  getUniqueSyles(): number {
    return new Set(this.pins.map(p => p.style)).size;
  }

}

// usage.ts
const map = new MapService();

// agregamos 10,000 pines
for (let i = 0; i < 10000; i++) {
  map.addPin(6.2 + i * 0.001, -75.5, "warehouse");
}

for (let i = 0; i < 5000; i++) {
  map.addPin(6.2 + i * 0.001, -75.5, "client");
}

for (let i = 0; i < 3000; i++) {
  map.addPin(6.2 + i * 0.001, -75.5, "distribution");
}

// PinStyleFactory: created style for "warehouse"    ← solo una vez
// PinStyleFactory: created style for "client"       ← solo una vez
// PinStyleFactory: created style for "distribution" ← solo una vez

console.log(map.getPinCount());    // 18,000 pines
console.log(map.getUniqueSyles()); // 3 estilos únicos en memoria ✅

// verificar que comparten la misma referencia
const style1 = PinStyleFactory.getStyle("warehouse");
const style2 = PinStyleFactory.getStyle("warehouse");

console.log(style1);

console.log(style1 === style2); // true ← mismo objeto en memoria ✅
