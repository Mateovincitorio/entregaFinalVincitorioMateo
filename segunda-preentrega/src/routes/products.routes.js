import { Router } from "express";
import fs from "fs";
import { title } from "process";

const productsRoutes = Router();

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
    const parsedProducts = JSON.stringify(products);
    await fs.promises.writeFile(
      "src/db/productos.json",
      parsedProducts,
      "utf-8"
    );
    return true;
  } catch (error) {
    return false;
  }
};

const getSingleProduct = async (id) => {
  const products = await getProducts();
  const find = products.find((p) => p.id === id);
  return find;
};

productsRoutes.post("/", async (req, res) => {
    const product = req.body;
    product.id = Date.now();
  const id = product.id;
  const titulo = product.title
  
  if (
    !titulo ||
    !product.description ||
    !product.code ||
    !product.price ||
    product.status !== true ||
    !product.stock ||
    !product.category
  ) {
      return res
      .status(400)
      .send({ status: "Error", message: "complete bien el form" });
    }

    if (product.thumbnails &&(!Array.isArray(product.thumbnails) || !product.thumbnails.every((thumb) => typeof thumb === "string"))
    ) {
      return res
        .status(400)
        .send({ status: "Error", message: "El campo thumbnails no es válido" });
    }
  
    // Si thumbnails no está presente, inicializarlo como un array vacío
    if (!product.thumbnails) {
      product.thumbnails = [];
    }
    
    const products = await getProducts();
    
    
    
  const isOk = saveProducts(products);
  if (!isOk) {
    return res.send({ status: "Error", message: "producto no añadido" });
  }
  res.send({ status: "OK", message: "producto añadido" });
});



productsRoutes.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await getSingleProduct(id);
  if (!product) {
    return res
      .statusCode(404)
      .send({ status: "Error", message: "producto no encontrado" });
  }
  const products = await getProducts();
  const filterProducts = products.filter((p) => p.id !== id);
  const isOk = await saveProducts(filterProducts);
  if (!isOk) {
    return res.status(400).send({ status: "Error", message: "algo salio mal" });
  }
  res.send({ status: "OK", message: "producto eliminado" });
});

productsRoutes.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const productToUpdate = req.body;
  const listaProd = await getProducts();
  const product = listaProd.find((p) => p.id === id);
  if (
    !productToUpdate.title ||
    !productToUpdate.description ||
    !productToUpdate.code ||
    !productToUpdate.price ||
    productToUpdate.status !== true ||
    !productToUpdate.stock ||
    !productToUpdate.category
  ) {
    return res
      .status(400)
      .send({ status: "Error", message: "complete bien el form" });
  }
  if (product.thumbnails &&(!Array.isArray(product.thumbnails) || !product.thumbnails.every((thumb) => typeof thumb === "string"))
  ) {
    return res
      .status(400)
      .send({ status: "Error", message: "El campo thumbnails no es válido" });
  }

  // Si thumbnails no está presente, inicializarlo como un array vacío
  if (!product.thumbnails) {
    product.thumbnails = [];
  }

  if (!product) {
    return res
      .statusCode(404)
      .send({ status: "Error", message: "producto no encontrado" });
  }
  const updatedProducts = listaProd.map((p) => {
    if (p.id === id) {
      return {
        ...productToUpdate,
        id: id,
      };
      return p;
    }
  });
  const isOk = await saveProducts(updatedProducts);
  if (!isOk) {
    return res.status(400).send({ status: "Error", message: "algo salio mal" });
  }
  res.send({ status: "OK", message: "producto actualizado" });
});

productsRoutes.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await getSingleProduct(id);
  if (!product) {
    return res.status(404).send("no se encuentra");
  }
  res.send(product);
});

productsRoutes.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit);
  const products = await getProducts();
  if (isNaN(limit) || !limit) {
    return res.send(products);
  }
  const limitacion = products.slice(0, Number(limit));
  res.send({ limitacion });
});

export default productsRoutes;
