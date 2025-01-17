import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Put,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

import { WebResponse } from '../model/web.model';
import { UserRequest } from '../model/user.model';
import {
  CreateStatusRequest,
  UpdateStatusRequest,
  StatusResponse,
  StatusDetailResponse,
  StatusListResponse,
} from '../model/status.model';

@Controller('/api/statuses')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStatus(
    @Request() req: UserRequest,
    @Body() request: CreateStatusRequest,
  ): Promise<WebResponse<StatusResponse>> {
    const result = await this.statusService.createStatus(
      req.user.userId,
      request,
    );
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getStatuses(
    @Request() req: UserRequest,
  ): Promise<WebResponse<StatusListResponse>> {
    const result = await this.statusService.getStatuses(req.user.userId);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getStatus(
    @Request() req: UserRequest,
    @Param('id') statusId: string,
  ): Promise<WebResponse<StatusDetailResponse>> {
    const result = await this.statusService.getStatus(statusId);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Request() req: UserRequest,
    @Param('id') statusId: string,
    @Body() request: UpdateStatusRequest,
  ): Promise<WebResponse<StatusResponse>> {
    const result = await this.statusService.updateStatus(
      req.user.userId,
      statusId,
      request,
    );
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStatus(
    @Request() req: UserRequest,
    @Param('id') statusId: string,
  ): Promise<void> {
    await this.statusService.deleteStatus(req.user.userId, statusId);
  }
}
