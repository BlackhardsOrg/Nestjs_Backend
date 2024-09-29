import { Module } from '@nestjs/common';

import { UploadsController } from 'src/controllers/uploads/uploads.controller';
import { CloudinaryProvider } from 'src/providers/services/cloudinary.provider';
import { UploadsService } from 'src/providers/services/uploads.service';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: Transaction.name, schema: TransactionSchema },
    // ]),
  ],
  controllers: [UploadsController],
  providers: [UploadsService, CloudinaryProvider],
  exports: [CloudinaryProvider],
})
export class UploadsModule {}
