import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
  CategoryDetailResponse,
  CategoryListResponse,
} from '../model/category.model';
import { CategoryValidation } from './category.validation';

@Injectable()
export class CategoryService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async createCategory(
    userId: string,
    request: CreateCategoryRequest,
  ): Promise<CategoryResponse> {
    this.logger.info('Creating a new category');

    const createCategoryRequest = this.validationService.validate(
      CategoryValidation.CREATE,
      request,
    );

    const category = await this.prismaService.category.create({
      data: {
        name: createCategoryRequest.name,
        description: createCategoryRequest.description,
        userId: userId,
      },
    });

    return {
      ...category,
    };
  }

  async getCategories(userId: string): Promise<CategoryListResponse> {
    this.logger.info('Fetching all categories');

    const categories = await this.prismaService.category.findMany({
      where: {
        userId: userId,
      },
    });
    return {
      categories: [...categories],
    };
  }

  async getCategory(categoryId: string): Promise<CategoryDetailResponse> {
    this.logger.info(`Fetching category with id: ${categoryId}`);
    const category = await this.prismaService.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      ...category,
    };
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    request: UpdateCategoryRequest,
  ): Promise<CategoryResponse> {
    this.logger.info(`Updating category with id: ${categoryId}`);

    const updateCategoryRequest = this.validationService.validate(
      CategoryValidation.UPDATE,
      request,
    );

    const dataUpdate = this.validationService.filterUndefinedValues(
      updateCategoryRequest,
    );

    //check if category exists
    const categoryIsExit = await this.prismaService.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryIsExit) {
      throw new NotFoundException('Category not found');
    }

    const category = await this.prismaService.category.update({
      where: { id: categoryId, userId: userId },
      data: dataUpdate,
    });

    return {
      ...category,
    };
  }

  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    this.logger.info(`Deleting category with id: ${categoryId}`);

    const category = await this.prismaService.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    //check if there are items with this category
    const items = await this.prismaService.item.findMany({
      where: {
        categoryId: categoryId,
      },
    });
    if (items.length > 0) {
      throw new UnauthorizedException('Category is in use');
    }

    await this.prismaService.category.delete({ where: { id: categoryId } });
  }
}
