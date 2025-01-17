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
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

import { WebResponse } from '../model/web.model';
import { UserRequest } from '../model/user.model';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
  CategoryDetailResponse,
  CategoryListResponse,
} from '../model/category.model';

@Controller('/api/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCategory(
    @Request() req: UserRequest,
    @Body() request: CreateCategoryRequest,
  ): Promise<WebResponse<CategoryResponse>> {
    const result = await this.categoryService.createCategory(
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
  async getCategories(
    @Request() req: UserRequest,
  ): Promise<WebResponse<CategoryListResponse>> {
    const result = await this.categoryService.getCategories(req.user.userId);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCategory(
    @Request() req: UserRequest,
    @Param('id') categoryId: string,
  ): Promise<WebResponse<CategoryDetailResponse>> {
    const result = await this.categoryService.getCategory(categoryId);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateCategory(
    @Request() req: UserRequest,
    @Param('id') categoryId: string,
    @Body() request: UpdateCategoryRequest,
  ): Promise<WebResponse<CategoryResponse>> {
    const result = await this.categoryService.updateCategory(
      req.user.userId,
      categoryId,
      request,
    );
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(
    @Request() req: UserRequest,
    @Param('id') categoryId: string,
  ): Promise<void> {
    await this.categoryService.deleteCategory(req.user.userId, categoryId);
  }
}
