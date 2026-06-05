/**
 * ! Patrón mediator
 * Es un patrón de diseño de comportamiento que ayuda a reducir
 * las dependencias desordenadas entre objetos.
 * Este patrón limita la comunicación directa entre ellos,
 * haciendo que solo interactúen a través de un objeto mediador.
 *
 * * Es útil reducir la complejidad de las relaciones entre objetos
 *
 * https://refactoring.guru/es/design-patterns/mediator
 */

/**
 * 1.	Clase ControlTower:
	•	Actúa como el Mediador entre los aviones.
    La torre de control coordina las comunicaciones entre los aviones
    para evitar colisiones y recibir sus solicitudes de despegue
    o aterrizaje.

	2.	Clase Airplane:
	•	Representa a un avión que puede enviar y recibir mensajes
    a través de la torre de control.
    Los aviones no se comunican directamente entre sí,
    sino a través de la torre de control, que gestiona la información.

	3.	Interacciones:
	•	Los aviones pueden solicitar permiso para aterrizar o despegar,
    y la torre de control enviará mensajes a los demás aviones
    notificándoles de la actividad de cada avión.
 */


// types.ts
interface EventPayload {
  driverId?:  number;
  routeId?:   number;
  locationId?: number;
  message?:   string;
}

type EventType =
  | "DRIVER_AVAILABLE"
  | "DRIVER_ON_ROUTE"
  | "ROUTE_COMPLETED"
  | "ROUTE_ASSIGNED";

interface Colleague {
  setMediator(mediator: Mediator): void;
  getName(): string;
}

interface Mediator {
  notify(sender: Colleague, event: EventType, payload: EventPayload): void;
}

// colleagues/driver.service.ts
class DriverService implements Colleague {
  private mediator!: Mediator;

  setMediator(mediator: Mediator): void { this.mediator = mediator; }
  getName(): string { return "DriverService"; }

  goOnline(driverId: number): void {
    console.log(`DriverService: driver ${driverId} is now available`);
    this.mediator.notify(this, "DRIVER_AVAILABLE", { driverId });
  }

  startRoute(driverId: number, routeId: number): void {
    console.log(`DriverService: driver ${driverId} started route ${routeId}`);
    this.mediator.notify(this, "DRIVER_ON_ROUTE", { driverId, routeId });
  }
}

// colleagues/route.service.ts
class RouteService implements Colleague {
  private mediator!: Mediator;

  setMediator(mediator: Mediator): void { this.mediator = mediator; }
  getName(): string { return "RouteService"; }

  complete(routeId: number, driverId: number): void {
    console.log(`RouteService: route ${routeId} completed by driver ${driverId}`);
    this.mediator.notify(this, "ROUTE_COMPLETED", { routeId, driverId });
  }

  assign(routeId: number, driverId: number): void {
    console.log(`RouteService: route ${routeId} assigned to driver ${driverId}`);
    this.mediator.notify(this, "ROUTE_ASSIGNED", { routeId, driverId });
  }
}

// colleagues/notification.service.ts
class NotificationService implements Colleague {
  private mediator!: Mediator;

  setMediator(mediator: Mediator): void { this.mediator = mediator; }
  getName(): string { return "NotificationService"; }

  send(driverId: number, message: string): void {
    console.log(`NotificationService: 📱 driver ${driverId} — "${message}"`);
  }
}

// colleagues/audit.service.ts
class AuditService implements Colleague {
  private mediator!: Mediator;

  setMediator(mediator: Mediator): void { this.mediator = mediator; }
  getName(): string { return "AuditService"; }

  log(event: EventType, payload: EventPayload): void {
    console.log(`AuditService: [${event}]`, payload);
  }
}

// logistics.mediator.ts — el coordinador central
class LogisticsMediator implements Mediator {
  constructor(
    private driverService:       DriverService,
    private routeService:        RouteService,
    private notificationService: NotificationService,
    private auditService:        AuditService
  ) {
    // registra el mediador en cada colega
    driverService.setMediator(this);
    routeService.setMediator(this);
    notificationService.setMediator(this);
    auditService.setMediator(this);
  }

  notify(sender: Colleague, event: EventType, payload: EventPayload): void {
    switch (event) {
      case "DRIVER_AVAILABLE":
        // cuando un driver está disponible, busca rutas pendientes y asigna
        this.routeService.assign(1, payload.driverId!);
        this.auditService.log(event, payload);
        break;

      case "ROUTE_ASSIGNED":
        // cuando se asigna una ruta, notifica al driver
        this.notificationService.send(payload.driverId!, `Route ${payload.routeId} assigned to you`);
        this.auditService.log(event, payload);
        break;

      case "DRIVER_ON_ROUTE":
        // cuando el driver arranca, notifica y audita
        this.notificationService.send(payload.driverId!, `Route ${payload.routeId} started`);
        this.auditService.log(event, payload);
        break;

      case "ROUTE_COMPLETED":
        // cuando completa, libera al driver y audita
        this.notificationService.send(payload.driverId!, `Route ${payload.routeId} completed ✅`);
        this.auditService.log(event, payload);
        break;
    }
  }
}


// usage.ts
const driverService       = new DriverService();
const routeService        = new RouteService();
const notificationService = new NotificationService();
const auditService        = new AuditService();

new LogisticsMediator(
  driverService,
  routeService,
  notificationService,
  auditService
);

// driver se conecta
driverService.goOnline(101);
// DriverService:       driver 101 is now available
// RouteService:        route 1 assigned to driver 101
// NotificationService: 📱 driver 101 — "Route 1 assigned to you"
// AuditService:        [DRIVER_AVAILABLE] { driverId: 101 }
// AuditService:        [ROUTE_ASSIGNED]   { routeId: 1, driverId: 101 }

// driver arranca la ruta
driverService.startRoute(101, 1);
// DriverService:       driver 101 started route 1
// NotificationService: 📱 driver 101 — "Route 1 started"
// AuditService:        [DRIVER_ON_ROUTE] { driverId: 101, routeId: 1 }

// ruta completada
routeService.complete(1, 101);
// RouteService:        route 1 completed by driver 101
// NotificationService: 📱 driver 101 — "Route 1 completed ✅"
// AuditService:        [ROUTE_COMPLETED] { routeId: 1, driverId: 101 }