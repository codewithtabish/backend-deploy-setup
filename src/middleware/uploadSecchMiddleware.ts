import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

// Define storage and file destination
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "uploads/audio"); // Set the upload folder for audio files
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
    cb(null, fileName); // Create unique file name
  },
});

// Remove file type restrictions
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  console.log("Uploaded file name:", file.originalname); // Log the uploaded file name
  console.log("Uploaded file mime type:", file.mimetype); // Log the MIME type

  // Allow any file type
  cb(null, true);
};

// Configure multer for file upload handling
const speechUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 100MB
  fileFilter,
});

export default speechUpload;
