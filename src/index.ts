import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// ROUTER IMPORTS
import auth from './routes/auth';

// Set Environmental Vars
dotenv.config()

const app = express();
const port = process.env.PORT; // default port to listen

// Middleware
app.use(express.json())
   .use(express.urlencoded({ extended: true }))
   .use(cors())
   .use(cookieParser());

// Routes
app.use('/auth', auth);

mongoose.connect(process.env.DB_CONNECT_STRING);

app.listen(port);
