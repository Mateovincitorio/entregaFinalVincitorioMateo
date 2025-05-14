import { config } from "dotenv";
import arg from "./arg.helper.js"

const {mode} = arg

const path = ".env."+mode
config({path})

const env = {
    PORT: process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    SESSION_SECRET:process.env.SESSION_SECRET,
    COOKIE_SECRET:process.env.COOKIE_SECRET,
    SALT:process.env.SALT,
    SECRETKEY:process.env.SECRETKEY
}

export default env