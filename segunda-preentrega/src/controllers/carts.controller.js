
import cartModel from "../models/cart.model.js";


export const getCart = async(req,res) => {
    try {
        const cardId = req.params.cid
        const cart = await cartModel.findOne({_id: cardId})
        if(cart)
            return res.status(200).send(cart)
        else 
            return res.status(404).send("Carrito no existe")
    } catch (e) {
        res.status(500).send(e)
    }
}

export const createCart = async(req,res) => {
    try {
        await cartModel.create({products: []})
        res.status(201).send("Carrito creado correctamente")
    } catch (e) {
        res.status(500).send(e)
    }
}

export const insertProductCart = async(req,res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const {quantity} = req.body
        
        const cart = await cartModel.findOne({_id: cartId})

        if(cart) {
            const indice = cart.products.findIndex(prod => prod._id == productId)

            if(indice != -1) 
                cart.products[indice].quantity = quantity //Si el producto existe, modifico la cantidad
            else 
                cart.products.push({id_prod: productId, quantity: quantity})
            
            await cartModel.findByIdAndUpdate(cartId, cart)
            return res.status(200).send("Carrito actualizado correctamente")
        } else {
            return res.status(404).send("Carrito no existe")
        }

    } catch (e) {
        res.status(500).send(e)
    }
}

export const deleteProductCart = async(req,res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const cart = await cartModel.findOne({_id: cartId})

        if(cart) {
            const indice = cart.products.findIndex(prod => prod.id == productId)

            if(indice != -1 ) {
                cart.products.splice(indice, 1)
                cart.save() //await cartModel.findByIdAndUpdate(cartId, cart)
                return res.status(200).send("Producto eliminado correctamente")
            } else {
                return res.status(404).send("Producto no existe")
            }
        } else {
            return res.status(404).send("Carrito no existe")
        }
    } catch (e) {
        res.status(500).send(e)
    }
}

export const deleteCart = async(req,res) => {
    try {
        const cardId = req.params.cid
        const cart = await cartModel.findOne({_id: cardId})
        if(cart) {
            cart.products = []
            cart.save()
            return res.status(200).send("Todos los productos del carrito han sido eliminados")
        } else {
            return res.status(404).send("Carrito no existe")
        }
    } catch (e) {
        res.status(500).send(e)
    }
}
