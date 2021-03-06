import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoute from './routes/userRoute.js';
import billsRoute from './routes/billsRoute.js';
import productRoute from './routes/productRoutes.js';

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use('/api/users', userRoute);
app.use('/api/bills', billsRoute);
app.use('/api/products', productRoute);

if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
}

const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
   app.use(express.static(path.join(__dirname, '/client/build')));

   app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
   );
} else {
   app.get('/', (req, res) => {
      res.send('API is running....');
   });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
   PORT,
   console.log(`Server in ${process.env.NODE_ENV} mode on ${PORT}`)
);
