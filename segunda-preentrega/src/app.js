import "./helpers/env.js";
import express from "express";
import path from "path";
import cluster from "cluster";
import { cpus } from "os";
import { serve, setup } from "swagger-ui-express";
import swaggerSpecs from "./helpers/swagger.helper.js";
import productsRoutes from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import { Server } from "socket.io";
import { create } from "express-handlebars";
import viewsRoutes from "./routes/views.router.js";
import mongoose from "mongoose";
import usersRouter from "./routes/users.routes.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import sessionsRouter from "./routes/sessions.routs.js";
import passport from "passport";
import initializatePassword from "./config/passport.js";
import cookieParser from "cookie-parser";
import __dirname from "./path.js";
import dbConnect from "./helpers/dbConnect.js";
import arg from "./helpers/arg.helper.js";
import mockRouter from "./routes/mocks/mocksRouter.js";
import logger from "./config/logger.config.js";
import winstonMid from "./middlewars/wingston.mid.js";

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));

const PORT = process.env.PORT || 8080;
//const hbs = create();
import exphbs from "express-handlebars";

const hbs = exphbs.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true, // Permite acceder a las propiedades heredadas
    allowProtoMethodsByDefault: true, // Permite acceder a los métodos heredados
  },
});

app.engine("handlebars", hbs.engine);

const isPrimary = cluster.isPrimary;
if (isPrimary) {
  logger.INFO(cluster.isPrimary);

  //si estoy en un proceso primario, voy a crear los workers(hijos)

  const procesadores = cpus().length;
  for (let i = 1; i <= procesadores; i++) {
    cluster.fork();
  }
} else {
  const httpServer = app.listen(PORT, () => {
    logger.INFO(
      `Escuchando en el puerto ${PORT} and mode ${arg.mode} and PID ${process.pid}`
    );
  });
  const io = new Server(httpServer);

  // Socket.IO Middleware
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Evento conexión de cliente
  io.on("connection", (socket) => {
    logger.INFO("Nuevo cliente conectado");
  });
  // Socket.IO Middleware
  app.use((req, res, next) => {
    req.io = io;
    next();
  });
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(winstonMid);
app.use("/api/docs", serve, setup(swaggerSpecs));

// Session Middleware
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 60,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Inicializar Passport
initializatePassword();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use("/", viewsRoutes);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRoutes);
app.use("/api/mock", mockRouter);
app.use("*", (req, res) => {
  res.status(404).send("Ruta no encontrada");
});

dbConnect(process.env.MONGO_URI);
