import { NextFunction, Request, Response } from "express";
import QRCode from "qrcode";

const generateQRCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { data } = req.body;
  console.log("YES I AM HERE ");

  if (!data) {
    return res.status(400).json({ error: "No data provided" });
  }

  try {
    const qrCodeUrl = await QRCode.toDataURL(data);
    return res.json({ qrCodeUrl });
  } catch (error) {
    next(error);
  }
};

export default { generateQRCode };
