import { Router } from "express";
import fs from "fs";
import Swal from 'sweetalert2'


const viewsRoutes = Router()

const getProducts = async () => {
    try {
      const products = await fs.promises.readFile(
        "src/db/productos.json",
        "utf-8"
      );
      const productsJson = JSON.parse(products);
      return productsJson;
    } catch (error) {
      return [];
    }
  };

  const saveProducts = async (products) => {
  try {
    await fs.promises.writeFile(
      "src/db/productos.json",
      JSON.stringify(products, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error al guardar productos:", error);
    throw error; // Asegúrate de propagar el error para manejarlo en el lugar correspondiente.
  }
};
  

viewsRoutes.get('/', async (req,res)=>{
    try{
         const productos = await getProducts()
         res.render('home',{productos})
    }catch (error) {
        console.error("Error en la ruta /:", error);
        res.status(500).send("Error interno del servidor");
    }
});

viewsRoutes.get('/realtimeproducts', async ( req, res)=>{
    try{
        const productos = await getProducts()
        /**/
       const isEmpty = productos.length === 0
        res.render('realTimeProducts',{productos,isEmpty})
   }catch (error) {
       console.error("Error en la ruta /:", error);
       res.status(500).send("Error interno del servidor");
   }
})

viewsRoutes.post('/agregar', async (req,res)=>{
  try{
    //desestructurpo el nuevo producto
    const { title,description,price,status,stock,category }=req.body;
    const productos = await getProducts();
      const newProduct = {
      id : Date.now(),
      title,
      description,
      price:parseFloat(price),
      status,
      stock :parseInt(stock, 10),
      category,
    }
    productos.push(newProduct);
    await saveProducts(productos);
    req.app.get("io").emit("updatedProducts",productos)
    res.status(201).send({ message: "Producto agregado correctamente"});
  }catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

viewsRoutes.post('/borrar', async (req,res)=>{
  try{
    const { id } = req.body;
    const productos = await getProducts()
    const updatedProducts = productos.filter((producto) => producto.id !== Number(id))
    await saveProducts(updatedProducts)
    req.app.get("io").emit("updatedProducts", updatedProducts);
    res.status(200).send({ message: "Producto eliminado correctamente" });
  }catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).send("Error interno del servidor");
  }
  
})

export default viewsRoutes
