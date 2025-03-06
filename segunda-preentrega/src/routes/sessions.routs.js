import passport from 'passport'
import { Router } from "express";
import { login, register, githubLogin, viewRegister, viewLogin } from "../controllers/sessions.controller.js";

const sessionsRouter = Router()

sessionsRouter.post('/register', passport.authenticate("register"), register)
sessionsRouter.post('/login', passport.authenticate("login"), login)
sessionsRouter.get('/github', passport.authenticate("github", {scope: ['user:email']}), (req,res) => {})
sessionsRouter.get('/githubcallback', passport.authenticate("github", {failureRedirect: '/api/sessions/login'}), githubLogin)
sessionsRouter.get('/current', passport.authenticate("jwt") ,(req,res) => res.status(200).send(req.user))
sessionsRouter.get('/viewregister', viewRegister)
sessionsRouter.get('/viewlogin', viewLogin)

export default sessionsRouter