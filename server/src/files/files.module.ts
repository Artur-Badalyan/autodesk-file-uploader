import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { BucketsController } from './files.controller';
import { ListBucketObjectsHandler } from './queries/files.handler';
import { ConvertFileCommandHandler, UploadFileCommandHandler } from './command/files.handler';
import { ForgeService } from '../services/index';

const handlers = [ListBucketObjectsHandler, UploadFileCommandHandler, ConvertFileCommandHandler];

@Module({
  imports: [CqrsModule],
  controllers: [BucketsController],
  providers: [
    ForgeService,
    ...handlers,
  ],
})
export class FilesModule {}
