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
import { ActionService } from './action.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

import { WebResponse } from '../model/web.model';
import { UserRequest } from '../model/user.model';
import {
  CreateActionRequest,
  UpdateActionRequest,
  ActionResponse,
  ActionDetailResponse,
  ActionListResponse,
} from '../model/action.model';

@Controller('/api/actions')
export class ActionController {
  constructor(private actionService: ActionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAction(
    @Request() req: UserRequest,
    @Body() request: CreateActionRequest,
  ): Promise<WebResponse<ActionResponse>> {
    const result = await this.actionService.createAction(
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
  async getActions(
    @Request() req: UserRequest,
  ): Promise<WebResponse<ActionListResponse>> {
    const result = await this.actionService.getActions(req.user.userId);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getAction(
    @Request() req: UserRequest,
    @Param('id') actionId: string,
  ): Promise<WebResponse<ActionDetailResponse>> {
    const result = await this.actionService.getAction(actionId);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateAction(
    @Request() req: UserRequest,
    @Param('id') actionId: string,
    @Body() request: UpdateActionRequest,
  ): Promise<WebResponse<ActionResponse>> {
    const result = await this.actionService.updateAction(
      req.user.userId,
      actionId,
      request,
    );
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAction(
    @Request() req: UserRequest,
    @Param('id') actionId: string,
  ): Promise<void> {
    await this.actionService.deleteAction(req.user.userId, actionId);
  }
}
