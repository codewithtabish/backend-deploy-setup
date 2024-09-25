import { NextFunction, Request, Response } from "express";
import { spawn } from "child_process";
import { error } from "console";

// Define the type for the request body
interface SentimentRequest extends Request {
  body: {
    text: string;
  };
}

export const analyzeSentiment = (
  req: SentimentRequest,
  res: Response,
  next: NextFunction
): void => {
  const text = req.body.text;

  if (!text) {
    res.status(400).json({ error: "No text provided" });
    return;
  }

  // Spawn a new Python process
  try {
    const pythonProcess = spawn("python", ["sentiment_model.py"]);

    // Send the text data to the Python script via stdin
    pythonProcess.stdin.write(JSON.stringify({ text }));
    pythonProcess.stdin.end();

    // Capture the output from the Python script
    pythonProcess.stdout.on("data", (data: Buffer) => {
      try {
        const result = JSON.parse(data.toString());
        res.json(result);
      } catch (error) {
        console.error("Error parsing Python output:", error);
        res.status(500).json({
          error:
            "An error occurred while processing the sentiment analysis result.",
        });
      }
    });

    // Handle errors from the Python script
    pythonProcess.stderr.on("data", (data: Buffer) => {
      console.error(`Python script error: ${data.toString()}`);
      res
        .status(500)
        .json({ error: "An error occurred while running the Python script." });
    });
  } catch (error) {
    next(error);
  }
};

export default { analyzeSentiment };
