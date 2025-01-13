import express from 'express'
import productsRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';
import { Server } from 'socket.io';
import handlebars from'express-handlebars'
import viewsRoutes from './routes/views.router.js';

const app = express();
const PORT = 8080;
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartRoutes);
app.engine('handlebars',handlebars.engine())
app.set('views','src/views')
app.set('view engine', 'handlebars')
app.use('/',viewsRoutes);




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