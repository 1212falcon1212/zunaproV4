import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getTenantClient } from '@zunapro/db';
import * as Minio from 'minio';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly minioClient: Minio.Client;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT', 'localhost'),
      port: parseInt(this.configService.get('MINIO_PORT', '9000'), 10),
      useSSL: this.configService.get('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get('MINIO_SECRET_KEY', 'minioadmin'),
    });
  }

  private getBucketName(tenantSlug: string): string {
    return `tenant-${tenantSlug}`;
  }

  private async ensureBucket(bucketName: string): Promise<void> {
    const exists = await this.minioClient.bucketExists(bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(bucketName);
      const policy = JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
          },
        ],
      });
      await this.minioClient.setBucketPolicy(bucketName, policy);
      this.logger.log(`Bucket created: ${bucketName}`);
    }
  }

  private getPublicUrl(bucketName: string, filename: string): string {
    const publicUrl = this.configService.get('MINIO_PUBLIC_URL');

    if (publicUrl) {
      return `${publicUrl}/${bucketName}/${filename}`;
    }

    // Proxy through API so browser doesn't need direct MinIO access
    const apiUrl = this.configService.get('API_PUBLIC_URL', 'http://localhost:4000');
    return `${apiUrl}/media/file/${bucketName}/${filename}`;
  }

  async getFileStream(bucket: string, filename: string) {
    const stream = await this.minioClient.getObject(bucket, filename);
    const stat = await this.minioClient.statObject(bucket, filename);
    return { stream, contentType: stat.metaData?.['content-type'] || 'application/octet-stream', size: stat.size };
  }

  validateFile(file: Express.Multer.File): void {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type '${file.mimetype}' is not allowed. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds maximum of 5MB`,
      );
    }
  }

  async upload(
    tenantSlug: string,
    file: Express.Multer.File,
    alt?: Record<string, string>,
  ) {
    this.validateFile(file);

    const prisma = getTenantClient(tenantSlug);
    const bucketName = this.getBucketName(tenantSlug);
    await this.ensureBucket(bucketName);

    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;

    await this.minioClient.putObject(bucketName, filename, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    const url = this.getPublicUrl(bucketName, filename);

    const media = await prisma.media.create({
      data: {
        filename,
        url,
        mimeType: file.mimetype,
        size: file.size,
        alt: (alt as object) ?? undefined,
      },
    });

    this.logger.log(`Media uploaded: ${filename} (tenant: ${tenantSlug})`);
    return media;
  }

  async uploadMultiple(
    tenantSlug: string,
    files: Express.Multer.File[],
  ) {
    const results = [];
    for (const file of files) {
      const media = await this.upload(tenantSlug, file);
      results.push(media);
    }
    return results;
  }

  async findAll(tenantSlug: string, page = 1, limit = 20) {
    const prisma = getTenantClient(tenantSlug);
    const skip = (page - 1) * limit;

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.media.count(),
    ]);

    return {
      data: media,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async remove(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    const bucketName = this.getBucketName(tenantSlug);
    try {
      await this.minioClient.removeObject(bucketName, media.filename);
    } catch (error) {
      this.logger.warn(
        `Failed to remove file from MinIO: ${media.filename}`,
        error,
      );
    }

    await prisma.media.delete({ where: { id } });

    this.logger.log(`Media deleted: ${media.filename} (tenant: ${tenantSlug})`);
    return { deleted: true };
  }
}
