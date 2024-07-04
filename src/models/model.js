import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: "./env" });

// User Schema
const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_pic: {
      type: String, // cloudinary url
      required: true,
    },
    specialization: { type: String, required: true, default: "None" },
    location: { type: String, required: true, default: "None" },
    refreshToken: String,
  },
  { timestamps: true }
);

//.pre is before and save is just before saving apply this function ..as encription takes a lot of cpu and timr so async /////this is a middle ware

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}; //returns boolean
UserSchema.methods.generateAccessTokens = function () {
  return jwt.sign({}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};
UserSchema.methods.generateRefershTokens = function () {
  return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};
export const User = mongoose.model("User", UserSchema);

// Blog Schema
const BlogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
});

export const Blog = mongoose.model("Blog", BlogSchema);

// Media Schema
const MediaSchema = new Schema({
  blogId: { type: Schema.Types.ObjectId, ref: "Blog" },
  url: { type: String, required: true },
  type: { type: String, required: true },
});

export const Media = mongoose.model("Media", MediaSchema);

// Comment Schema
const CommentSchema = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  blogId: { type: Schema.Types.ObjectId, ref: "Blog" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Comment = mongoose.model("Comment", CommentSchema);

// Reaction Schema
const ReactionSchema = new Schema({
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  blogId: { type: Schema.Types.ObjectId, ref: "Blog" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Reaction = mongoose.model("Reaction", ReactionSchema);
