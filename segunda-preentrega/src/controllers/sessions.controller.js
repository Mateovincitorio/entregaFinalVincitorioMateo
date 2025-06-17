import logger from "../config/logger.config.js";
import userModel from "../models/users.model.js";
import { validatePass, hashPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(400)
        .json({ message: "usuario o contraseña no válida" });
    }

    const token = generateToken(req.user);

    // Podés setear la cookie con el token JWT aquí
    return res
      .status(200)
      .cookie("coderSession", token, {
        httpOnly: true,
        secure: false,
        maxAge: 86400000, // 1 día
      })
      .json({
        message: "usuario logueado correctamente",
        token,
        payload: req.user,
      });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const register = async (req, res) => {
  try {
    console.log("LLEGÓ AL REGISTER", req.body);
    const { first_name, last_name, email, age, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son obligatorios" });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(401).json({ message: "El usuario ya está registrado" });
    }

    const hashedPassword = hashPassword(password);
    const newUser = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "Usuario registrado correctamente", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
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
