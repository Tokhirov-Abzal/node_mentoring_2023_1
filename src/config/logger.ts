import { format, createLogger, transports } from 'winston';

const enumerateErrorFormat = format(info => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }

  return info;
});

export const winstonLogger = createLogger({
  format: format.combine(
    enumerateErrorFormat(),
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} ${level} ${message}`),
  ),
  transports: [new transports.Console()],
});
