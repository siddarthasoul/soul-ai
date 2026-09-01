import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';


const logDir = path.join(process.cwd(), 'logs');


// Define log formatting (Readable for console, JSON or structured text for files)
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), // Automatically captures error stack traces
    winston.format.splat(),
    winston.format.json()
);


const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
        // 1. Write all errors to error-%DATE%.log
        new winston.transports.DailyRotateFile({
            dirname: logDir,
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d', // Automatically delete logs older than 14 days
            maxSize: '20m',  // Rotate file if it exceeds 20MB
        }),

        // 2. Write all logs (info, warn, error) to combined-%DATE%.log
        new winston.transports.DailyRotateFile({
            dirname: logDir,
            filename: 'combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            maxSize: '20m',
        }),
    ],
});

// 3. If NOT in production, also log to the console with clean colors
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.colorize(),
                winston.format.printf((info) => {
                    const {
                        timestamp,
                        level,
                        message,
                        stack,
                        ...meta
                    } = info;

                    const metadata =
                        Object.keys(meta).length > 0
                            ? `\n${JSON.stringify(meta, null, 2)}`
                            : '';

                    return (
                        `[${timestamp}] ${level}: ${stack || message}` +
                        metadata
                    );
                }),
            ),
        }),
    );
}

export default logger;
