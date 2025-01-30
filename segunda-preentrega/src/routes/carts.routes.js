import { Router } from "express";
import { cartsModel } from "../models/cart.model.js";
import mongoose from 'mongoose';


const cartRoutes = Router();


cartRoutes.get("/", async (req, res) => {
  try {
    const carts = await cartsModel.find()
    res.send({ carts }); 
  } catch (error) {
    console.log(error); 
  }
});

cartRoutes.post("/", async (req, res) => {
  try {
    const result = await cartsModel.create({products:[]})
    res.send(result)
  } catch (error) {
    console.log(error);
  }
});

cartRoutes.post("/add", async (req, res) => {
  try {
    const { productId } = req.body;
    console.log("Product ID recibido:", productId);
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.error("ID de producto inválido:", productId);
      return res.status(400).json({ error: "ID de producto inválido" });
  }
    let cart = await cartsModel.findOne();
    
    if (!cart) {
        cart = new cartsModel({ products: [] });
        await cart.save();
    }
    const existingProduct = cart.products.find(p => p.product.toString() === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ product: new mongoose.Types.ObjectId(productId), quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ message: "Producto agregado al carrito", cart });
} catch (error) {
    console.error("Error al agregar al carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
}
});

cartRoutes.delete('/:cid',async (req,res) => {
  try {
    const cid = req.params.cid;
      const result = await cartsModel.deleteOne({_id: cid})
      res.send(result)
  } catch (error) {
    console.log(error);
    
  }
})

cartRoutes.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    
    const productId = new mongoose.Types.ObjectId(pid);


    const carrito = await cartsModel.findOneAndUpdate(
      { _id: cid },
      { $pull: { products: { product: productId } } },
      { new: true }
    );

    if (!carrito) {
      return res.status(404).send({ error: 'Carrito no encontrado' });
    }

    if (!carrito.products.length) {
      return res.status(200).send({ message: 'El carrito está vacío' });
    }
    
    res.status(200).send({ message: 'Producto eliminado del carrito', carrito });
  } catch (error) {
    console.log("Error al eliminar el producto del carrito: ", error);
    res.status(500).send({ error: 'Error al eliminar el producto del carrito', details: error.message });
  }
});

cartRoutes.put('/:cid/products/:pid',async (req, res)=>{
  console.log("REQ.BODY:", req.body);
  try{
  const { cid, pid } = req.params;
  const { quantity } = req.body;
const productId = new mongoose.Types.ObjectId(pid);  // Convierte el pid a ObjectId

const cart = await cartsModel.findById(cid);

if (!cart) {
  return res.status(404).json({ error: "Carrito no encontrado" });
}

const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId.toString());

if (productIndex === -1) {
  return res.status(404).json({ error: "Producto no encontrado en el carrito" });
}

cart.products[productIndex].quantity = quantity;
await cart.save();

res.send({ message: "Cantidad actualizada correctamente" });

  }
  catch(error){
    console.error(error);
        res.status(500).json({ error: "Error en el servidor" });
  }
})

cartRoutes.put('/api/carts/:cid',async (req, res)=>{ //el codigo de este PUT esta hardcodeado, por lo qiue entendi en la consigna, debia ser asi!!!
  try {
    const { cid } = req.params;
    const newProducts = req.body;
    const cart = await cartsModel.findById(cid);
    if(!cart){
      res.status('404').json({message:"carrito no encontrado"})
    }
    const productIds= newProducts.map(p=>p.productId);
    const existingProducts = await Product.find({ _id: { $in: productIds } });
    
    if (existingProducts.length !== productIds.length) {
      return res.status(400).json({ status: 'error', message: 'Uno o más productos no existen' });
    }
    cart.products = newProducts;
    await cart.save();
    res.json({
      "status": "success",
    "payload": {
        "_id": "679ba55a7d4d8a2a6d47a32e",
        "products": [
            {
                "productId": "679a6a94ff5d2bd69a758693",
                "quantity": 3
            },
            {
                "productId": "679b5431332386f7f4cdc151",
                "quantity": 2
            }
        ]
    },
    "totalPages": 1,
    "prevPage": null,
    "nextPage": null,
    "page": 1,
    "hasPrevPage": false,
    "hasNextPage": false,
    "prevLink": null,
    "nextLink": null
    })
  } catch (error) {
    console.log(error);
  }
  
})


export default cartRoutes;
