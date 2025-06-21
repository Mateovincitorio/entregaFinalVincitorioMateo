import "dotenv/config.js";
import { expect } from "chai";
import supertest from "supertest";
import logger from "../../config/logger.config.js";

const requester = supertest(`http://localhost:${process.env.PORT}/api`);

describe("TESTING: rutas de carts", () => {
  let token; // token para usuario normal (rol "Usuario")
  let adminToken; // token para admin (rol "Admin")
  let cartId;
  let productId;

  const testUser = {
    email: `user_${Date.now()}@mail.com`,
    password: "testpass123",
    first_name: "User",
    last_name: "Normal",
    age: 30,
    rol: "Usuario",
  };

  const testAdmin = {
    email: `admin_${Date.now()}@mail.com`,
    password: "testpass123",
    first_name: "Admin",
    last_name: "Admin",
    age: 30,
    rol: "Admin",
  };

  before(async () => {
    // Registro y login usuario normal
    await requester.post("/sessions/register").send(testUser);
    const loginRes = await requester.post("/sessions/login").send(testUser);
    token = loginRes.body.token;

    // Registro y login admin
    await requester.post("/sessions/register").send(testAdmin);
    const loginAdminRes = await requester
      .post("/sessions/login")
      .send(testAdmin);
    adminToken = loginAdminRes.body.token;
  });

  it("POST /carts → debe crear un carrito", async () => {
    const res = await requester
      .post("/carts")
      .set("Cookie", `coderSession=${token}`); // token usuario normal en cookie
    expect(res.status).to.equal(201);
    expect(res.body.cart).to.have.property("_id");
    cartId = res.body.cart._id;
  });

  it("POST /products → debe crear un producto", async () => {
    const res = await requester
      .post("/products")
      .set("Cookie", `coderSession=${adminToken}`) // token admin en header Authorization
      .send({
        title: "producto test",
        description: "desc test",
        code: Date.now(),
        price: 100,
        stock: 10,
        category: "test",
      });
    expect(res.status).to.equal(201);
    console.log("Respuesta de creación de producto:", res.body);
    productId = res.body._id || res.body.product?._id;
  });

  it("POST /carts/:cid/products/:pid → debe insertar el producto en el carrito", async () => {
    const res = await requester
      .post(`/carts/${cartId}/products/${productId}`)
      .set("Cookie", `coderSession=${token}`);
    expect(res.status).to.equal(200);
  });

  it("GET /carts/:cid → debe obtener el carrito", async () => {
    const res = await requester
      .get(`/carts/${cartId}`)
      .set("Cookie", `coderSession=${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("products");
  });

  it("GET /carts/:cid → obtener ID real del producto guardado", async () => {
    const res = await requester
      .get(`/carts/${cartId}`)
      .set("Cookie", `coderSession=${token}`);

    expect(res.status).to.equal(200);
    const insertedProduct = res.body.products[0];
    productId = insertedProduct?._id;
    console.log("ID real del producto en el carrito:", productId);
  });

  it("DELETE /carts/:cid/products/:pid → debe eliminar el producto", async () => {
    const res = await requester
      .delete(`/carts/${cartId}/products/${productId}`)
      .set("Cookie", `coderSession=${token}`);
    logger.INFO("cart" + cartId);
    logger.INFO("prodID " + productId);
    const { status } = res;
    expect(status).to.equal(200);
  });

  it("DELETE /carts/:cid → debe eliminar el carrito", async () => {
    const res = await requester
      .delete(`/carts/${cartId}`)
      .set("Cookie", `coderSession=${token}`);
    const { status } = res;
    expect(status).to.equal(200);
  });
});
