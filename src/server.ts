import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import userRouter from "./routes/userRouter";
import { errorMiddleware } from "./middleware/errorMiddleware";
import cors from "cors";
import { videoRouter } from "./routes/videoRouter";
import fileRouter from "./routes/fileRouter";
import imageRouter from "./routes/imageRouter";
import speechRouter from "./routes/speechRouter";
import qrRouter from "./routes/qrRouter";
import sentimentRouter from "./routes/sentimentRouter";

// Load environment variables from .env file
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 19000;

// Middleware
app.use(express.json());
app.use(express.json());
app.use(cors());

app.use(express.json({ limit: "100mb" })); // Increase if needed
app.use(express.urlencoded({ limit: "100mb", extended: true })); // Increase if needed

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the TypeScript Node.js server!");
});

app.use("/api/v1/users", userRouter);
// get all info about
app.use("/api/v1/video", videoRouter);

app.use("/api/v1/file", fileRouter);

app.use("/api/v1/aiimage", imageRouter);

app.use("/api/v1/speech", speechRouter);

app.use("/api/v1/qr", qrRouter);

app.use("/api/v1/sentiment", sentimentRouter);

app.use(errorMiddleware);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
