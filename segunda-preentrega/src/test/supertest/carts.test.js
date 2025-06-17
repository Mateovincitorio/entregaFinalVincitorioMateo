import "dotenv/config.js";
import { expect } from "chai";
import supertest from "supertest";

const requester = supertest(`http://localhost:${process.env.PORT}/api`);

describe("TESTING: rutas de carts", () => {
  let token;
  let cartId;
  let productId;

  const testUser = {
    email: `test_${Date.now()}@mail.com`,
    password: "testpass123",
    first_name: "Test",
    last_name: "User",
    age: 30,
    rol: "Usuario",
  };

  before(async () => {
    await requester.post("/sessions/register").send(testUser);
    const loginRes = await requester.post("/sessions/login").send(testUser);
    token = loginRes.body.token;
  });

  it("POST /carts → debe crear un carrito", async () => {
    const res = await requester
      .post("/carts")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(201);
    expect(res.body.cart).to.have.property("_id");
    cartId = res.body.cart._id;
  });

  it("POST /products → debe crear un producto", async () => {
    const res = await requester
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "producto test",
        description: "desc test",
        code: `code${Date.now()}`,
        price: 100,
        stock: 10,
        category: "test",
      });
    expect(res.status).to.equal(201);
    productId = res.body.product._id;
  });

  it("POST /carts/:cid/products/:pid → debe insertar el producto en el carrito", async () => {
    const res = await requester
      .post(`/carts/${cartId}/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
  });

  it("GET /carts/:cid → debe obtener el carrito", async () => {
    const res = await requester
      .get(`/carts/${cartId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.cart).to.have.property("products");
  });

  it("DELETE /carts/:cid/products/:pid → debe eliminar el producto", async () => {
    const res = await requester
      .delete(`/carts/${cartId}/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
  });

  it("DELETE /carts/:cid → debe eliminar el carrito", async () => {
    const res = await requester
      .delete(`/carts/${cartId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
  });
});
