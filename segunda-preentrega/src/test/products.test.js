import assert from "assert";
import "dotenv/config.js";
import sinon from "sinon"; // Para mocks y espías
import dbConnect from "../helpers/dbConnect.js";
import {
  createProduct,
  getProducts,
} from "../controllers/products.controller.js";

describe("createProduct controller", function () {
  this.timeout(20000);

  before(async () => await dbConnect(process.env.MONGO_URI));

  it("debe crear un prod", async () => {
    const req = {
      body: {
        title: "producawa",
        description: "prouctwo puaeeba",
        code: 535822,
        price: 202,
        category: "pueaww",
        stock: 2502,
      },
    };

    const res = {
      status: sinon.stub().returnsThis(), // Para poder encadenar .send()
      send: sinon.stub(),
    };

    await createProduct(req, res);

    // Verificar que se haya llamado status con 201
    assert(res.status.calledWith(201));

    // Verificar que se haya llamado send con un objeto que tenga _id (nuevo producto)
    const arg = res.send.getCall(0).args[0];
    assert.ok(arg._id);
  });

  it(" no debe crear un producto cuando no se pasan datos correctos", async () => {
    try {
      const req = {
        body: {
          title: productoeaa,
          description: productoeba,
          code: "452",
          price: "220",
          category: p3uea,
          stock: "2",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(), // Para poder encadenar .send()
        send: sinon.stub(),
      };
      await createProduct({});
    } catch (error) {
      assert.ok(error.message);
    }
  });
  it("se deben leer los prod de la bdd", async () => {
    const req = {
      query: {}, // ✅ importante
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    await getProducts(req, res);

    const productos = res.send.getCall(0)?.args?.[0];

    assert.ok(productos); // existe
    assert.ok(Array.isArray(productos.docs)); // tiene docs que es array
  });
  it("no se deben leer los prod de la bdd", async () => {
    const req = {
      query: {}, // ✅ importante
    };
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    await getProducts(req, res);

    const productos = res.send.getCall(0)?.args?.[0];

    assert.ok(productos); // existe
    assert.ok(productos); // tiene docs que es array
  });
});
