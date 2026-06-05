/**
 * ! Patrón Iterator
 * Este patrón permite recorrer los elementos de una colección sin exponer
 * la estructura interna de la colección.
 *
 * * Es útil cuando se necesita recorrer una colección de elementos sin importar
 * * cómo se almacenan los elementos.
 *
 * https://refactoring.guru/es/design-patterns/iterator
 */

// types.ts
interface Route {
  id:       number;
  status:   "active" | "inactive" | "pending";
  driverId: number | null;
}

interface Iterator<T> {
  hasNext(): boolean;
  next():    T;
  reset():   void;
}

interface Iterable<T> {
  createIterator(): Iterator<T>;
}

// iterators/route.iterator.ts — recorre todas las rutas
class RouteIterator implements Iterator<Route> {
  private index = 0;

  constructor(private routes: Route[]) {}

  hasNext(): boolean { return this.index < this.routes.length; }
  next():    Route   { return this.routes[this.index++]; }
  reset():   void    { this.index = 0; }
}

// iterators/active-route.iterator.ts — recorre solo las activas
class ActiveRouteIterator implements Iterator<Route> {
  private index  = 0;
  private active: Route[];

  constructor(routes: Route[]) {
    this.active = routes.filter(r => r.status === "active");
  }

  hasNext(): boolean { return this.index < this.active.length; }
  next():    Route   { return this.active[this.index++]; }
  reset():   void    { this.index = 0; }
}

// iterators/assigned-route.iterator.ts — recorre solo las asignadas
class AssignedRouteIterator implements Iterator<Route> {
  private index:    number = 0;
  private assigned: Route[];

  constructor(routes: Route[]) {
    this.assigned = routes.filter(r => r.driverId !== null);
  }

  hasNext(): boolean { return this.index < this.assigned.length; }
  next():    Route   { return this.assigned[this.index++]; }
  reset():   void    { this.index = 0; }
}

// route.collection.ts
class RouteCollection implements Iterable<Route> {
  private routes: Route[] = []; // estructura interna oculta ✅

  add(route: Route): void {
    this.routes.push(route);
  }

  // diferentes formas de recorrer la misma colección
  createIterator():         Iterator<Route> { return new RouteIterator(this.routes);         }
  createActiveIterator():   Iterator<Route> { return new ActiveRouteIterator(this.routes);   }
  createAssignedIterator(): Iterator<Route> { return new AssignedRouteIterator(this.routes); }
}

// usage.ts
const collection = new RouteCollection();

collection.add({ id: 1, status: "active",   driverId: 101 });
collection.add({ id: 2, status: "pending",  driverId: null });
collection.add({ id: 3, status: "active",   driverId: 102 });
collection.add({ id: 4, status: "inactive", driverId: null });
collection.add({ id: 5, status: "active",   driverId: 103 });

// recorre todas
const allIterator = collection.createIterator();
console.log("--- All Routes ---");
while (allIterator.hasNext()) {
  const route = allIterator.next();
  console.log(`Route ${route.id}: ${route.status}`);
}
// Route 1: active
// Route 2: pending
// Route 3: active
// Route 4: inactive
// Route 5: active

// recorre solo activas
const activeIterator = collection.createActiveIterator();
console.log("--- Active Routes ---");
while (activeIterator.hasNext()) {
  const route = activeIterator.next();
  console.log(`Route ${route.id}: driver ${route.driverId}`);
}
// Route 1: driver 101
// Route 3: driver 102
// Route 5: driver 103

// recorre solo asignadas
const assignedIterator = collection.createAssignedIterator();
console.log("--- Assigned Routes ---");
while (assignedIterator.hasNext()) {
  const route = assignedIterator.next();
  console.log(`Route ${route.id}: driver ${route.driverId}`);
}
// Route 1: driver 101
// Route 3: driver 102
// Route 5: driver 103