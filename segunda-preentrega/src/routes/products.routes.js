import { Router } from "express";
import { productsModel } from "../models/products.model.js";


const productsRoutes = Router();


productsRoutes.get("/", async (req, res) => {
  const { numPage = 1, limit = 10 } = req.query;
  try {
    const {
      docs,
      page,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage, 
      nextPage,
      prevLink,
      nextLink
    } = await productsModel.paginate({},{limit, numPage})
    res.send({
      status:'success',
      payload: docs,
      page,
      totalPages,
      hasPrevPage,
      hasNextPage,
      hasPrevPage,
      prevPage,
      nextPage,
      prevLink: hasPrevPage?`/productos?page=${prevPage}&limit=${limit}`:null,
      nextLink: hasNextPage?`/productos?page=${nextPage}&limit=${limit}`:null
    })
  } catch (error) {
    console.log(error);
  }
});

productsRoutes.post("/", async (req, res) => {
  try {
    const result = await productsModel.create({
      "title":"prod1",
      "description":"prod1",
      "code":1,
      "price":1,
      "status":true,
      "stock":2,
      "category":"productos"
     })
    res.send(result)
  } catch (error) {
    console.log(error);
  }
});



productsRoutes.delete("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const result = await productsModel.deleteOne({_id: pid})
  res.send(result)
});




/*productsRoutes.put("/:id", async (req, res) => {
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
});*/

/*productsRoutes.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await getSingleProduct(id);
  if (!product) {
    return res.status(404).send("no se encuentra");
  }
  res.send(product);
});*/



export default productsRoutes;
