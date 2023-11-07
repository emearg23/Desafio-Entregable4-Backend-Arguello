import express from 'express';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import http from 'http';
import { Server } from 'socket.io';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'), 
}));

app.set("view engine", "handlebars");

const productsDB = [];

app.use(express.static("data"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { products: productsDB });
});

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("newProduct", (newProduct) => {
    productsDB.push(newProduct);
    io.emit("productCreated", newProduct);
  });

  socket.on("deleteProduct", (productId) => {
    const index = productsDB.findIndex((product) => product.id === productId);
    if (index !== -1) {
      productsDB.splice(index, 1);
      io.emit("productDeleted", productId);
    }
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor web y websocket en el puerto ${PORT}`);
});