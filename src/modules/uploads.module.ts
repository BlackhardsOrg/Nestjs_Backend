import { Module } from '@nestjs/common';

import { UploadsController } from 'src/controllers/uploads/uploads.controller';
import { CloudinaryProvider } from 'src/providers/services/cloudinary.provider';

import { CloudinaryService } from 'src/providers/services/cloudinary.service';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: Transaction.name, schema: TransactionSchema },
    // ]),
  ],
  controllers: [UploadsController],
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class UploadsModule {}
