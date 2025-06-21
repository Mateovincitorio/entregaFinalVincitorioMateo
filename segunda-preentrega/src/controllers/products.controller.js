import { productsModel } from "../models/products.model.js";

export const getProducts = async (req, res) => {
  try {
    const { limit, page, metFilter, filter, metOrder, order } = req.query;

    const pag = page !== undefined ? page : 1; //si ingresan la pagina la tomo, sino por defecto es pag 1
    const limite = limit != undefined || limit !== null ? limit : 10; //si ingresan el limite lo tomo, sino es 10
    const filQuery = metFilter !== undefined ? { [metFilter]: filter } : {}; //
    const orderQuery = metOrder !== undefined ? { metOrder: order } : {};
    const prods = await productsModel.paginate(filQuery, {
      limit: limite,
      page: pag,
      orderQuery,
      lean: true,
    });

    prods.pageNumbers = Array.from({ length: prods.totalPages }, (_, i) => ({
      number: i + 1,
      isCurrent: i + 1 === prods.page,
    }));
    res.status(200).send(prods);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getProduct = async (req, res) => {
  try {
    const pid = req.params.pid;
    const prod = await productsModel.findById(pid).lean();
    if (prod) res.send(prod);
    else res.send("producto no existe");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, category, code, price, stock } = req.body || {};

    // Validación básica de campos requeridos
    if (
      !title?.trim() ||
      !description?.trim() ||
      !category?.trim() ||
      !code ||
      typeof price !== "number" ||
      typeof stock !== "number"
    ) {
      return res.status(400).send({ error: "Datos inválidos" });
    }

    const newProduct = await productsModel.create({
      title,
      description,
      category,
      price,
      stock,
      code,
    });

    res.status(201).send(newProduct);
  } catch (error) {
    console.error("Error creando producto:", error);
    res
      .status(500)
      .json({
        error: "Error interno al crear producto",
        details: error.message,
      });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const pid = req.params.pid;
    const updateProd = req.body;
    const rta = await productsModel.findByIdAndUpdate(pid, updateProd);
    if (rta) res.send("producto actualizado correctamente");
    else res.send("prod no existe");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const pid = req.params.pid;
    const updateProd = req.body;
    const rta = await productsModel.findByIdAndDelete(pid);
    if (rta) res.send("producto eliminado correctamente");
    else res.send("prod no existe");
  } catch (error) {
    res.status(500).send(error);
  }
};
