import { Router } from "express";
import { getCart, createCart, insertProductCart, deleteProductCart, deleteCart } from '../controllers/carts.controller.js';
import { authorization } from "../config/authorizate.js";
import passport from "passport";

const cartsRouter = Router()

cartsRouter.get('/:cid', passport.authenticate('jwt'), authorization("usuario"), getCart)
cartsRouter.post('/', passport.authenticate('jwt'), authorization("usuario"), createCart)
cartsRouter.post('/:cid/products/:pid', passport.authenticate('jwt'), authorization("usuario"), insertProductCart )
cartsRouter.delete('/:cid', passport.authenticate('jwt'), authorization("usuario"), deleteCart)
cartsRouter.delete('/:cid/products/:pid', passport.authenticate('jwt'), authorization("usuario"),  deleteProductCart)

export default cartsRouter