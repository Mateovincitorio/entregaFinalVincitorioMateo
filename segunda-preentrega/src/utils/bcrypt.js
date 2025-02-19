import { hashSync, compareSync } from "bcrypt";

export const hashPassword = (password) =>hashSync(password, 5) //encripta pass

export const validatePass = (password, passwordBDD) =>compareSync(password,passwordBDD) //verifica que lo ingresado sea igual a la pass encriptada


