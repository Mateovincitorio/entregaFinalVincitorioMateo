import "dotenv/config.js";
import { expect } from "chai";
import supertest from "supertest";
import { response } from "express";
import logger from "../../config/logger.config.js";
import jwt from "jsonwebtoken";

const requester = supertest(`http://localhost:${process.env.PORT}/api`);

describe("TESTING: rutas de sessions", () => {
  let token;

  let cookies;

  let userId;
  /*const user = {
    email: `test${Date.now()}@mail.com`,
    password: "123456",
    first_name: "Test",
    last_name: "User",
    age: 20,
    rol: "Admin",
  };

  /*it("register user", async () => {
    const res = await requester.post("/sessions/register").send(user);
    console.log("Registered user response:", res.body);
    expect(res.status).to.equal(200);
  });*/

  it("POST /api/sessions/register crea un usuario no registrado", async () => {
    const data = {
      email: "mateo586@coder.com",
      password: "holaaa125534",
    };
    const response = await requester.post("/sessions/register").send(data);
    logger.INFO("response.body " + JSON.stringify(response.body, null, 2));

    const { status, body } = response;
    userId = body._id;
    expect(status).to.be.equals(201);
  });

  /*it("POST /api/auth/register crea un usuario no registrado", async () => {
    const response = await request(app).post("/api/auth/register").send({
      first_name: "Mateo",
      last_name: "Vincitorio",
      email: "nuevo@ejemplo.com",
      password: "12345678",
      age: 20,
      rol: "Usuario",
    });

    expect(response.statusCode).to.equal(201);
  });*/

  it("POST /api/sessions/register , error al registrar un usuario ya registrado", async () => {
    const response = await requester.post("/sessions/register").send({
      email: "paas@gmail.com", // el mismo email que ya se creó arriba
      password: "ppaas",
      first_name: "Papa",
      last_name: "vincitorio",
      age: 20,
      rol: "Administrador",
    });
    expect(response.status).to.equal(400); // o 409
  });

  it("login user", async () => {
    const res = await requester.post("/sessions/login").send({
      email: "mateo5@coder.com",
      password: "hola125534",
    });
    userId = res.body.payload?._id;
    token = res.body.token; // guardar token que usarás
    cookies = Headers["set-cookie"];
    userId = res.body.payload?._id; // si usas payload para el id
    expect(res.status).to.equal(200);
    //expect(res.body).to.have.property("token");
  });

  it("DELETE /api/users/:uid", async () => {
    const response = await requester
      .delete(`/users/${userId}`)
      .set("Cookie", cookies);
    const { status } = response;
    /*logger.INFO("Delete status:", deleteRes.status);
    logger.INFO("Delete body:", deleteRes.body); // Para debugging si falla
    logger.INFO("Decoded:", jwt.decode(token));*/

    expect(status).to.equal(200);
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
});
