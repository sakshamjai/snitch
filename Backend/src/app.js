import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import router from './routes/auth.routes.js';
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/', (req,res) => {
    res.send("Hello World!");
})
app.use('/api/auth', router);
export default app;