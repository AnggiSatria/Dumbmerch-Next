import { mkdirSync, existsSync } from "fs";
import { IncomingForm } from "formidable";
import path from "path";

// Disable Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function parseForm(req) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    filename: (name, ext, part) => {
      const fileName = Date.now() + "-" + part.originalFilename.replace(/\s/g, "");
      return fileName;
    },
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}
