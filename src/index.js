import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import todoRouter from "./routes/todo.route.js";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
dotenv.config();


// app cofiguration
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, // <--- ADD THIS
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// db connection
connectDB();

// endpoints
app.use("/api/auth", authRoutes)
app.use("/api/todos", todoRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})