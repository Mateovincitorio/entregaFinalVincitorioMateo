import { Router } from "express";
import { getCart, createCart, insertProductCart, deleteProductCart, deleteCart } from '../controllers/carts.controller.js';

const cartsRouter = Router()

cartsRouter.get('/:cid', getCart)
cartsRouter.post('/', createCart)
cartsRouter.post('/:cid/products/:pid', insertProductCart )
cartsRouter.delete('/:cid', deleteCart)
cartsRouter.delete('/:cid/products/:pid', deleteProductCart)

export default cartsRouter