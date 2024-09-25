// routes/sentiment.ts (in TypeScript)

import { Router } from "express";
import sentimentController from "../controller/sentimentController";

const sentimentRouter = Router();

sentimentRouter.post(
  "/analyze-sentiment",
  sentimentController.analyzeSentiment
);

export default sentimentRouter;
