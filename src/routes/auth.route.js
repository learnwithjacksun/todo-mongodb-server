import express from "express"
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js"
import checkAuth from "../middlewares/checkAuth.js"

const authRoutes = express.Router()

authRoutes.post("/register", registerUser)
authRoutes.post("/login", loginUser)
authRoutes.post("/logout", logoutUser)
authRoutes.get("/me", checkAuth, (req, res) => {
    res.status(200).json({ user: req.user });
  });
export default authRoutes