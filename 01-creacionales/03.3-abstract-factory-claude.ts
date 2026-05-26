/**
 * ! Abstract Factory:
 * Es un patrón de diseño que permite crear familias de objetos relacionados
 * sin especificar sus clases concretas.
 *
 * En lugar de crear objetos individuales directamente,
 * creamos fábricas que producen un conjunto de objetos relacionados.
 *
 * * Es útil cuando necesitas crear objetos que son parte de una familia
 * * y quieres asegurarte de que estos objetos se complementen entre sí.
 *
 * https://refactoring.guru/es/design-patterns/abstract-factory
 */

// types.ts
interface Database {
  query(sql: string): Promise<unknown[]>;
}

interface Logger {
  log(message: string): void;
  error(message: string): void;
}

interface Cache {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

// La Abstract Factory — define Que familia de objetos se crea
interface InfrastructureFactory {
  createDatabase(): Database;
  createLogger(): Logger;
  createCache(): Cache;
}

// implementations/production.ts
class PostgresDB implements Database {
  async query(sql: string): Promise<unknown[]> {
    console.log(`🐘 Postgres ejecutando: ${sql}`);
    return [];
  }
}

class CloudLogger implements Logger {
  log(message: string): void {
    console.log(`☁️ [CloudWatch] ${message}`);
  }
  error(message: string): void {
    console.error(`☁️ [CloudWatch ERROR] ${message}`);
  }
}

class RedisCache implements Cache {
  async get(key: string): Promise<string | null> {
    console.log(`🔴 Redis GET ${key}`);
    return null;
  }

  async set(key: string, value: string): Promise<void> {
    console.log(`🔴 Redis SET ${key}`);
  }
}

// implementations/testing.ts
class InMemoryDB implements Database {
  async query(sql: string): Promise<unknown[]> {
    console.log(`🧪 InMemory ejecutando: ${sql}`);
    return [{ id: 1, name: "test" }];
  }
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

class InMemoryCache implements Cache {
  private store = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }
  async set(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }
}

// factories/production.factory.ts
class ProductionFactory implements InfrastructureFactory {
  constructor() {
    console.log("🚀 Configurando infraestructura para PRODUCCIÓN...");
  }

  createDatabase(): Database {
    return new PostgresDB();
  }
  createLogger(): Logger {
    return new CloudLogger();
  }
  createCache(): Cache {
    return new RedisCache();
  }
}

// factories/testing.factory.ts
class TestingFactory implements InfrastructureFactory {
  constructor() {
    console.log("🧪 Configurando infraestructura para TESTING...");
  }

  createDatabase(): Database {
    return new InMemoryDB();
  }
  createLogger(): Logger {
    return new ConsoleLogger();
  }
  createCache(): Cache {
    return new InMemoryCache();
  }
}

// factories/staging.factory.ts — nueva familia, cero cambios en el resto
class StagingFactory implements InfrastructureFactory {
  constructor() {
    console.log("🏗️ Configurando infraestructura para STAGING...");
  }

  createDatabase(): Database {
    return new PostgresDB();
  } // misma DB
  createLogger(): Logger {
    return new ConsoleLogger();
  } // logger simple
  createCache(): Cache {
    return new InMemoryCache();
  } // cache ligero
}

class App {
  private db: Database;
  private logger: Logger;
  private cache: Cache;

  constructor(factory: InfrastructureFactory) {
    this.db = factory.createDatabase();
    this.logger = factory.createLogger();
    this.cache = factory.createCache();
  }

  async run(): Promise<void> {
    this.logger.log("App iniciando...");

    const cached = await this.cache.get("users");

    if (!cached) {
      const users = await this.db.query("SELECT * FROM users");
      await this.cache.set("users", JSON.stringify(users));
    }

    this.logger.log("App lista ✅");
  }
}

// bootstrap.ts — un solo lugar decide qué familia usar
const env = "testing"; //process.env.NODE_ENV;

let factory: InfrastructureFactory;

switch (env) {
  case "production":
    factory = new ProductionFactory();
    break;
  case "staging":
    factory = new StagingFactory();
    break;
  case "testing":
    factory = new TestingFactory();
    break;
  default:
    throw new Error(`Unknown environment: ${env}`);
}

const app = new App(factory);
app.run();
