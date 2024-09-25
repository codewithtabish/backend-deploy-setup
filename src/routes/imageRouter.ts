import express from "express";
import imageCtr from "../controller/imageCtr";

const imageRouter = express.Router();

imageRouter.post("/generate", imageCtr.generateAnImage);

export default imageRouter;
