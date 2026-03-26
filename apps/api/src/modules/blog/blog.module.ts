import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
