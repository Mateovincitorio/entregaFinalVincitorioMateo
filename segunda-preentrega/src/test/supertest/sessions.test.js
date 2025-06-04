import "dotenv/config.js";
import { expect } from "chai";
import supertest from "supertest";

const requester = supertest(`http://localhost:${process.env.PORT}/api`);

describe("TESTING: rutas de sessions", () => {
  const Admin = {
    email: `test_aqa${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}@mail.com`,
    password: `q${Date.now()}_${Math.floor(Math.random() * 10000)}password`,
    first_name: "qm",
    last_name: "mq",
    age: 19,
  };

  let cookies;

  let userId;

  it("POST /api/sessions/register , error 401 al registrar un usuario ya registrado", async () => {
    const response = await requester.post("/sessions/register").send(Admin);
    const { status, _body } = response;
    expect(status).to.be.equals(409);
  });

  it("POST /api/sessions/register , crea un usuario no registrado", async () => {
    const uuid = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const admin2 = {
      email: `test_${uuid}@mail.com`,
      password: `pass_${Math.random().toString(36).substring(2, 10)}`,
      first_name: "mq",
      last_name: "mq",
      age: 19,
    };

    const response = await requester.post("/sessions/register").send(admin2);
    const { status } = response;

    console.log("STATUS:", status);

    expect(status).to.be.equals(201);
  });

  it("POST /api/sessions/login", async () => {
    const response = await requester.post("/sessions/login").send(Admin);
    cookies = response.headers["set-cookie"]?.[0]; // 👈 CORRECTO
    userId = response.body.payload?._id; // 👈 si el login devuelve el user completo
    expect(response.status).to.equal(200);
  });

  it("POST /api/sessions/viewregister", async () => {
    const response = await requester.get("/sessions/viewregister");
    expect(response.status).to.be.equals(200);
    expect(response.text).to.include("Registro de Usuarios");
  });
  it("POST /api/sessions/viewlogin", async () => {
    const response = await requester.get("/sessions/viewlogin");
    expect(response.status).to.be.equals(200);
    expect(response.text).to.include("Inicio de Sesion de Usuarios");
  });
  it("DELETE /api/users/:uid", async () => {
    const response = await requester
      .delete(`/users/${userId}`)
      .set("Cookie", cookies);
    expect(response.status).to.equal(200);
  });
});
