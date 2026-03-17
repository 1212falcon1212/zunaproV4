import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getTenantClient } from '@zunapro/db';
import { RedisService } from '../../common/redis/redis.service';
import * as Minio from 'minio';
import puppeteer from 'puppeteer';
import { generateInvoiceHtml } from './templates/invoice.template';
import type { OrderItem, Address } from '@zunapro/types';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);
  private readonly minioClient: Minio.Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
  ) {
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
    }
  }

  private async generateInvoiceNumber(tenantSlug: string): Promise<string> {
    const num = await this.redis.incr(`invoice_number:${tenantSlug}`);
    return `INV-${String(num).padStart(6, '0')}`;
  }

  async generateInvoice(tenantSlug: string, orderId: string) {
    const prisma = getTenantClient(tenantSlug);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const invoiceNumber = await this.generateInvoiceNumber(tenantSlug);
    const items = order.items as unknown as OrderItem[];
    const shippingAddress = (order.shippingAddress ?? {}) as unknown as Address;
    const billingAddress = (order.billingAddress ?? shippingAddress) as unknown as Address;

    const customerData = order.customer
      ? {
          email: order.customer.email,
          firstName: order.customer.firstName,
          lastName: order.customer.lastName,
          phone: order.customer.phone ?? undefined,
        }
      : { email: 'N/A', firstName: 'Guest', lastName: 'Customer' };

    const html = generateInvoiceHtml({
      invoiceNumber,
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString().split('T')[0],
      customer: customerData,
      shippingAddress,
      billingAddress,
      items,
      subtotal: Number(order.subtotalAmount),
      tax: Number(order.taxAmount),
      shipping: Number(order.shippingCost),
      discount: Number(order.discountAmount),
      total: Number(order.totalAmount),
      currency: order.currency,
      paymentMethod: order.paymentMethod ?? undefined,
      locale: order.locale,
    });

    // Store HTML as the invoice (PDF generation requires puppeteer which is heavy)
    // In production, use a PDF service or puppeteer to convert HTML to PDF
    const bucketName = this.getBucketName(tenantSlug);
    await this.ensureBucket(bucketName);

    const filename = `invoices/${invoiceNumber}.html`;
    const buffer = Buffer.from(html, 'utf-8');

    await this.minioClient.putObject(bucketName, filename, buffer, buffer.length, {
      'Content-Type': 'text/html; charset=utf-8',
    });

    const endpoint = this.configService.get('MINIO_ENDPOINT', 'localhost');
    const port = this.configService.get('MINIO_PORT', '9000');
    const useSSL = this.configService.get('MINIO_USE_SSL', 'false') === 'true';
    const protocol = useSSL ? 'https' : 'http';
    const publicUrl = this.configService.get('MINIO_PUBLIC_URL');

    const invoiceUrl = publicUrl
      ? `${publicUrl}/${bucketName}/${filename}`
      : `${protocol}://${endpoint}:${port}/${bucketName}/${filename}`;

    this.logger.log(
      `Invoice generated: ${invoiceNumber} for order ${order.orderNumber} (tenant: ${tenantSlug})`,
    );

    return {
      invoiceNumber,
      url: invoiceUrl,
      html,
    };
  }

  async generatePdf(
    tenantSlug: string,
    orderId: string,
  ): Promise<{ buffer: Buffer; invoiceNumber: string; url: string }> {
    const invoice = await this.generateInvoice(tenantSlug, orderId);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    let pdfBuffer: Buffer;
    try {
      const page = await browser.newPage();
      await page.setContent(invoice.html, { waitUntil: 'networkidle0' });
      const pdfUint8 = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
      });
      pdfBuffer = Buffer.from(pdfUint8);
    } finally {
      await browser.close();
    }

    const bucketName = this.getBucketName(tenantSlug);
    await this.ensureBucket(bucketName);
    const filename = `invoices/${invoice.invoiceNumber}.pdf`;

    await this.minioClient.putObject(
      bucketName,
      filename,
      pdfBuffer,
      pdfBuffer.length,
      { 'Content-Type': 'application/pdf' },
    );

    const publicUrl = this.configService.get('MINIO_PUBLIC_URL');
    const endpoint = this.configService.get('MINIO_ENDPOINT', 'localhost');
    const port = this.configService.get('MINIO_PORT', '9000');
    const useSSL = this.configService.get('MINIO_USE_SSL', 'false') === 'true';
    const protocol = useSSL ? 'https' : 'http';

    const pdfUrl = publicUrl
      ? `${publicUrl}/${bucketName}/${filename}`
      : `${protocol}://${endpoint}:${port}/${bucketName}/${filename}`;

    this.logger.log(
      `PDF invoice generated: ${invoice.invoiceNumber} for order ${orderId} (tenant: ${tenantSlug})`,
    );

    return {
      buffer: pdfBuffer,
      invoiceNumber: invoice.invoiceNumber,
      url: pdfUrl,
    };
  }

  async getInvoice(tenantSlug: string, orderId: string) {
    return this.generateInvoice(tenantSlug, orderId);
  }
}
