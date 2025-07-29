import mongoose from "mongoose"
import { db } from "../config"
import dotenv from 'dotenv';
dotenv.config();


const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  throw new Error("DB_URI environment variable is not defined");
}

mongoose
  .connect(DB_URI)
  .then(() => "MongoDB Connected")
  .catch(err => console.log(err))
