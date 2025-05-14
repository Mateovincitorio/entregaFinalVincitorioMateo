import { connect } from "mongoose";
import dotenv from "dotenv";
import logger from "../config/logger.config.js";

dotenv.config();

const dbConnect = async (url) => {
  try {
    await connect(url);
    logger.INFO("connected to mongo db");
  } catch (error) {
    logger.ERROR(error.message);
  }
};

export default dbConnect;
