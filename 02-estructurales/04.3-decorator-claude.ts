/**
 * ! Patrón decorador
 * Es un patrón de diseño estructural que permite añadir
 * funcionalidades a objetos, colocando estos objetos dentro de
 * objetos encapsuladores especiales que contienen estas funcionalidades.
 *
 * No confundirlo con los decoradores de TypeScript que son anotaciones.
 *
 * * Es útil cuando necesitas añadir funcionalidades a objetos
 *  * de manera dinámica y flexible.
 *
 * https://refactoring.guru/es/design-patterns/decorator
 */

// types.ts — interfaz común
interface RouteService {
  findAll(): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
}

interface Route {
  id: number;
  status: "active" | "inactive" | "pending";
  locationId: number;
}

// route.service.ts — implementación base
class BaseRouteService implements RouteService {

  async findAll(): Promise<Route[]> {
    console.log("DB: fetching all routes");
    return [
      { id: 1, status: "active",  locationId: 7 },
      { id: 2, status: "pending", locationId: 3 },
    ];
  }

  async findById(id: number): Promise<Route | null> {
    console.log(`DB: fetching route ${id}`);
    return { id, status: "active", locationId: 7 };
  }

}

// decorators/logger.decorator.ts
class LoggerDecorator implements RouteService {

  constructor(public service: RouteService) {}

  async findAll(): Promise<Route[]> {
    console.log("LOG: findAll started");
    const result = await this.service.findAll();
    console.log(`LOG: findAll returned ${result.length} routes`);
    return result;
  }

  async findById(id: number): Promise<Route | null> {
    console.log(`LOG: findById(${id}) started`);
    const result = await this.service.findById(id);
    console.log(`LOG: findById(${id}) returned ${result ? "found" : "not found"}`);
    return result;
  }

}

// decorators/cache.decorator.ts
class CacheDecorator implements RouteService {

  private cache = new Map<string, unknown>();

  constructor(private service: RouteService) {}

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
    console.log(`CACHE: stored findById(${id})`);
    return result;

  }

}

// decorators/metrics.decorator.ts
class MetricsDecorator implements RouteService {

  constructor(private service: RouteService) {}

  async findAll(): Promise<Route[]> {
    const start = Date.now();
    const result = await this.service.findAll();
    console.log(`METRICS: findAll took ${Date.now() - start}ms`);
    return result;
  }

  async findById(id: number): Promise<Route | null> {
    const start = Date.now();
    const result = await this.service.findById(id);
    console.log(`METRICS: findById took ${Date.now() - start}ms`);
    return result;
  }

}

// usage.ts — combinas las capas que necesitas
let base = new BaseRouteService();

// solo logs
const withLogs = new LoggerDecorator(base);

// withLogs.findAll();

// cache + logs
const withCacheAndLogs = new LoggerDecorator(new CacheDecorator(base));
 
// await withCacheAndLogs.findAll();
// await withCacheAndLogs.findAll();


// todo — metrics + cache + logs
const withEverything = new MetricsDecorator(
  new LoggerDecorator(
    new CacheDecorator(base)
  )
);




await withEverything.findAll();
// LOG:     findAll started
// CACHE:   stored findAll
// DB:      fetching all routes
// LOG:     findAll returned 2 routes
// METRICS: findAll took 2ms

await withEverything.findAll(); // segunda llamada
// LOG:     findAll started
// CACHE:   hit for findAll        ← no va a DB
// LOG:     findAll returned 2 routes
// METRICS: findAll took 0ms
