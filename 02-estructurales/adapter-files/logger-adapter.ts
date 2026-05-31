import { Logger } from 'jsr:@deno-library/logger';

interface IlogerAdapter {
  file: string;
  writeLog(msg: string): void;
  writeWarning(msg: string): void;
  writeError(msg: string): void;
}

export class DenoLoggerAdapter implements IlogerAdapter {

  private logger = new Logger();

  constructor(public file: string) {}

  writeLog(msg: string): void {
    this.logger.info(`[${this.file} Log] ${msg}`);
  }

  writeWarning(msg: string): void {
    this.logger.warn(`[${this.file} Warning] ${msg}`);
  }

  writeError(msg: string): void {
    this.logger.error(`[${this.file} Error] ${msg}`);
  }

}




