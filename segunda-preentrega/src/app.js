import express from 'express';
import path from 'path';
import productsRoutes from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { Server } from 'socket.io';
import { create } from 'express-handlebars'//Asi importamos handlebars
import viewsRoutes from './routes/views.router.js';
import mongoose from 'mongoose';
import usersRouter from './routes/users.routes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import sessionsRouter from './routes/sessions.routs.js';
import passport from 'passport';
import initializatePassword from './config/passport.js';
import cookieParser from 'cookie-parser';
import __dirname from './path.js'

const app = express();
app.use(cookieParser("firmaSecreta"));

const PORT = 8080;
const hbs = create()

// Definir el servidor de WebSockets
const httpServer = app.listen(PORT, () => {
    console.log(`escuchando en el puerto ${PORT}`);
});
const io = new Server(httpServer);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://mateovincitorio:matu%402004@codercluster.nt5mm.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=coderCluster',
        ttl: 60
    }),
    secret: "sesionSecreta",
    resave: true,
    saveUninitialized: true
}));

//Junte todos los middlewares. Es mejor tenerlos antes que las rutas, ahora creo que no hay conflicto pero es algo que puede traer problemas por el orden de ejecucion.
// Inicializar Passport
initializatePassword();
app.use(passport.initialize());
app.use(passport.session());
app.engine("handlebars", hbs.engine)//Aca cambie la forma de aplicar el engine.
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))//Tenias declarado la ruta static public 2 veces, quedate con esta

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
app.use('*',(req,res)=>{
    res.status(404).send("ruta no encontrada")
})



// Conexión a la base de datos
const connectDb = () => {
    console.log("Base de datos conectada");
    mongoose.connect('mongodb+srv://mateovincitorio:matu%402004@codercluster.nt5mm.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=coderCluster');
};
connectDb();

// Socket.IO Evento de conexión
io.on('connection', (socket) => {
    console.log("Nuevo cliente conectado");
});
