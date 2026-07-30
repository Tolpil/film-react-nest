import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatMessage(level: string, message: any, optionalParams: any[] = []) {
    return JSON.stringify({ level, message, optionalParams });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('error', message, optionalParams));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, optionalParams));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.formatMessage('debug', message, optionalParams));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verbose(message: any, ...optionalParams: any[]) {
    console.debug(this.formatMessage('verbose', message, optionalParams));
  }
}
