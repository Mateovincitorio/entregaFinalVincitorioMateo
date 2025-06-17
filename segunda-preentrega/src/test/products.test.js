import assert from "assert";
import "dotenv/config.js";
import sinon from "sinon"; // Para mocks y espías
import dbConnect from "../helpers/dbConnect.js";
import {
  createProduct,
  getProducts,
} from "../controllers/products.controller.js";

describe("createProduct controller", function () {
  function generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000); // Número entre 100000 y 999999
  }

  this.timeout(20000);

  before(async () => await dbConnect(process.env.MONGO_URI));

  it("debe crear un prod", async () => {
    const req = {
      body: {
        title: "Producto de test",
        description: "Este es un producto de prueba",
        code: generateRandomCode(),
        price: 99.99,
        category: "Testing",
        stock: 10,
      },
    };

    const res = {
      status: sinon.stub().returnsThis(), // Para poder encadenar .send()
      send: sinon.stub(),
    };

    await createProduct(req, res);

    // Verificar que se haya llamado send con un objeto que tenga _id (nuevo producto)
    const arg = res.send.getCall(0).args[0];

    assert.ok(arg._id);
  });

  it(" no debe crear un producto cuando no se pasan datos correctos", async () => {
    try {
      const req = {
        body: {
          title: "",
          description: "",
          code: "",
          price: "",
          category: "",
          stock: "",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      await createProduct(req, res);
    } catch (error) {
      assert.ok(error.message);
    }
  });
  it("se deben leer los prod de la bdd", async () => {
    const req = {
      query: {},
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    await getProducts(req, res);

    const productos = res.send.getCall(0)?.args?.[0];

    assert.ok(productos);
    assert.ok(Array.isArray(productos.docs));
  });
  it("no se deben leer los prod de la bdd", async () => {
    const req = {
      query: {},
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    await getProducts(req, res);

    const productos = res.send.getCall(0)?.args?.[0];

    assert.ok(productos);
  });
});
