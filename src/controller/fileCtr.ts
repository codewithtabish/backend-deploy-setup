import { NextFunction, Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";
import fs from "fs"; // Import fs module

const handleWordFileCtr = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname, path: filePath } = req.file;
    const outputPdf = path.join(
      "uploads",
      `${path.parse(originalname).name}.pdf`
    );

    // Use spawn to execute the Python script
    const pythonProcess = spawn("python", [
      path.join(__dirname, "./convert_to_pdf.py"),
      filePath,
      outputPdf,
    ]);

    let output = "";
    let errorOutput = "";

    // Capture standard output from the Python script
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    // Capture standard error from the Python script
    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    // Handle process exit
    pythonProcess.on("close", (code) => {
      if (code === 0) {
        // Prepare the response data with original file path
        const responseData = {
          message: "File uploaded and converted to PDF successfully",
          fileInfo: {
            originalFilename: originalname,
            uploadedPath: path.basename(filePath), // Change here to get only the filename
            convertedPdfPath: outputPdf,
            convertedPdfFilename: path.basename(outputPdf), // Just the filename
          },
        };

        // Send the response with the PDF download link
        res.json(responseData);
      } else {
        console.error("Conversion error:", errorOutput);
        return res
          .status(500)
          .json({ error: "File conversion failed", details: errorOutput });
      }
    });
  } catch (error) {
    // console.error("Error handling file:", error);
    // return res.status(500).json({ error: "Error processing file" });
    next(error);
  }
};

// Handle PDF download
const downloadPdf = (req: Request, res: Response, next: NextFunction) => {
  const { filename, originalPath } = req.query;

  if (!filename || !originalPath) {
    return res
      .status(400)
      .json({ error: "Filename and originalPath are required" });
  }

  try {
    const pdfFilePath = path.join(
      __dirname,
      "../../uploads",
      filename as string
    ); // Path to PDF
    const docFilePath = path.join(
      __dirname,
      "../../uploads",
      originalPath as string // Path to original Word file
    );

    res.download(pdfFilePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        return res.status(500).json({ error: "Error downloading file" });
      } else {
        // Delete both files after the PDF has been downloaded
        fs.unlink(pdfFilePath, (err) => {
          if (err) console.error("Error deleting PDF file:", err);
        });
        fs.unlink(docFilePath, (err) => {
          if (err) console.error("Error deleting Word file:", err);
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  handleWordFileCtr,
  downloadPdf,
};
