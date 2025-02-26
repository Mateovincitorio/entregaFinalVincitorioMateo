import { Router } from "express";
import { productsModel } from "../models/products.model.js";
import { getProduct,getProducts,createProduct,deleteProduct,updateProduct } from "../controllers/products.controller.js";
import { authorization } from "../config/authorizate.js";
import passport from "passport";

//probar todos los endpoints

const productsRoutes = Router();

productsRoutes.get('/', passport.authenticate('jwt'), getProducts)
productsRoutes.get('/:pid', passport.authenticate('jwt'), getProduct)
productsRoutes.post('/', passport.authenticate('jwt'), authorization("Admin"), createProduct)
productsRoutes.put('/:pid', passport.authenticate('jwt'), authorization("Admin"), updateProduct)
productsRoutes.delete('/:pid', passport.authenticate('jwt'), authorization("Admin"), deleteProduct)




export default productsRoutes;
