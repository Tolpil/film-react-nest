import { TSKVLogger } from './tskv-logger';

describe('TSKVLogger', () => {
  let logger: TSKVLogger;

  beforeEach(() => {
    logger = new TSKVLogger();
  });

  it('should format message as TSKV', () => {
    const result = logger.formatMessage('log', 'test message');
    expect(result).toBe('level=log\tmessage=test message');
  });

  it('should include context params in TSKV format', () => {
    const result = logger.formatMessage('error', 'error message', [
      'ctx1',
      'ctx2',
    ]);
    expect(result).toContain('level=error');
    expect(result).toContain('message=error message');
    expect(result).toContain('context=');
  });

  it('should call console.log on log()', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    logger.log('test');
    expect(spy).toHaveBeenCalledWith('level=log\tmessage=test');
    spy.mockRestore();
  });

  it('should call console.error on error()', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    logger.error('error test');
    expect(spy).toHaveBeenCalledWith('level=error\tmessage=error test');
    spy.mockRestore();
  });

  it('should call console.warn on warn()', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    logger.warn('warn test');
    expect(spy).toHaveBeenCalledWith('level=warn\tmessage=warn test');
    spy.mockRestore();
  });

  it('should call console.debug on debug()', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation();
    logger.debug('debug test');
    expect(spy).toHaveBeenCalledWith('level=debug\tmessage=debug test');
    spy.mockRestore();
  });

  it('should call console.debug on verbose()', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation();
    logger.verbose('verbose test');
    expect(spy).toHaveBeenCalledWith('level=verbose\tmessage=verbose test');
    spy.mockRestore();
  });

  it('should format object context as JSON string', () => {
    const result = logger.formatMessage('log', 'test', [{ key: 'value' }]);
    expect(result).toContain('context={"key":"value"}');
  });
});
