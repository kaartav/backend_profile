import { asyncHandler } from "../utils/asyncHandler.js";
const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "This page is for users to send register request ie POST",
  });
});
export { registerUser };
