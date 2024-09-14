import { Injectable } from '@nestjs/common';
import cloudinary, {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2,
} from 'cloudinary';
import toStream = require('buffer-to-stream');

// cloudinary.v2.config({
//   cloud_name: process.env.CLD_CLOUD_NAME,
//   api_key: process.env.CLD_API_KEY,
//   api_secret: process.env.CLD_API_SECRET,
// });

@Injectable()
export class CloudinaryService {
  async uploadImages(
    files: Express.Multer.File[],
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    console.log(files);
    const uploadPromises = files.map((file) => {
      return new Promise<UploadApiResponse | UploadApiErrorResponse>(
        (resolve, reject) => {
          const upload = v2.uploader.upload_stream((error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
          toStream(file.buffer).pipe(upload);
        },
      );
    });

    return Promise.all(uploadPromises);
  }

  async uploadZip(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'raw' }, // Specify raw to handle non-image files like zip
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
