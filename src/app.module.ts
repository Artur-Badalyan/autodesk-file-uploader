import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlowersModule } from './uploader/flowers.module';

@Module({
  imports: [FlowersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
