import { Module } from '@nestjs/common';
import {
  PageBuilderController,
  GlobalSectionController,
  StorefrontPageController,
} from './page-builder.controller';
import { PageBuilderService } from './page-builder.service';

@Module({
  controllers: [
    PageBuilderController,
    GlobalSectionController,
    StorefrontPageController,
  ],
  providers: [PageBuilderService],
  exports: [PageBuilderService],
})
export class PageBuilderModule {}
