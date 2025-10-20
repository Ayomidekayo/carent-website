import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // ✅ keeps file in memory as buffer
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
