import { Router } from "express";
import { deleteUsers, getUser, getUsers, postUsers, putUser } from "../controllers/users.controller.js";
import { authorization } from "../config/authorizate.js";
import passport from "passport";

const usersRouter = Router();

usersRouter.get('/', passport.authenticate('jwt'), authorization("Admin"),getUsers)
usersRouter.get('/:uid', passport.authenticate('jwt'), authorization("Admin"), getUser)
usersRouter.post('/', passport.authenticate('jwt'), authorization("Admin"), postUsers)
usersRouter.put('/:uid', passport.authenticate('jwt'), authorization("Admin"), putUser)
usersRouter.delete('/:uid', passport.authenticate('jwt'), authorization("Admin"), deleteUsers)


export default usersRouter