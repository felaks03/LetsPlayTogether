import fs from "fs";
import path from "path";
import multer from "multer";

const uploadsRoot = path.join(process.cwd(), "uploads", "avatars");

if (!fs.existsSync(uploadsRoot)) {
    fs.mkdirSync(uploadsRoot, { recursive: true });
}

const extPorMime: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
};

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsRoot);
    },
    filename: (req, file, cb) => {
        const id = req.params.id as string;
        const ext = extPorMime[file.mimetype] || ".jpg";
        cb(null, `${id}-${Date.now()}${ext}`);
    },
});

export const uploadAvatarMiddleware = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!Object.keys(extPorMime).includes(file.mimetype)) {
            return cb(new Error("Solo imágenes JPG, PNG, WebP o GIF"));
        }
        cb(null, true);
    },
});
