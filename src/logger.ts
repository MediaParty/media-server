import winston from "winston";

export const mediaPartyLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: new winston.transports.Console({
        format: winston.format.printf(options => {
            return `[MediaParty] - ${new Date().toLocaleString()} - ${options.level}: ${options.message}`;
        }),
    })
});