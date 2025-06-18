import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import cartsModel from "./cart.model.js";
import logger from "../config/logger.config.js";

const userSchema = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  rol: {
    type: String,
    default: "Usuario",
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts",
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.cart) {
      const newCart = await cartsModel.create({ products: [] });
      this.cart = newCart._id;
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default model("users", userSchema);
