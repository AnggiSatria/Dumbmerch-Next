import { mkdirSync, existsSync } from "fs";
import { IncomingForm } from "formidable";
import path from "path";
import { writeFile } from 'fs/promises';

// Disable Next.js body parser
export const config = {
  api: {
    bodyParser: false, // Nonaktifkan bodyParser Next.js
  },
};

// Fungsi untuk memparse form data
export async function parseForm(req) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir, // Tentukan direktori upload
    keepExtensions: true, // Simpan ekstensi file
    maxFileSize: 10 * 1024 * 1024, // Maksimal 10 MB per file
    filename: (name, ext, part) => {
      // Tentukan format nama file
      return Date.now() + "-" + part.originalFilename.replace(/\s/g, "");
    },
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err); // Jika ada error, reject
      }
      resolve({ fields, files }); // Resolusi dengan fields dan files
    });
  });
}



export async function saveFile(buffer, filename) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  // Pastikan folder uploads sudah ada
  await writeFile(path.join(uploadDir, filename), buffer);
}