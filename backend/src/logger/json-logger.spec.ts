import { JsonLogger } from './json-logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  it('should format message as JSON', () => {
    const result = logger.formatMessage('log', 'test message');
    const parsed = JSON.parse(result);
    expect(parsed).toEqual({
      level: 'log',
      message: 'test message',
      optionalParams: [],
    });
  });

  it('should include optional params in JSON', () => {
    const result = logger.formatMessage('error', 'error message', [
      'context1',
      'context2',
    ]);
    const parsed = JSON.parse(result);
    expect(parsed).toEqual({
      level: 'error',
      message: 'error message',
      optionalParams: ['context1', 'context2'],
    });
  });

  it('should call console.log on log()', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    logger.log('test');
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({ level: 'log', message: 'test', optionalParams: [] }),
    );
    spy.mockRestore();
  });

  it('should call console.error on error()', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    logger.error('error test');
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'error',
        message: 'error test',
        optionalParams: [],
      }),
    );
    spy.mockRestore();
  });

  it('should call console.warn on warn()', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    logger.warn('warn test');
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'warn',
        message: 'warn test',
        optionalParams: [],
      }),
    );
    spy.mockRestore();
  });

  it('should call console.debug on debug()', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation();
    logger.debug('debug test');
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'debug',
        message: 'debug test',
        optionalParams: [],
      }),
    );
    spy.mockRestore();
  });

  it('should call console.debug on verbose()', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation();
    logger.verbose('verbose test');
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'verbose',
        message: 'verbose test',
        optionalParams: [],
      }),
    );
    spy.mockRestore();
  });
});
