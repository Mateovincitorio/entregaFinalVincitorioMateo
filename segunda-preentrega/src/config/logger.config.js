import pkg from 'winston';
import path from 'path';

const { createLogger, format, transports, addColors, level } = pkg;
const { colorize, simple } = format;

const levels = {
    ERROR:0,
    WARN:1,
    INFO:2,
    HTTP:3
}
const colors = {
    ERROR:"red",
    WARN:"yellow",
    INFO:"blue",
    HTTP:"white"
}

addColors(colors)

const logger =  createLogger({
    levels:levels,
    format:colorize(),
    transports:[
        new transports.Console({level:"HTTP",format:simple()}),
        new transports.File({level:"ERROR",format:simple(),filename: path.resolve('src/logs/errors.log')})
    ]

})

export default logger