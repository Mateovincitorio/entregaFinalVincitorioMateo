import express from 'express'
import productsRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';
import { Server } from 'socket.io';
import handlebars from'express-handlebars'
import viewsRoutes from './routes/views.router.js';
import mongoose from 'mongoose';


const app = express();
const PORT = 8080;
app.use(express.json())
app.use(express.urlencoded({extended:true}))
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
app.use(express.static('public'))
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartRoutes);
app.use('/',viewsRoutes);

const connectDb = () =>{
    console.log("base de datos conectadas");
    mongoose.connect('mongodb+srv://mateovincitorio:matu%402004@codercluster.nt5mm.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=coderCluster');
}

connectDb()


const httpServer = app.listen(PORT,()=>{
    console.log(`escuchando en el puerto ${PORT}`);  
})

const io = new Server(httpServer)

app.use((req, res, next) => {
    req.io = io;
    next();
  });
  
app.use("/api/products", viewsRoutes);


io.on('connection', (socket) =>{
    console.log("nuevo cliente conectado");
})