// app/api/upload-slide/route.ts
import { NextRequest, NextResponse } from 'next/server';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export async function POST(req: NextRequest) {
  try {
    // Use multer to handle the file upload
    await new Promise((resolve, reject) => {
      upload.single('file')(req as any, {} as any, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      });
    });

    // Respond with the uploaded file details
    return NextResponse.json({ message: 'File uploaded successfully', file: req.file });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to upload file', error: error.message }, { status: 500 });
  }
}