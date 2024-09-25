import { NextFunction, Request, Response } from "express";
import { SpeechClient, protos } from "@google-cloud/speech";
import fs from "fs";
import path from "path";

// Initialize the Google Cloud Speech client
const speechClient = new SpeechClient();

// Controller to handle audio file upload and transcription
const handleAudioUploadAndTranscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if the file is uploaded
    if (!req.file) {
      res.status(400).json({ error: "No audio file uploaded" });
      return;
    }

    // Get the file details
    const { originalname, path: filePath, filename } = req.file;

    // Read the audio file content
    const audioBytes = fs.readFileSync(filePath).toString("base64");

    // Configure the request for Google Cloud Speech-to-Text API
    const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
      audio: { content: audioBytes },
      config: {
        encoding: "LINEAR16", // Modify this based on the actual audio format (e.g., "MP3" for mp3 files)
        sampleRateHertz: 16000, // Adjust this according to the actual sample rate of your audio
        languageCode: "en-US", // Specify your language code
      },
    };

    // Send the request to the Google Cloud Speech-to-Text API
    const [response] = await speechClient.recognize(request);

    // Extract the transcription result
    const transcription = response.results
      ?.map((result) => result.alternatives?.[0].transcript)
      .join("\n");

    // Send the response with the file and transcription data
    res.json({
      message: "Audio file uploaded and transcribed successfully",
      fileInfo: {
        originalFilename: originalname,
        uploadedPath: path.basename(filePath), // Return only the filename, not the full path
        storedFilename: filename,
      },
      transcription: transcription || "No transcription available",
    });
  } catch (error: any) {
    console.error("Error during audio upload or transcription:", error);
    next(error);
    // res
    //   .status(500)
    //   .json({ error: "Error processing audio file", details: error });
  }
};

export default {
  handleAudioUploadAndTranscribe,
};
