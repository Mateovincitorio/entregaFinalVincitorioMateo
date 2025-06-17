//import { userModel } from "../models/users.model.js";
import logger from "../config/logger.config.js";
import userModel from "../models/users.model.js";

export const getUsers =
  ("/",
  async (req, res) => {
    try {
      const users = await userModel.find();
      res.send(users);
    } catch (error) {
      logger.ERROR(error);
    }
  });

export const getUser =
  ("/:uid",
  async (req, res) => {
    try {
      const uid = req.params.uid;
      const user = await userModel.findById(uid);
      res.send(user);
    } catch (error) {
      logger.ERROR(error);
    }
  });

export const postUsers = async (req, res) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "Usuario ya existente" });
    }

    const user = await userModel.create({
      first_name,
      last_name,
      email,
      password,
      age,
    });

    return res.status(201).json({
      message: `Usuario creado con el id: ${user?.id}`,
      payload: user,
    });
  } catch (error) {
    logger.ERROR(error);
    return res.status(500).json({ error: error.message });
  }
};

export const putUser =
  ("/:uid",
  async (req, res) => {
    try {
      const uid = req.params.uid;
      const { first_name, last_name, email, password, age } = req.body;
      const user = await userModel.findByIdAndUpdate(uid, {
        first_name,
        last_name,
        email,
        password,
        age,
      });
      res.send(`Usuario actualizado con el id: ${user?.id}`);
    } catch (error) {
      logger.ERROR(error);
    }
  });

export const deleteUsers =
  ("/:uid",
  async (req, res) => {
    try {
      const uid = req.params.uid;
      const user = await userModel.findByIdAndDelete(uid);
      res.status(200).send(`usuario con id "${user?.id}" eliminado`, user);
    } catch (error) {
      logger.ERROR(error);
    }
  });
