import { Router } from "express";
import {
  getCart,
  createCart,
  insertProductCart,
  deleteProductCart,
  deleteCart,
  checkOut,
} from "../controllers/carts.controller.js";
import { authorization } from "../config/authorizate.js";
import passport from "passport";

const cartsRouter = Router();

cartsRouter.get(
  "/:cid",
  passport.authenticate("jwt"),
  authorization("Usuario"),
  getCart
);
cartsRouter.post(
  "/",
  passport.authenticate("jwt"),
  authorization("Usuario"),
  createCart
);
cartsRouter.post(
  "/:cid/products/:pid",
  passport.authenticate("jwt"),
  authorization("Usuario"),
  insertProductCart
);
cartsRouter.post(
  "/:cid/purchase",
  passport.authenticate("jwt"),
  authorization("Usuario"),
  checkOut
);
cartsRouter.delete(
  "/:cid",
  passport.authenticate("jwt"),
  authorization("Usuario"),
  deleteCart
);
cartsRouter.delete(
  "/:cid/products/:pid",
  passport.authenticate("jwt"),
  authorization("Usuario"),
  deleteProductCart
);

export default cartsRouter;
