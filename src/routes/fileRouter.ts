import express from "express";
import fileCtr from "../controller/fileCtr";
import upload from "../middleware/uploadMiddleware";

const fileRouter = express.Router();

fileRouter.post(
  "/uploadFile",
  upload.single("file"),
  fileCtr.handleWordFileCtr
);

fileRouter.get("/download", fileCtr.downloadPdf); // New download route

export default fileRouter;
