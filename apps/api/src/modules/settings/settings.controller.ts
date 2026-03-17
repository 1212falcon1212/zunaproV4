import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { SettingsService } from './settings.service';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { ApplyThemeDto } from './dto/apply-theme.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAll(@Req() req: Request, @Query('group') group?: string) {
    return this.settingsService.getSettingsByGroup(req.tenant!.slug, group);
  }

  @Get(':key')
  findByKey(@Req() req: Request, @Param('key') key: string) {
    return this.settingsService.getSetting(req.tenant!.slug, key);
  }

  @Put(':key')
  update(
    @Req() req: Request,
    @Param('key') key: string,
    @Body() body: { value: unknown; group?: string },
  ) {
    return this.settingsService.upsertSetting(
      req.tenant!.slug,
      key,
      body.value,
      body.group,
    );
  }

  @Put('theme/config')
  updateTheme(@Req() req: Request, @Body() dto: UpdateThemeDto) {
    return this.settingsService.updateThemeConfig(req.tenant!.slug, dto as Record<string, unknown>);
  }

  @Post('theme/apply')
  applyTheme(@Req() req: Request, @Body() dto: ApplyThemeDto) {
    return this.settingsService.applyTheme(
      req.tenant!.slug,
      dto.themeId,
      dto.applyLayout ?? true,
      dto.reseed ?? false,
    );
  }

  @Post('reseed')
  reseed(@Req() req: Request, @Body() body: { sector?: string }) {
    return this.settingsService.reseedTenant(
      req.tenant!.slug,
      body.sector ?? 'genel',
    );
  }
}
