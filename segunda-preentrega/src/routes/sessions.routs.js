import passport from "passport";
import { Router } from "express";
import {
  login,
  register,
  githubLogin,
  viewRegister,
  viewLogin,
} from "../controllers/sessions.controller.js";

const sessionsRouter = Router();

sessionsRouter.post("/register", (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res
        .status(400)
        .json({ error: info?.message || "Registro fallido" });

    req.user = user;
    return register(req, res);
  })(req, res, next);
});

sessionsRouter.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ error: info?.message || "Login fallido" });

    req.user = user;
    return login(req, res);
  })(req, res, next);
});

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/api/sessions/login" }),
  githubLogin
);
sessionsRouter.get("/current", passport.authenticate("jwt"), (req, res) =>
  res.status(200).send(req.user)
);
sessionsRouter.get("/viewregister", viewRegister);
sessionsRouter.get("/viewlogin", viewLogin);

export default sessionsRouter;
