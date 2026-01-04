import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';


//Initalize Express App
const app=express();

//connect to database
await connectDB();
//middleware

const allowedOrigins = [
  "http://localhost:5173",
  "https://carent-website-frontend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

app.get('/', (req,res)=>res.send("Server is running"));

app.use('/api/user',userRouter);
app.use('/api/owner',ownerRouter);
app.use('/api/bookings',bookingRouter)

const PORT=process.env.PORT || 3000;

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))