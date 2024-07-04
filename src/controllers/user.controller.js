import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  //data from front end
  //validation
  //not repeted user
  //check for image and avatar
  //upload to cloudinary
  //check if uploaded
  //create user object- create entry in db
  //remove password and refersh token from sending response
  //check for user creation
  //return conformation(response)
  const { username, specialization, location, password, email } = req.body;

  if (username === "") {
    throw new ApiError(400, "Username is required");
  }
  if (password === "") {
    throw new ApiError(400, "password is required");
  }
  if (email === "") {
    throw new ApiError(400, "email is required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "Use other username or email");
  }
  // console.log("\n", existedUser);
  // console.log("\n", req.files);

  let profilePicLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.profilePic) &&
    req.files.profilePic.length > 0
  ) {
    profilePicLocalPath = req.files?.profilePic[0].path;
  } else {
    profilePicLocalPath = "public/defaut.png";
    // console.log("\n", "local path is found by default");
  }

  const profilePic = await uploadOnCloudinary(profilePicLocalPath);

  const userrrr = await User.create({
    username: username.toLowerCase(),
    email,
    specialization,
    location,
    profile_pic: profilePic.url,
    password,
  });
  const createdUser = await User.findById(userrrr._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while uploading to database");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered succesfully"));
});

export { registerUser };
