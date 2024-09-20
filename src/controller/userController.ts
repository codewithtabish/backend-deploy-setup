import axios from "axios";
import { Request, Response } from "express";

const getAllUser = async (req: Request, response: Response) => {
  const data = await axios.get("https://jsonplaceholder.typicode.com/users");
  return response.status(200).json({
    status: true,
    message: "All users are here ",
    code: 200,
    users: data?.data,
  });
};

export default { getAllUser };
