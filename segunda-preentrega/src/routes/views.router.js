import { Router } from "express";
import { productsModel } from "../models/products.model.js";
import { cartsModel } from "../models/cart.model.js";


const viewsRoutes = Router()

  

viewsRoutes.get('/', async (req, res) => {
  try {
    const { limit = 10, numPage = 1, categoria } = req.query;
    const filter = {};
    if (categoria) {
      filter.category = categoria;
    }
    const {
      docs,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage
    } = await productsModel.paginate(filter, {
      limit: parseInt(limit), 
      page: parseInt(numPage),
      sort: { price: 1 }
    });
    res.render('home', {
      products: docs,
      hasNextPage,
      hasPrevPage,
      prevPage,
      nextPage,
      page,
      totalPages,
      categoria 
    });
  } catch (error) {
    console.error("Error en la ruta /:", error);
    res.status(500).send("Error interno del servidor");
  }
});

viewsRoutes.get('/realtimeproducts', async ( req, res)=>{
    try{
        const productos = await productsModel.find()
        const isEmpty = productos.length === 0
        res.render('realTimeProducts',{productos,isEmpty})
   }catch (error) {
       console.error("Error en la ruta /:", error);
       res.status(500).send("Error interno del servidor");
   }
})

viewsRoutes.post('/agregar', async (req,res)=>{
  try{
    //desestructuro el nuevo producto
    const { title,description,price,status,stock,category }=req.body;

    if (!title || !description || !price || !stock || !category) {
      return res
        .status(400)
        .send({ message: "Todos los campos son obligatorios" });
    }

    const newProduct = await productsModel.create({
      id : Date.now(),
      title,
      description,
      price:parseFloat(price),
      status,
      stock :parseInt(stock, 10),
      category,
    })

    if (req.io) {
      req.io.emit("updatedProducts", await productsModel.find());
    } else {
      console.error("Socket.IO no está disponible");
    }


    res.status(201).send({ message: "Producto agregado correctamente"});
  }catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

viewsRoutes.post('/borrar', async (req,res)=>{
  try{
    const { id } = req.body;
    await productsModel.findOneAndDelete({_id: id});
const productosActualizados = await productsModel.find();
if (req.io) {
  req.io.emit("updatedProducts", await productsModel.find());
} else {
  console.error("Socket.IO no está disponible");
}
    res.status(200).send({ message: "Producto eliminado correctamente" });
  }catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).send("Error interno del servidor");
  }
  
})

viewsRoutes.get("/cart/:cid", async (req, res) => {/*
  try {
    const { cid } = req.params
    const cart = await cartsModel.findOne({_id: cid})
    res.send({status:"success",payload:cart})
    res.render('cartDetail',{ cart })
  } catch (error) {
    console.log(error); 
  }*/try {
    const { cid } = req.params
    const cart = await cartsModel.findOne({_id: cid}).populate("products");

    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    res.render('cartDetail',{cart});
  } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).send("Error interno del servidor");
    }
  });

export default viewsRoutes;



