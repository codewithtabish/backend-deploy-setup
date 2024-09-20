import express from "express";
import userController from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/", userController.getAllUser);
userRouter.post("/create", userController.createUser);

export default userRouter;
