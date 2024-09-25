import { Request, Response } from "express";
import ytdl from "ytdl-core";
import { exec } from "child_process";
import { spawn } from "child_process";
import path from "path";
import fs from "fs"; // Import fs module

// import ss from "./pone.py";

const getVideoInfoCtr = async (req: Request, response: Response) => {
  const { videoUrl } = req.body;

  try {
    if (!ytdl.validateURL(videoUrl)) {
      return response.status(400).json({ error: "Invalid video URL" });
    }

    const videoInfo = await ytdl.getInfo(videoUrl);
    const tags = videoInfo?.videoDetails?.keywords;
    console.log(tags);

    // Get all available formats for download
    const formats = videoInfo.formats.map((format) => ({
      quality: format.qualityLabel,
      type: format.container,
      size: format.contentLength,
      url: format.url,
      audio: format.hasAudio,
      video: format.hasVideo,
      itag: format.itag, // Include the itag
    }));

    return response.status(200).json({
      title: videoInfo.videoDetails.title,
      thumbnail: videoInfo.videoDetails.thumbnails[0]?.url,
      formats,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Error fetching video information" });
  }
};
const downloadVideoCtr = async (req: Request, res: Response) => {
  const { videoUrl, itag } = req.query;

  console.log("Received download request:", videoUrl, itag);
  try {
    const response = await ytdl.getURLVideoID(videoUrl as string);
    const videoInfo = await ytdl.getInfo(videoUrl as string);
    const data = {
      url: "https://www.youtube.com/embed/" + response,
      info: videoInfo?.formats,
    };
    return res.send(data);
  } catch (error) {
    console.log("The error here is", error);
  }

  return;

  try {
    if (!videoUrl || !itag) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    if (!ytdl.validateURL(videoUrl as string)) {
      return res.status(400).json({ error: "Invalid video URL" });
    }

    res.header("Content-Disposition", 'attachment; filename="video.mp4"');

    ytdl(videoUrl as string, {
      filter: (format) => format.itag.toString() === itag,
      requestOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        },
      },
    })
      .on("error", (err) => {
        console.error("Error streaming video:", err);
        res.status(500).json({ error: "Error downloading video" });
      })
      .pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Error downloading video" });
  }
};

// Function to get video keywords from Python script
const getVideoKeywords = (videoUrl: any) => {
  return new Promise((resolve, reject) => {
    // const pythonProcess = spawn("python", ["./keywords.py", videoUrl]);
    console.log(__dirname);
    // Use spawn to execute the Python script
    const pythonProcess = spawn("python", [
      path.join(__dirname, "./keywords.py"),
      videoUrl,
    ]);

    let data = "";
    pythonProcess.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    pythonProcess.stderr.on("data", (error) => {
      console.error(`Python error: ${error}`);
      reject(`Error executing Python script: ${error}`);
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const keywords = JSON.parse(data); // Parse the output
          resolve(keywords);
        } catch (error) {
          reject(`Error parsing JSON: ${error}`);
        }
      } else {
        reject(`Python process exited with code: ${code}`);
      }
    });
  });
};

const getAllKeywords = async (req: Request, res: Response) => {
  const { videoUrl } = req.query;
  console.log("here");

  if (!videoUrl) {
    return res.status(400).json({ error: "Missing video URL" });
  }

  try {
    const keywords = await getVideoKeywords(videoUrl);
    return res.json({ keywords }); // Return keywords in the response
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default { getVideoInfoCtr, downloadVideoCtr, getAllKeywords };
