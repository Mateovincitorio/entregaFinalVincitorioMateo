import express from 'express'
import productsRoutes from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { Server } from 'socket.io';
import handlebars from'express-handlebars'
import viewsRoutes from './routes/views.router.js';
import mongoose from 'mongoose';
import usersRouter from './routes/users.routes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import FileStore from 'session-file-store'
import sessionsRouter from './routes/sessions.routs.js';
import passport from 'passport';
import initializatePassword from './config/passport.js';


const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use('/',viewsRoutes);
//app.use('/',indexRouter)
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(session({
  store:MongoStore.create({
    mongoUrl:'mongodb+srv://mateovincitorio:matu%402004@codercluster.nt5mm.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=coderCluster',
    ttl:60
  }),
  secret:"sesionSecreta",
  resave:true,
  saveUninitialized:true
}))


const runtimeOptions = {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  };
  
  app.engine(
    "handlebars",
    handlebars.engine({
      runtimeOptions,
    })
  );
  app.set("view engine", "handlebars");
  app.set("views", "./src/views");



const connectDb = () =>{
    console.log("base de datos conectadas");
    mongoose.connect('mongodb+srv://mateovincitorio:matu%402004@codercluster.nt5mm.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=coderCluster');
}

connectDb()

initializatePassword()
app.use(passport.initialize())
app.use(passport.session())


const httpServer = app.listen(PORT,()=>{
    console.log(`escuchando en el puerto ${PORT}`);  
})

const io = new Server(httpServer)




io.on('connection', (socket) =>{
    console.log("nuevo cliente conectado");
})

