import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: "./env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) {
      console.log("File not found");
      return null;
    }
    //upload on cloudinary
    const response = cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    console.log("File is uploaded on cloudinary", (await response).url);
    fs.unlinkSync(localfilepath);
    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath); //as the upload as failed and we dont want to keep any thing on our temporary local server
    return null;
  }
};
export { uploadOnCloudinary };
