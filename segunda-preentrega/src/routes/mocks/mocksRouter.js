import { Router } from "express";
import createMockUser from "../../helpers/mocks/users.mocks.js";
import usersModel from "../../models/users.model.js";
import createMockProd from "../../helpers/mocks/products.mocks.js";
import { productsModel } from "../../models/products.model.js";
import logger from "../../config/logger.config.js";

const mockRouter = Router();

const mocksUserCB = async (req, res) => {
  const { n } = req.params;
  try {
    for (let i = 0; i < n; i++) {
      const one = createMockUser();
      await usersModel.create(one);
    }
    res.send(`${n} usuarios mockeados correctamente`);
  } catch (error) {
    logger.ERROR(error);
    res.status(500).send("Error al crear usuarios mockeados");
  }
};

const MockProdCB = async (req, res) => {
  const { n } = req.params;
  try {
    for (let i = 0; i < n; i++) {
      const one = createMockProd();
      await productsModel.create(one);
    }
    res.send(`${n} productos mockeados correctamente`);
  } catch (error) {
    logger.ERROR(error);
    res.status(500).send("Error al mockear productos");
  }
};

mockRouter.get("/user/:n", mocksUserCB);
mockRouter.get("/products/:n", MockProdCB);

export default mockRouter;
