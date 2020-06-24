import constants from './constants';
import * as logger from 'winston';

const date = new Date();
const fileName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.log`;
logger.configure({
  level: 'debug',
  format: logger.format.combine(
    logger.format.colorize(),
    logger.format.simple()),
  transports: [
    new logger.transports.File({ filename: `logs/${fileName}`, level: 'debug' }),
    new logger.transports.Console()
  ]
});

export class Logger {
  public static readonly shouldLog: boolean = constants.environment !== 'test';
  public static readonly console = logger;

  public static log(...args: unknown[]): void {
    if (Logger.shouldLog) Logger.console.debug(Logger.formatArgs(args));
  }

  public static warn(...args: unknown[]): void {
    if (Logger.shouldLog) Logger.console.warn(Logger.formatArgs(args));
  }

  public static error(...args: unknown[]): void {
    if (Logger.shouldLog) Logger.console.error(Logger.formatArgs(args));
  }

  public static info(...args: unknown[]): void {
    if (Logger.shouldLog) Logger.console.info(Logger.formatArgs(args));
  }

  public static verbose(...args: unknown[]): void {
    if (Logger.shouldLog) Logger.console.verbose(Logger.formatArgs(args));
  }

  private static formatArgs(args: unknown[]): string {
    return JSON.stringify(args, null, 4);
  }

}
