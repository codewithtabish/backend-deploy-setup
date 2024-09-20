import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { db } from "../config/db";
import { Users } from "../models";

const getAllUser = async (req: Request, response: Response) => {
  const data = await db.select().from(Users);

  return response.status(200).json({
    status: true,
    message: "All users are here ",
    code: 200,
    users: data,
  });
};

const createUser = async (
  req: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name, age } = await req.body;
    console.log("This is one the best ");
    const dbResponse = await db
      .insert(Users)
      .values({
        name: name,
        age: age,
      })
      .returning({
        id: Users?.id,
      });

    return response.status(200).json({
      status: true,
      message: "User created successfully",
      data: dbResponse,
    });
  } catch (error) {
    next(error);
  }
};

export default { getAllUser, createUser };
