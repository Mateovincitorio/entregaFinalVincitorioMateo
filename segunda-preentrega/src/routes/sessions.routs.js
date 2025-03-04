import { Router } from "express";
import { register,login, githubLogin,viewRegister, viewLogin } from "../controllers/sessions.controller.js";
import passport from "passport";
import { authorization } from "../config/authorizate.js";

const sessionsRouter= Router()

sessionsRouter.post('/register', passport.authenticate('register'),register)
sessionsRouter.post('/login', passport.authenticate('login'),login)
sessionsRouter.get('/github', passport.authenticate('github',{scope:['user:email']}))
sessionsRouter.get('/githubCallback',passport.authenticate('github',{failureRedirect:'/api/sessions/login'}),githubLogin)
sessionsRouter.get('/viewregister', viewRegister)
sessionsRouter.get('/viewlogin',viewLogin)

export default sessionsRouter