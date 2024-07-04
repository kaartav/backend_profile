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
  console.log(req.body);
  if (
    [username, specialization, location, password, email].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "Use other username or email");
  }
  console.log("\n", existedUser);
  console.log("\n", req.files);
  const profilePicLocalPath = req.files?.profilePic[0]?.path;
  if (!profilePicLocalPath) {
    profilePicLocalPath = "public/defaultPic.png";
  }

  const profilePic = await uploadOnCloudinary(profilePicLocalPath);
  if (!profilePic) {
    throw new ApiError(409, "There is no profile picture");
  }

  if (specialization === "") {
    specialization = "None";
  }
  if (location === "") {
    location = "None";
  }

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
