import "dotenv/config.js";
import { expect } from "chai";
import supertest from "supertest";
import { response } from "express";
import logger from "../../config/logger.config.js";
import jwt from "jsonwebtoken";

const requester = supertest(`http://localhost:${process.env.PORT}/api`);

describe("TESTING: rutas de sessions", () => {
  const data = {
    email: "mateo586@coder.com",
    password: "holaaa125534",
    rol: "Admin",
  };
  let token;

  let cookies;

  let userId;

  it("POST /api/sessions/register crea un usuario no registrado", async () => {
    const response = await requester.post("/sessions/register").send(data);
    const { status, _body } = response;
    expect(status).to.be.equals(201);
  });

  it("POST /api/sessions/register , error al registrar un usuario ya registrado", async () => {
    const response = await requester.post("/sessions/register").send(data);
    expect(response.status).to.equal(400); // o 409
  });

  it("login user", async () => {
    const res = await requester.post("/sessions/login").send(data);
    userId = res._body.payload._id;
    cookies = res.headers["set-cookie"];
    expect(res.status).to.equal(200);
    //expect(res.body).to.have.property("token");
  });

  it("DELETE /api/users/:uid", async () => {
    const response = await requester
      .delete(`/users/${userId}`)
      .set("Cookie", cookies);
    const { status } = response;
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
