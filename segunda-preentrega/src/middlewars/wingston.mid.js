import logger from "../config/logger.config.js";

const winstonMid = (req, res, next) => {
    try {
        req.logger = logger;
        logger.HTTP(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`)
        next()   
    } catch (error) {
        next(error)
    }
}

export default winstonMid;