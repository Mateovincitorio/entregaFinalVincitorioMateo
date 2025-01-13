import { Router } from "express";
import fs from "fs";

const cartRoutes = Router();

const getcarts = async () => {
  try {
    const carts = await fs.promises.readFile("src/db/carts.json", "utf-8");
    const cartsJson = JSON.parse(carts);
    return cartsJson;
  } catch (error) {
    return [];
  }
};

const getSingleCart = async (id) => {
  const carts = await getcarts();
  const find = carts.find((p) => p.id === id);
  if (!carts) {
    throw new Error("Carrito no encontrado");
  }
  return find;
};

const saveCarts = async (carts) => {
  try {
    const parsedCarts = JSON.stringify(carts);
    await fs.promises.writeFile("src/db/carts.json", parsedCarts, "utf-8");
    return true;
  } catch (error) {
    return false;
  }
};

const getProducts = async()=>{
    try {
        const products = await fs.promises.readFile('src/db/productos.json', 'utf-8')
        const productsJson = JSON.parse(products)
        return productsJson
    } catch (error) {
        return []
    }
}


cartRoutes.post("/", async (req, res) => {
  const cart = req.body;
  cart.id = Date.now();
  cart.products = [];
  const carts = await getcarts();
  carts.push(cart);
  const isOk = saveCarts(carts);
  if (!isOk) {
    return res.send({ status: "Error", message: "carrito no añadido" });
  }
  res.send({ status: "OK", message: "carrito añadido" });
});

cartRoutes.post("/:cid/product/:pid", async (req, res) => {
  
    const cartId = parseInt(req.params.cid)
    const prodId = parseInt(req.params.pid)
    const carts = await getcarts();
    const selectedCart = carts.find(c=>c.id===cartId);
    if(!selectedCart){
        return res.status(404).send({status:"Error", message:"no se encontro ningun carrito"})
    }
    const products = await getProducts();

    const existingProduct = selectedCart.products.find((p) => p.prodId === prodId);
  if (existingProduct) {
    existingProduct.quantity += 1; 
  } else {
    selectedCart.products.push({ prodId, quantity: 1 }); 
  }

    const isOk = await saveCarts(carts);
  if (!isOk) {

    return res.send({ status: "Error", message: "No se pudo guardar el carrito" });
  }
  res.send({selectedCart});
});


cartRoutes.get("/:cid", async (req, res) => {
  const id = parseInt(req.params.cid);
  const cart =  await getcarts();
  const cartFilter = cart.filter((c) => cart.id === id);
  if(!cartFilter){
    return res.status(404).send({ status: "Error", message: "Carrito no encontrado" });
  }
  await saveCarts(cartFilter);
  if (!cart) {
    return res.status(404).send("no se encuentra");
  }
  res.send({ productos: cartFilter });
});

cartRoutes.get("/", async (req, res) => {
  const cartsObtenidos = await getcarts();
  res.send({ cartsObtenidos });
});

export default cartRoutes;
