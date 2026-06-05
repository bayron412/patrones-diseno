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

// types.ts
interface RouteState {
  status:   "active" | "inactive" | "pending";
  driverId: number | null;
  locationId: number;
  updatedAt:  Date;
}

// memento.ts — guarda el estado, no lo expone
class RouteMemento {
  private state: RouteState;

  constructor(state: RouteState) {
    this.state = structuredClone(state); // copia profunda del estado
  }

  getState(): RouteState {
    return structuredClone(this.state); // nunca expone la referencia directa
  }

  getTimestamp(): Date {
    return this.state.updatedAt;
  }
}

// route.ts — el objeto cuyo estado se guarda
class Route {
  private state: RouteState;

  constructor(id: number, locationId: number) {
    this.state = {
      status:     "pending",
      driverId:   null,
      locationId,
      updatedAt:  new Date(),
    };
  }

  // crea un snapshot del estado actual
  save(): RouteMemento {
    console.log(`Route: saving snapshot at ${this.state.updatedAt.toISOString()}`);
    return new RouteMemento(this.state);
  }

  // restaura un snapshot anterior
  restore(memento: RouteMemento): void {
    this.state = memento.getState();
    console.log(`Route: restored to snapshot at ${this.state.updatedAt.toISOString()}`);
  }

  assignDriver(driverId: number): void {
    this.state.driverId = driverId;
    this.state.status   = "active";
    this.state.updatedAt = new Date();
    console.log(`Route: driver ${driverId} assigned`);
  }

  unassignDriver(): void {
    this.state.driverId = null;
    this.state.status   = "pending";
    this.state.updatedAt = new Date();
    console.log(`Route: driver unassigned`);
  }

  getState(): RouteState {
    return structuredClone(this.state);
  }
}

// history.ts — administra los snapshots
class RouteHistory {
  private snapshots: RouteMemento[] = [];

  push(memento: RouteMemento): void {
    this.snapshots.push(memento);
    console.log(`History: snapshot saved (${this.snapshots.length} total)`);
  }

  pop(): RouteMemento | null {
    if (this.snapshots.length === 0) {
      console.log("History: nothing to undo");
      return null;
    }
    const memento = this.snapshots.pop()!;
    console.log(`History: restoring snapshot from ${memento.getTimestamp().toISOString()}`);
    return memento;
  }

  getCount(): number {
    return this.snapshots.length;
  }
}

// usage.ts
const route   = new Route(1, 7);
const history = new RouteHistory();

// estado inicial
console.log(route.getState());
// { status: "pending", driverId: null, locationId: 7 }

// guardas snapshot antes de cambiar
history.push(route.save());
route.assignDriver(101);
// Route: driver 101 assigned
console.log(route.getState());
// { status: "active", driverId: 101, locationId: 7 }

// guardas otro snapshot
history.push(route.save());
route.assignDriver(202); // reasignas a otro driver
// Route: driver 202 assigned
console.log(route.getState());
// { status: "active", driverId: 202, locationId: 7 }

// deshaces — vuelve a driver 101
const snapshot1 = history.pop();
if (snapshot1) route.restore(snapshot1);
console.log(route.getState());
// { status: "active", driverId: 101, locationId: 7 } ← restaurado ✅

// deshaces otra vez — vuelve al estado inicial
const snapshot2 = history.pop();
if (snapshot2) route.restore(snapshot2);
console.log(route.getState());
// { status: "pending", driverId: null, locationId: 7 } ← restaurado ✅

history.pop();
// History: nothing to undo
