import {
  hashPassword,
  generateToken,
  comparePassword,
} from "../helpers/auth.helpers.js";
import UserModel from "../models/user.model.js";
import validator from "validator";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exitingUser = await UserModel.findOne({ email });
    if (exitingUser) {
      return res
        .status(400)
        .json({ message: "User with that email already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new UserModel({
      userId: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user, message: "User registered successfully!", token: token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  console.log("Login request received", req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required!" });
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist!" });

    const passwordIsMatch = await comparePassword(password, user.password);
    if (!passwordIsMatch)
      res.status(400).json({ message: "Password is incorrect!" });

    const token = generateToken(user._id);

    // create cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user, message: "Logged in successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const logoutUser = (_req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};

export const checkSession = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token", isAuth: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
    res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
}

export const deleteAccount = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(res.user._id);
    if (!user) return res.status(400).json({ message: "User does not exist!" });
    res.clearCookie("token");
    res.status(200).json({ message: "User account deleted successfully!" });  
  }catch (error) {
    res.status(500).json({ message: "Error deleting user account", error: error.message });
  }
}
