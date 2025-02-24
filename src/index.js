import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import passport from "passport";
import configurePassport from "./config/passport.config.js";
import connectDb from "./config/database.js";
import sessionRoutes from "./routes/session.routes.js";
import userRoutes from './routes/users.routes.js'
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import ticketRoutes from './routes/ticket.routes.js';


const app = express();
dotenv.config();


//settings
const PORT = process.env.PORT || 3000;



// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//passport
configurePassport(passport); 
app.use(passport.initialize());



//routes
app.get("/", (req, res) => {
  res.json({ title: "Home Page" });
});
app.use('/',userRoutes)
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/tickets', ticketRoutes);


//listeners
connectDb(process.env.MONGODB_URL);
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
