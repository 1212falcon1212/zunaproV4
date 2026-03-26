import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseIntPipe,
  DefaultValuePipe,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { MediaService } from './media.service';
import { UploadDto } from './dto/upload.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ModuleGuard, RequireModule } from '../auth/guards/module.guard';
import { RoleGuard, RequireRoles } from '../auth/guards/role.guard';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /** Public endpoint — serves files from MinIO (no auth required) */
  @Get('file/:bucket/:filename')
  async serveFile(
    @Param('bucket') bucket: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const { stream, contentType, size } = await this.mediaService.getFileStream(bucket, filename);
      res.set({
        'Content-Type': contentType,
        'Content-Length': String(size),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Access-Control-Allow-Origin': '*',
      });
      (stream as NodeJS.ReadableStream).pipe(res);
    } catch {
      throw new NotFoundException('File not found');
    }
  }

  @Post('upload')
  @UseGuards(AuthGuard, ModuleGuard, RoleGuard)
  @RequireModule('ecommerce')
  @RequireRoles('owner', 'admin', 'editor')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  upload(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDto,
  ) {
    return this.mediaService.upload(req.tenant!.slug, file, dto.alt);
  }

  @Post('upload-multiple')
  @UseGuards(AuthGuard, ModuleGuard, RoleGuard)
  @RequireModule('ecommerce')
  @RequireRoles('owner', 'admin', 'editor')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadMultiple(
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.mediaService.uploadMultiple(req.tenant!.slug, files);
  }

  @Get()
  @UseGuards(AuthGuard, ModuleGuard, RoleGuard)
  @RequireModule('ecommerce')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  findAll(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.mediaService.findAll(req.tenant!.slug, page, limit);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, ModuleGuard, RoleGuard)
  @RequireModule('ecommerce')
  @RequireRoles('owner', 'admin')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.mediaService.remove(req.tenant!.slug, id);
  }
}
