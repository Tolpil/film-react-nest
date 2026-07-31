import { LoggerService, Injectable } from '@nestjs/common';

function serialize(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}

@Injectable()
export class JsonLogger implements LoggerService {
  formatMessage(
    level: string,
    message: unknown,
    optionalParams: unknown[] = [],
  ) {
    return JSON.stringify({
      level,
      message: serialize(message),
      optionalParams: optionalParams.map(serialize),
    });
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('error', message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    console.warn(this.formatMessage('warn', message, optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    console.debug(this.formatMessage('debug', message, optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    console.debug(this.formatMessage('verbose', message, optionalParams));
  }
}
