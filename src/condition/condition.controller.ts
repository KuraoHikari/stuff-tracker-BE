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
import { ConditionService } from './condition.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

import { WebResponse } from '../model/web.model';
import { UserRequest } from '../model/user.model';
import {
  CreateConditionRequest,
  UpdateConditionRequest,
  ConditionResponse,
  ConditionDetailResponse,
  ConditionListResponse,
} from '../model/condition.model';

@Controller('/api/conditions')
export class ConditionController {
  constructor(private conditionService: ConditionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCondition(
    @Request() req: UserRequest,
    @Body() request: CreateConditionRequest,
  ): Promise<WebResponse<ConditionResponse>> {
    const result = await this.conditionService.createCondition(
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
  async getConditions(
    @Request() req: UserRequest,
  ): Promise<WebResponse<ConditionListResponse>> {
    const result = await this.conditionService.getConditions(req.user.userId);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCondition(
    @Request() req: UserRequest,
    @Param('id') conditionId: string,
  ): Promise<WebResponse<ConditionDetailResponse>> {
    const result = await this.conditionService.getCondition(conditionId);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateCondition(
    @Request() req: UserRequest,
    @Param('id') conditionId: string,
    @Body() request: UpdateConditionRequest,
  ): Promise<WebResponse<ConditionResponse>> {
    const result = await this.conditionService.updateCondition(
      req.user.userId,
      conditionId,
      request,
    );
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCondition(
    @Request() req: UserRequest,
    @Param('id') conditionId: string,
  ): Promise<void> {
    await this.conditionService.deleteCondition(req.user.userId, conditionId);
  }
}
