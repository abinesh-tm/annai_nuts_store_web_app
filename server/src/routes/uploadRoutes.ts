import express, { Request, Response } from "express";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/base64", protect, admin, (req: Request, res: Response) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({
      success: false,
      message: "Image Base64 is required",
    });
  }

  // Directly return Base64 string
  return res.json({
    success: true,
    url: imageBase64,
  });
});

export default router;

