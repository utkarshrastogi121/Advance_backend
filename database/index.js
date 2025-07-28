import mongoose from "mongoose"
import { db } from "../config.js"
import dotenv from 'dotenv';
dotenv.config();


const dbURI = process.env.DB_URI;

mongoose
  .connect(dbURI)
  .then(() => "MongoDB Connected")
  .catch(err => console.log(err))
