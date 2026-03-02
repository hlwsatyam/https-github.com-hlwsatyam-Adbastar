import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") {
      cb(null, "uploads/thumbnails");
    } else if (file.fieldname === "video") {
      cb(null, "uploads/videos");
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.fieldname === "thumbnail") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed for thumbnails"), false);
    }
  } else if (file.fieldname === "video") {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only videos are allowed for course content"), false);
    }
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

export default upload;
