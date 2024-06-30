import { DB_NAME } from "../src/constants.js";

const connection = mongoose.connection;

import dotenv from "dotenv";
dotenv.config({ path: "./env" });

import mongoose, { mongo } from "mongoose";
const connectDB = async () => {
  try {
    const uri = `${process.env.MONGODB_URL}/${process.env.DB_NAME}`;

    await mongoose.connect(uri);
    console.log(`\n Mongo db connected ,, DB host : ${connection.host}`);
  } catch (error) {
    console.error("DB ERROR ", error);
    process.exit(1);
  }
};
export default connectDB;
