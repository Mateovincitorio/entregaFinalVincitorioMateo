import logger from "../config/logger.config.js";
import userModel from "../models/users.model.js";
import { validatePass, hashPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(400)
        .json({ message: "usuario o contraseña no valida" });
    //sesion de BDD
    req.session.user = {
      email: req.user.email,
      rol: req.user.rol,
      first_name: req.user.first_name,
    };

    //retorna un token de jwt
    return res
      .status(200)
      .cookie("coderSession", generateToken(req.user), {
        httpOnly: true,
        secure: false, //evita errores en https
        maxAge: 8640000, //un dia en segundos
      })
      .json({ message: "usuario logueado correctamente" });
  } catch (error) {
    logger.ERROR("Error en el login:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const register = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(400)
        .json({ message: "email y contraseña son obligarorios" });

    return res
      .status(200)
      .json({ message: "usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const githubLogin = (req, res) => {
  try {
    req.session.user = {
      email: req.user.email,
      rol: req.user.rol,
      first_name: req.user.first_name,
    };
    return res
      .status(200)
      .cookie("coderSession", generateToken(req.user), {
        httpOnly: true,
        secure: false, //evita errores en https
        maxAge: 8640000, //un dia en segundos
      })
      .redirect("/api/products");
  } catch (error) {
    res.status(500).json({ message: e });
  }
};

export const viewRegister = (req, res) => {
  res.status(200).render("templates/register", {
    title: "Registro de Usuarios",
    url_js: "/js/register.js",
    url_css: "/css/main.css",
  });
};

export const viewLogin = (req, res) => {
  res.status(200).render("templates/login", {
    title: "Inicio de Sesion de Usuarios",
    url_js: "/js/login.js",
    url_css: "/css/main.css",
  });
};
