/**
 * ! Patron Chain of Responsibility
 * Es un patrón de diseño de comportamiento que te permite pasar solicitudes
 * a lo largo de una cadena de manejadores.
 *
 * * Es útil cuando se necesita procesar datos de diferentes maneras, pero no
 * * se sabe de antemano qué tipo de procesamiento se necesita o en qué orden
 * * pero se sabe que se necesita procesar en una secuencia.
 *
 * https://refactoring.guru/es/design-patterns/chain-of-responsibility
 */

import { COLORS } from '../helpers/colors.ts';

interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: string): void;
}

abstract class BaseHandler implements Handler {

  private nextHandler?: Handler;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handle(request: string): void {
    if(this.nextHandler){
      this.nextHandler.handle(request);
    }
  }

}

// Soporte Basico
class BasicSupport extends BaseHandler {

  override handle(request: string) {

    if (request === 'basic') {
      console.log('%cBasic Support: Resolved Basic Request', COLORS.green);
      return;
    }
    else {
      console.log('%cBasic Support: Need Escalated Support to Advanced Support', COLORS.red);
      super.handle(request);
    }

  }

}

class AdvanceSupport extends BaseHandler {

  override handle(request: string) {

    if (request === 'advanced') {
      console.log('%cAdvance Support: Resolved Advanced Request', COLORS.green);
      return;
    }
    else {
      console.log('%cAdvance Support: Need Escalated Support to Expert Support', COLORS.red);
      super.handle(request);
    }

  }

}

class ExpertSupport extends BaseHandler {

  override handle(request: string) {

    if (request === 'expert') {
      console.log('%cExpert Support: Resolved Expert Request', COLORS.green);
      return;
    }
    else {
      console.log('%cExpert Support: Cannot Resolve Request', COLORS.red);
    }

  }

}

function main () {

  const basicSupport = new BasicSupport();
  const advanceSupport = new AdvanceSupport();
  const expertSupport = new ExpertSupport();

  basicSupport.setNext(advanceSupport).setNext(expertSupport);

  console.log('%c=== Chain of Responsibility Demo ===', COLORS.cyan);

  console.log('\n');
  console.log('%c   call support level 1   ', COLORS.yellow);
  basicSupport.handle('basic');

  console.log('\n');
  console.log('%c   call support level 2   ', COLORS.yellow);
  basicSupport.handle('advanced');

  console.log('\n');
  console.log('%c   call support level 3   ', COLORS.yellow);
  basicSupport.handle('expert');

  console.log('\n');
  console.log('%c   call unknown support   ', COLORS.yellow);
  basicSupport.handle('unknown');

}

main();
