import { Router } from "express";
import { deleteUsers, getUser, getUsers, postUsers, putUser } from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.get('/',getUsers)
usersRouter.get('/:uid',getUser)
usersRouter.post('/',postUsers)
usersRouter.put('/:uid',putUser)
usersRouter.delete('/:uid',deleteUsers)


export default usersRouter