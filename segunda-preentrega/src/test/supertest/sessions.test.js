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
  const user = {
    email: `test${Date.now()}@mail.com`,
    password: "123456",
    first_name: "Test",
    last_name: "User",
    age: 20,
    rol: "Admin",
  };

  it("register user", async () => {
    const res = await requester.post("/sessions/register").send(user);
    expect(res.status).to.equal(200);
  });

  it("POST /api/sessions/register , error al registrar un usuario ya registrado", async () => {
    const response = await requester.post("/sessions/register").send({
      email: "paas@gmail.com", // el mismo email que ya se creó arriba
      password: "ppaas",
      first_name: "Papa",
      last_name: "vincitorio",
      age: 20,
      rol: "Admin",
    });
    expect(response.status).to.equal(400); // o 409
  });

  it("login user", async () => {
    const res = await requester.post("/sessions/login").send({
      email: user.email,
      password: user.password,
    });
    userId = res.body.payload?._id;
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    token = res.body.token; // guardar token que usarás
    userId = res.body.payload?._id; // si usas payload para el id
  });

  it("DELETE /api/users/:uid", async () => {
    expect(token).to.be.ok; // Verifica que el token esté definido

    const deleteRes = await requester
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Delete status:", deleteRes.status);
    console.log("Delete body:", deleteRes.body); // Para debugging si falla

    expect(deleteRes.status).to.equal(200);
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
