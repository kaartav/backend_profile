import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/model.js";
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    //can use req.cookies as we added cookie parder in app.js
    //and we can accesss access token as we added in user.controllers.js
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    ); //why only _id as in user.models in the method we wrote ,used _id
    if (!user) {
      throw new ApiError(400, "Invalid Acess Token");
    }
    req.user = user; //we are updating the instance that we got from the user by middleware(user se server)
    //we removed password and refresh token from this as we are only authenticating here,and we need those only to check or register
    next();
  } catch (error) {
    throw new ApiError(401, error?.message, "Invalid Acess Token");
  }
});
