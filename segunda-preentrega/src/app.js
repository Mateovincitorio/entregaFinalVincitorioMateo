import express from 'express';
import path from 'path';
import productsRoutes from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import viewsRoutes from './routes/views.router.js';
import mongoose from 'mongoose';
import usersRouter from './routes/users.routes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import sessionsRouter from './routes/sessions.routs.js';
import passport from 'passport';
import initializatePassword from './config/passport.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser("firmaSecreta"));

const PORT = 8080;

// Definir el servidor de WebSockets
const httpServer = app.listen(PORT, () => {
    console.log(`escuchando en el puerto ${PORT}`);
});
const io = new Server(httpServer);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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

// Inicializar Passport
initializatePassword();
app.use(passport.initialize());
app.use(passport.session());

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
    res.status(404).send("Not found")
})


// Configuración de Handlebars
const runtimeOptions = {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
};
app.engine("handlebars", handlebars.engine({ 
    runtimeOptions,
    defaultLayout: false, // Si no usas un layout principal
    partialsDir: "./src/views/partials" // Define la carpeta de partials
}));

app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

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
