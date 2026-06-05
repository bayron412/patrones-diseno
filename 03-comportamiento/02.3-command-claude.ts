/**
 * ! Patrón Command
 * Este patrón encapsula una solicitud como un objeto,
 * lo que le permite parametrizar otros objetos con diferentes solicitudes,
 * encolar solicitudes, o registrar solicitudes, y soporta operaciones que pueden deshacerse.
 *
 * Me gustó mucho la explicación de Refactoring Guru
 * https://refactoring.guru/es/design-patterns/command
 *
 * * Es útil cuando se necesita desacoplar el objeto que invoca
 * * la operación del objeto que sabe cómo realizarla.
 *
 */

import { COLORS } from '../helpers/colors.ts';

// types.ts
interface Command {
  execute(): Promise<void>;
  undo():    Promise<void>;
}

interface Route {
  id:       number;
  status:   "active" | "inactive" | "pending";
  driverId: number | null;
}

// services/route.service.ts
class RouteService {

  private routes: Map<number, Route> = new Map([
    [1, { id: 1, status: "pending", driverId: null }],
    [2, { id: 2, status: "pending", driverId: null }],
  ]);

  async assignDriver(routeId: number, driverId: number): Promise<void> {
    const route = this.routes.get(routeId);
    if (!route) throw new Error(`Route ${routeId} not found`);
    route.driverId = driverId;
    route.status   = "active";
    console.log(`RouteService: driver ${driverId} assigned to route ${routeId}`);
  }

  async unassignDriver(routeId: number): Promise<void> {
    const route = this.routes.get(routeId);
    if (!route) throw new Error(`Route ${routeId} not found`);
    route.driverId = null;
    route.status   = "pending";
    console.log(`RouteService: driver unassigned from route ${routeId}`);
  }

  getRoute(routeId: number): Route | undefined {
    return this.routes.get(routeId);
  }

}

// commands/assign-driver.command.ts
class AssignDriverCommand implements Command {

  private previousDriverId: number | null = null;

  constructor(
    private routeService: RouteService,
    private routeId:      number,
    private driverId:     number
  ) {}

  async execute(): Promise<void> {
    const route = this.routeService.getRoute(this.routeId);
    this.previousDriverId = route?.driverId ?? null; // guarda estado anterior
    await this.routeService.assignDriver(this.routeId, this.driverId);
  }

  async undo(): Promise<void> {

    if (this.previousDriverId) {
      await this.routeService.assignDriver(this.routeId, this.previousDriverId);
    }
    else {
      await this.routeService.unassignDriver(this.routeId);
    }

    console.log(`AssignDriverCommand: undone for route ${this.routeId}`);

  }

}

// commands/unassign-driver.command.ts
class UnassignDriverCommand implements Command {

  private previousDriverId: number | null = null;

  constructor(
    private routeService: RouteService,
    private routeId:      number
  ) {}

  async execute(): Promise<void> {
    const route = this.routeService.getRoute(this.routeId);
    this.previousDriverId = route?.driverId ?? null;
    await this.routeService.unassignDriver(this.routeId);
  }

  async undo(): Promise<void> {
    if (this.previousDriverId) {
      await this.routeService.assignDriver(this.routeId, this.previousDriverId);
      console.log(`UnassignDriverCommand: undone for route ${this.routeId}`);
    }
  }

}


// command.manager.ts — maneja historial y deshacer
class CommandManager {
  private history: Command[] = [];

  async execute(command: Command): Promise<void> {
    await command.execute();
    this.history.push(command);
  }

  async undo(): Promise<void> {
    const command = this.history.pop();
    if (!command) {
      console.log("CommandManager: nothing to undo");
      return;
    }
    await command.undo();
  }

  getHistoryCount(): number {
    return this.history.length;
  }
}

// usage.ts
const routeService    = new RouteService();
const commandManager  = new CommandManager();

// ejecutas acciones
await commandManager.execute(new AssignDriverCommand(routeService, 1, 101));
// RouteService: driver 101 assigned to route 1

await commandManager.execute(new AssignDriverCommand(routeService, 2, 102));
// RouteService: driver 102 assigned to route 2

await commandManager.execute(new UnassignDriverCommand(routeService, 1));
// RouteService: driver unassigned from route 1

console.log(routeService.getRoute(1));
// { id: 1, status: "pending", driverId: null }

// deshaces la última acción
await commandManager.undo();
// RouteService:          driver 101 assigned to route 1
// UnassignDriverCommand: undone for route 1

console.log(routeService.getRoute(1));
// { id: 1, status: "active", driverId: 101 } ← restaurado ✅

// deshaces otra vez
await commandManager.undo();
// RouteService:         driver unassigned from route 2
// AssignDriverCommand:  undone for route 2

console.log(routeService.getRoute(2));
// { id: 2, status: "pending", driverId: null } ← restaurado ✅