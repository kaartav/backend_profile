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
    profilePicLocalPath = "public/temp/default.png";
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

const generateAccessTokensAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessTokens();
    const refreshToken = user.generateRefershTokens();

    // this will save the user's refresh token in database for further verification,,no validation password will be there at this point for the user
    user.refreshToken = refreshToken; // adding the value to the instance
    await user.save({ validateBeforeSave: false }); // saving to database

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Access or Refresh token could not be generated");
  }
};

const loginUser = asyncHandler(async (req, res) => {
  //req.body -> data
  //search in database by user name
  //if not there tell to register
  //if yes check password
  //wrong password try again
  //right password generate and give access and refresh tokens
  //send secure cookies and tell login succcesful
  const { email, username, password } = req.body;
  console.log(email, username);

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  //User is for mongodb ,user is the instance that we got now by [const user = await User.findOne] and the methods like is password correct are all in the instance only

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const { accessToken, refreshToken } =
    await generateAccessTokensAndRefereshToken(user._id);
  const loggedInUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

export { loginUser };

const logoutUser = asyncHandler(async (req, res) => {
  // const { username } = req.body;
  // const user = await User.findOne(username);
  // generateAccessTokensAndRefereshToken(user._id);
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearcookie("accessToken", options)
    .clearcookie("refreshToken", options)
    .json(new ApiResponse(200, "user logged out"));
});
export { logoutUser };
