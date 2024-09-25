import express from "express";
import qrCtr from "../controller/qrCtr";

const qrRouter = express.Router();

qrRouter.post("/create", qrCtr.generateQRCode);

export default qrRouter;
