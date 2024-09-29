import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { UploadsService } from 'src/providers/services/uploads.service';
const multerOptions: MulterOptions = {
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
};

@Controller('uploads')
export class UploadsController {
  constructor(private readonly cloudinaryService: UploadsService) {}

  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 10)) // 'files' should match the field name used in the frontend; 10 is the maximum number of files
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return this.cloudinaryService.uploadImages(files);
  }

  @Post('game/file')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadZip(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadZip(file);
  }
}
