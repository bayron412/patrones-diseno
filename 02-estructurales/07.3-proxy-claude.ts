/**
 * ! Patrón Proxy
 * Este patrón se utiliza para controlar el acceso a un objeto, es decir,
 * se crea un objeto que actúa como intermediario entre el cliente y el objeto real.
 *
 * * Es útil cuando necesitamos controlar el acceso a un objeto,
 * * por ejemplo, para verificar si el cliente tiene permiso
 * * para acceder a ciertos métodos o propiedades.
 *
 * https://refactoring.guru/es/design-patterns/proxy
 *
 */

import { COLORS } from '../helpers/colors.ts';

// types.ts
interface RouteService {
  findAll(): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
  delete(routeId: number): Promise<void>;
}

interface Route {
  id: number;
  status: "active" | "inactive" | "pending";
  locationId: number;
}

interface User {
  id: number;
  role: "admin" | "driver" | "operator";
}

// route.service.ts — el objeto real
class BaseRouteService implements RouteService {

  async findAll(): Promise<Route[]> {
    console.log("DB: fetching all routes");
    return [
      { id: 1, status: "active", locationId: 7 },
      { id: 2, status: "pending", locationId: 3 },
    ];
  }

  async findById(id: number): Promise<Route | null> {
    console.log(`DB: fetching route ${id}`);
    return { id, status: "active", locationId: 7 };
  }

  async delete(routeId: number): Promise<void> {
    console.log(`DB: deleting route ${routeId}`);
  }

}

// proxies/auth.proxy.ts — controla acceso por permisos
class AuthRouteProxy implements RouteService {

  constructor(
    private service: RouteService,
    private currentUser: User
  ) { }

  async findAll(): Promise<Route[]> {
    // drivers solo ven sus propias rutas — simplificado
    if (this.currentUser.role === "driver") {
      console.log(`AUTH: driver ${this.currentUser.id} can only see assigned routes`);
    }
    return this.service.findAll();
  }

  async findById(id: number): Promise<Route | null> {
    return this.service.findById(id);
  }

  async delete(routeId: number): Promise<void> {
    if (this.currentUser.role !== "admin") {
      console.log(`AUTH: user ${this.currentUser.id} is not allowed to delete routes`);
    }
    return this.service.delete(routeId);
  }

}

// proxies/cache.proxy.ts — controla acceso cacheando resultados
class CacheRouteProxy implements RouteService {
  private cache = new Map<string, unknown>();

  constructor(private service: RouteService) { }

  async findAll(): Promise<Route[]> {
    const key = "findAll";
    if (this.cache.has(key)) {
      console.log("CACHE: hit for findAll");
      return this.cache.get(key) as Route[];
    }
    const result = await this.service.findAll();
    this.cache.set(key, result);
    console.log("CACHE: stored findAll");
    return result;
  }

  async findById(id: number): Promise<Route | null> {
    const key = `findById:${id}`;
    if (this.cache.has(key)) {
      console.log(`CACHE: hit for findById(${id})`);
      return this.cache.get(key) as Route;
    }
    const result = await this.service.findById(id);
    this.cache.set(key, result);
    return result;
  }

  async delete(routeId: number): Promise<void> {
    this.cache.clear(); // invalida el cache al borrar
    console.log("CACHE: cleared after delete");
    return this.service.delete(routeId);
  }
}

// usage.ts
const base = new BaseRouteService();

const adminUser: User = { id: 1, role: "admin" };
const driverUser: User = { id: 2, role: "driver" };

// admin — cache + auth
const adminService = new AuthRouteProxy(
  new CacheRouteProxy(base),
  adminUser
);

// driver — cache + auth
const driverService = new AuthRouteProxy(
  new CacheRouteProxy(base),
  driverUser
);

// DB:    fetching all routes
// CACHE: stored findAll
await adminService.findAll();

// segunda llamada
// CACHE: hit for findAll ← no va a DB ✅
await adminService.findAll();

// ❌ Error: AUTH: user 2 is not allowed findAll
await driverService.findAll();

await adminService.delete(1);
// DB:    deleting route 1
// CACHE: cleared after delete ✅

await driverService.delete(1);
// ❌ Error: AUTH: user 2 is not allowed to delete routes ✅
