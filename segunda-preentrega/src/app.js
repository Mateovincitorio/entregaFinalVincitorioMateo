import express from 'express';
import path from 'path';
import dotenv from 'dotenv'; // Importa dotenv
import productsRoutes from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { Server } from 'socket.io';
import { create } from 'express-handlebars';
import viewsRoutes from './routes/views.router.js';
import mongoose from 'mongoose';
import usersRouter from './routes/users.routes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import sessionsRouter from './routes/sessions.routs.js';
import passport from 'passport';
import initializatePassword from './config/passport.js';
import cookieParser from 'cookie-parser';
import __dirname from './path.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));

const PORT = process.env.PORT;
const hbs = create();

// Definir el servidor de WebSockets
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});
const io = new Server(httpServer);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 60
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

// Inicializar Passport
initializatePassword();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO Middleware
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rutas
app.use('/', viewsRoutes);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRoutes);
app.use('*', (req, res) => {
    res.status(404).send("Ruta no encontrada");
});

// Conexión a la base de datos
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Base de datos conectada");
    } catch (error) {
        console.error("Error al conectar la base de datos", error);
    }
};
connectDb();

// Socket.IO Evento de conexión
io.on('connection', (socket) => {
    console.log("Nuevo cliente conectado");
});
