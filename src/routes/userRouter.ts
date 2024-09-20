import express from "express";
import userController from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/", userController.getAllUser);

export default userRouter;
