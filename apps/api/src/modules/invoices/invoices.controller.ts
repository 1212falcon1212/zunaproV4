import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InvoicesService } from './invoices.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ModuleGuard, RequireModule } from '../auth/guards/module.guard';
import { RoleGuard, RequireRoles } from '../auth/guards/role.guard';

@Controller('orders')
@UseGuards(AuthGuard, ModuleGuard, RoleGuard)
@RequireModule('ecommerce')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get(':id/invoice')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  async getInvoice(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const invoice = await this.invoicesService.getInvoice(
      req.tenant!.slug,
      id,
    );

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${invoice.invoiceNumber}.html"`,
    );
    res.send(invoice.html);
  }

  @Get(':id/invoice/pdf')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  async getInvoicePdf(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { buffer, invoiceNumber } = await this.invoicesService.generatePdf(
      req.tenant!.slug,
      id,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${invoiceNumber}.pdf"`,
    );
    res.send(buffer);
  }

  @Post(':id/invoice')
  @RequireRoles('owner', 'admin')
  regenerateInvoice(@Req() req: Request, @Param('id') id: string) {
    return this.invoicesService.generateInvoice(req.tenant!.slug, id);
  }
}
