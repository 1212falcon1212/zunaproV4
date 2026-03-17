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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ModuleGuard, RequireModule } from '../auth/guards/module.guard';
import { RoleGuard, RequireRoles } from '../auth/guards/role.guard';

@Controller('customers')
@UseGuards(AuthGuard, ModuleGuard, RoleGuard)
@RequireModule('ecommerce')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  findAll(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('isGuest') isGuest?: string,
  ) {
    return this.customersService.findAll(req.tenant!.slug, {
      page,
      limit,
      search,
      isGuest: isGuest !== undefined ? isGuest === 'true' : undefined,
    });
  }

  @Get('stats')
  @RequireRoles('owner', 'admin')
  getStats(@Req() req: Request) {
    return this.customersService.getStats(req.tenant!.slug);
  }

  @Get(':id')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.customersService.findOne(req.tenant!.slug, id);
  }

  @Post()
  @RequireRoles('owner', 'admin', 'editor')
  create(@Req() req: Request, @Body() dto: CreateCustomerDto) {
    return this.customersService.create(req.tenant!.slug, dto);
  }

  @Patch(':id')
  @RequireRoles('owner', 'admin', 'editor')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(req.tenant!.slug, id, dto);
  }

  @Delete(':id')
  @RequireRoles('owner', 'admin')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.customersService.remove(req.tenant!.slug, id);
  }
}
