import { app } from "./app.js";
import connectDB from "../db/index.js";
import dotenv from "dotenv";

dotenv.config({ path: "./env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`app listening at ${process.env.PORT || 8000}`);
    });

    // Fix: Correct syntax for adding an error event listener
    app.on("error", (error) => {
      console.log("ERROR:", error);
      throw error;
    });
  })
  .catch((error) => console.error("DB connection error:", error));
