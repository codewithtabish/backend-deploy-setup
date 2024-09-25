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
    cb(null, "uploads/"); // Set the upload folder
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

// File filter to only accept Word documents
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedFileTypes = /doc|docx/;
  const isExtValid = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isMimeTypeValid = allowedFileTypes.test(file.mimetype);

  if (isExtValid && isMimeTypeValid) {
    cb(null, true);
  } else {
    cb(new Error("Only .doc and .docx files are allowed!"));
  }
};

// Configure multer for plagiarism file upload handling
const plagiarismUpload = multer({
  storage,
  limits: { fileSize: 300 * 1024 * 1024 }, // Limit file size to 300MB
  fileFilter,
});

export default plagiarismUpload;
