const { setupLog } = require('../../src/middleware/log');
const winston = require('winston');

describe('Middleware: Log', () => {
  test('Will overwrite console log', () => {
    expect(console.info).not.toEqual(winston.__mockLogger.info);
    expect(console.warn).not.toEqual(winston.__mockLogger.warn);
    expect(console.error).not.toEqual(winston.__mockLogger.error);
    expect(console.debug).not.toEqual(winston.__mockLogger.debug);

    setupLog({});

    console.info('info');
    console.warn('warn');
    console.error('error');
    console.debug('debug');

    expect(winston.__mockLogger.info).toHaveBeenCalled();
    expect(winston.__mockLogger.warn).toHaveBeenCalled();
    expect(winston.__mockLogger.error).toHaveBeenCalled();
    expect(winston.__mockLogger.debug).toHaveBeenCalled();

    expect(winston.createLogger).toHaveBeenCalledWith({
      format: undefined,
      level: 'warn',
      transports: [{}],
    });
  });

  test('Will overwrite console log and set the level to info', () => {
    expect(console.info).not.toEqual(winston.__mockLogger.info);
    expect(console.warn).not.toEqual(winston.__mockLogger.warn);
    expect(console.error).not.toEqual(winston.__mockLogger.error);
    expect(console.debug).not.toEqual(winston.__mockLogger.debug);

    setupLog({verbose: true});

    console.info('info');
    console.warn('warn');
    console.error('error');
    console.debug('debug');

    expect(winston.__mockLogger.info).toHaveBeenCalled();
    expect(winston.__mockLogger.warn).toHaveBeenCalled();
    expect(winston.__mockLogger.error).toHaveBeenCalled();
    expect(winston.__mockLogger.debug).toHaveBeenCalled();

    expect(winston.createLogger).toHaveBeenCalledWith({
      format: undefined,
      level: 'info',
      transports: [{}],
    });
  });

  test('Will overwrite console log and set the level to debug', () => {
    expect(console.info).not.toEqual(winston.__mockLogger.info);
    expect(console.warn).not.toEqual(winston.__mockLogger.warn);
    expect(console.error).not.toEqual(winston.__mockLogger.error);
    expect(console.debug).not.toEqual(winston.__mockLogger.debug);

    setupLog({verbose: true, debug: true});

    console.info('info');
    console.warn('warn');
    console.error('error');
    console.debug('debug');

    expect(winston.__mockLogger.info).toHaveBeenCalled();
    expect(winston.__mockLogger.warn).toHaveBeenCalled();
    expect(winston.__mockLogger.error).toHaveBeenCalled();
    expect(winston.__mockLogger.debug).toHaveBeenCalled();

    expect(winston.createLogger).toHaveBeenCalledWith({
      format: undefined,
      level: 'debug',
      transports: [{}],
    });
  });
});
