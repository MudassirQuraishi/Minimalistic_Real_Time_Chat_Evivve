const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, align, json } = format;
const logFolder = "./Logs";

// Custom format for log messages written to file
const customFormatFile = printf(
    ({
        level,
        code,
        message,
        function_name,
        reason,
        details,
        timestamp,
        uuid,
        user,
    }) => {
        let logMessage = timestamp ? `[${timestamp}]` : "";
        logMessage += level ? `${level}: ` : "";
        if (code) logMessage += ` Code: ${code} |`;
        if (message) logMessage += ` Message: ${message} |`;
        if (function_name) logMessage += ` Function: ${function_name} |`;
        if (reason) logMessage += ` Reason: ${reason} |`;
        if (details) logMessage += ` Details: ${details} |`;
        if (uuid) logMessage += ` UUID: ${uuid} |`;
        if (user) logMessage += ` User: ${user} |`;

        return logMessage;
    }
);

// Custom format for log messages displayed in console
const customFormatConsole = printf(({ level, message, timestamp }) => {
    let logMessage = timestamp ? `[${timestamp}] ` : "";
    logMessage += level ? `${level}: ` : "";
    if (message) logMessage += `Message: ${message}`;
    return logMessage;
});

// Configuring the logger
const Logger = createLogger({
    transports: [
        // Console transport for displaying logs in the console
        new transports.Console({
            level: process.env.LOG_LEVEL || "info",
            format: combine(
                colorize({ all: true }),
                timestamp({
                    format: "YYYY-MM-DD hh:mm:ss.SSS A",
                }),
                align(),
                customFormatConsole
            ),
        }),
        // File transport for writing logs to a file
        new transports.File({
            filename: `${logFolder}/Logs.log`,
            level: "silly",
            format: combine(timestamp(), json(), customFormatFile),
        }),
    ],
});

module.exports = Logger;
