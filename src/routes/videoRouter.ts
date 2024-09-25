import express from "express";
import videoController from "../controller/videoController";

export const videoRouter = express.Router();

videoRouter.post("/videoinfo", videoController.getVideoInfoCtr);

videoRouter.get("/download", videoController.downloadVideoCtr);

videoRouter.post("/keywords", videoController.getAllKeywords);
