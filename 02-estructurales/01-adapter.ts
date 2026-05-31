/**
 * ! Patrón Adapter
 *  Permite que objetos con interfaces incompatibles trabajen juntos, también es muy
 *  util para utilizar librerías de terceros en nuestra aplicación sin depender
 *  directamente de ellas.
 *
 * * Es útil cuando se quiere reutilizar una clase que no tiene la interfaz que
 * * necesitamos o cuando queremos crear una capa de abstracción para una librería
 * * de terceros.
 *
 * https://refactoring.guru/es/design-patterns/adapter
 */

import { LocalLogger as Logger } from "./adapter-files/local-logger.ts";
// import { DenoLoggerAdapter as Logger } from "./adapter-files/logger-adapter.ts";


const logger = new Logger('01-adapter.ts');

logger.writeLog('This is a log message');
logger.writeError('This is an error message');
logger.writeWarning('This is a warning message');
