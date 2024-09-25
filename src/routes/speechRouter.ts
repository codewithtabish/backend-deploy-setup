import express from "express";
import speechUpload from "../middleware/uploadSecchMiddleware";
import speechCtr from "../controller/speechCtr";

const speechRouter = express.Router();

speechRouter.post(
  "/upload-audio",
  speechUpload.single("audio"), // Ensure the field name matches your frontend
  speechCtr.handleAudioUploadAndTranscribe
);

export default speechRouter;
