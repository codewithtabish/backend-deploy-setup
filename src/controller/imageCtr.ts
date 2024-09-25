import { NextFunction, Request, Response } from "express";
import Replicate from "replicate";

const generateAnImage = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    });
    const { inputPrompt } = request.body;
    if (!inputPrompt) {
      return response.status(400).json({
        status: false,
        message: "Prompt is required",
        code: 400,
      });
    }
    const input = {
      prompt: inputPrompt || "a photograph of an astronaut riding a horse",
      output_format: "png",
      output_quality: 80,
      aspect_ratio: "1:1",
    };

    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input,
    });
    console.log(output);
    return response.status(200).json({
      status: true,
      message: "Image generated successfully",
      code: 200,
      output: output,
    });
    //=> ["https://replicate.delivery/yhqm/hcDDSNf633zeDUz9sWkKfaf...
  } catch (error) {
    next(error);
  }
};

export default {
  generateAnImage,
};
