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
    // Obtener el productId del cuerpo de la solicitud
    const { productId } = req.body;
    console.log("Product ID recibido:", productId);
    // Verificar si el productId es válido
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.error("ID de producto inválido:", productId);
      return res.status(400).json({ error: "ID de producto inválido" });
  }

    // Buscar un carrito existente (si existe)
    let cart = await cartsModel.findOne();
    
    // Si no existe, crear uno nuevo
    if (!cart) {
        cart = new cartsModel({ products: [] });
        await cart.save();
    }

    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.products.find(p => p.product.toString() === productId);

    if (existingProduct) {
        // Si el producto ya está en el carrito, aumentar la cantidad
        existingProduct.quantity += 1;
    } else {
        // Si no está, agregarlo al carrito
        cart.products.push({ product: new mongoose.Types.ObjectId(productId), quantity: 1 });
    }

    // Guardar los cambios en el carrito
    await cart.save();

    // Enviar respuesta al cliente
    res.status(200).json({ message: "Producto agregado al carrito", cart });
} catch (error) {
    console.error("Error al agregar al carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
}
});


cartRoutes.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params
    const cart = await cartsModel.findOne({_id: cid})
    res.send({status:"success",payload:cart})
  } catch (error) {
    console.log(error); 
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



export default cartRoutes;
