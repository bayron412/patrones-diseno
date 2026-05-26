/**
 * ! Inmutabilidad con copia
 */

// types.ts
interface Route {
  readonly id: number;
  readonly status: "active" | "inactive" | "pending";
  readonly locationId: number;
  readonly filtros: Readonly<Record<string, unknown>>;
}

// route.operations.ts
function activateRoute(route: Route): Route {
  return { ...route, status: "active" };
}

function deactivateRoute(route: Route): Route {
  return { ...route, status: "inactive" };
}

function addFilter(route: Route, key: string, value: unknown): Route {
  return {
    ...route,
    filtros: { ...route.filtros, [key]: value }, // copia el anidado también
  };
}

// uso.ts
const route: Route = {
  id: 1,
  status: "pending",
  locationId: 7,
  filtros: { activo: true },
};

const activeRoute = activateRoute(route);
const routeWithFilter = addFilter(activeRoute, "city", "Medellin");
const inactiveRoute = deactivateRoute(routeWithFilter);

console.log(route); // { id:1, status:"pending",   filtros:{ activo:true } }           ← intacta
console.log(activeRoute); // { id:1, status:"active",    filtros:{ activo:true } }
console.log(routeWithFilter); // { id:1, status:"active",    filtros:{ activo:true, ciudad:"Medellín" } }
console.log(inactiveRoute); // { id:1, status:"inactive",  filtros:{ activo:true, ciudad:"Medellín" } }
