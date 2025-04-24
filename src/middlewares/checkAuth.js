import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const checkAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, token missing", isAuth: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, invalid token", isAuth: false });
    }

    req.user = user; // Attach user to request
    next(); // Go to the next middleware/route
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Not authorized, token verification failed", isAuth: false });
  }
};

export default checkAuth;
