import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import userRouter from "./routes/userRouter";

// Load environment variables from .env file
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the TypeScript Node.js server!");
});

// Basic route
app.get("/blogs", (req: Request, res: Response) => {
  res.send("Hello from the and the blogs app!");
});
// Basic route
app.get("/posts", async (req: Request, res: Response) => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return res.status(200).json({
    status: true,
    posts: response?.data,
  });
});

app.use("/api/v1/users", userRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
