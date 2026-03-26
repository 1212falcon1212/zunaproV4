import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Request } from 'express';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('blog')
@UseGuards(AuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
  ) {
    return this.blogService.findAll(req.tenant!.slug, { page, limit, status });
  }

  @Get(':id')
  findById(@Req() req: Request, @Param('id') id: string) {
    return this.blogService.findById(req.tenant!.slug, id);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateBlogPostDto) {
    return this.blogService.create(req.tenant!.slug, dto);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateBlogPostDto,
  ) {
    return this.blogService.update(req.tenant!.slug, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.blogService.remove(req.tenant!.slug, id);
  }
}
