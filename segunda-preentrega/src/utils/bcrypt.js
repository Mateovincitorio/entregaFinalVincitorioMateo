import dotenv from 'dotenv';
import { hashSync, compareSync } from "bcrypt";
dotenv.config();

export const hashPassword = (password) =>hashSync(password, parseInt(process.env.SALT)) //encripta pass

export const validatePass = (password, passwordBDD) =>compareSync(password,passwordBDD) //verifica que lo ingresado sea igual a la pass encriptada


