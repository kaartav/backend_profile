// import mongoose, { mongo } from "mongoose";
// const app = express();
// import express from "express";

import connectDB from "../db/index.js";

connectDB()
  .then(() => {
    app.listein(process.env.PORT || 8000, () => {
      console.log(`app listeining at ${process.env.PORT}`);
    });
    app.on(
      ("errror",
      (error) => {
        console.log("ERRR:", error);
        throw error;
      })
    );
  })
  .catch(console.error("DB connection error"));
