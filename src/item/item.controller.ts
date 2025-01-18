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
import { ItemService } from './item.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

import { WebResponse } from '../model/web.model';
import { UserRequest } from '../model/user.model';
import {
  CreateItemRequest,
  UpdateItemRequest,
  ItemResponse,
  ItemDetailResponse,
  ItemListResponse,
} from '../model/item.model';

@Controller('/api/items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createItem(
    @Request() req: UserRequest,
    @Body() request: CreateItemRequest,
  ): Promise<WebResponse<ItemResponse>> {
    const result = await this.itemService.createItem(req.user.userId, request);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getItems(
    @Request() req: UserRequest,
  ): Promise<WebResponse<ItemListResponse>> {
    const result = await this.itemService.getItems(req.user.userId);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getItem(
    @Request() req: UserRequest,
    @Param('id') itemId: string,
  ): Promise<WebResponse<ItemDetailResponse>> {
    const result = await this.itemService.getItem(itemId);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateItem(
    @Request() req: UserRequest,
    @Param('id') itemId: string,
    @Body() request: UpdateItemRequest,
  ): Promise<WebResponse<ItemResponse>> {
    const result = await this.itemService.updateItem(
      req.user.userId,
      itemId,
      request,
    );
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteItem(
    @Request() req: UserRequest,
    @Param('id') itemId: string,
  ): Promise<void> {
    await this.itemService.deleteItem(req.user.userId, itemId);
  }
}
