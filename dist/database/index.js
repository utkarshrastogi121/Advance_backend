"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DB_URI = process.env.DB_URI;
if (!DB_URI) {
    throw new Error("DB_URI environment variable is not defined");
}
mongoose_1.default
    .connect(DB_URI)
    .then(() => "MongoDB Connected")
    .catch(err => console.log(err));
