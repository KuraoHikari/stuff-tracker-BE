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
import { PrismaService } from 'src/common/prisma.service';

import { ItemValidation } from './item.validation';
import {
  CreateItemRequest,
  UpdateItemRequest,
  ItemResponse,
  ItemDetailResponse,
  ItemListResponse,
  ItemEditResponse,
} from '../model/item.model';

@Injectable()
export class ItemService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async createItem(
    userId: string,
    request: CreateItemRequest,
  ): Promise<ItemResponse> {
    this.logger.info('Creating a new item');

    const createItemRequest = this.validationService.validate(
      ItemValidation.CREATE,
      request,
    );

    // Check if the category, condition, location, and status exist concurrently
    const [category, condition, location, status] = await Promise.all([
      createItemRequest.categoryId
        ? this.prismaService.category.findUnique({
            where: { id: createItemRequest.categoryId },
          })
        : null,
      createItemRequest.conditionId
        ? this.prismaService.condition.findUnique({
            where: { id: createItemRequest.conditionId },
          })
        : null,
      createItemRequest.locationId
        ? this.prismaService.location.findUnique({
            where: { id: createItemRequest.locationId },
          })
        : null,
      createItemRequest.statusId
        ? this.prismaService.status.findUnique({
            where: { id: createItemRequest.statusId },
          })
        : null,
    ]);

    if (createItemRequest.categoryId && !category) {
      throw new NotFoundException('Category not found');
    }
    if (createItemRequest.conditionId && !condition) {
      throw new NotFoundException('Condition not found');
    }
    if (createItemRequest.locationId && !location) {
      throw new NotFoundException('Location not found');
    }
    if (createItemRequest.statusId && !status) {
      throw new NotFoundException('Status not found');
    }

    const item = await this.prismaService.item.create({
      data: {
        ...createItemRequest,
        ownerId: userId,
      },
    });

    return {
      ...item,
    };
  }

  async getItems(userId: string): Promise<ItemListResponse> {
    this.logger.info('Fetching all items');

    const items = await this.prismaService.item.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        category: true,
        condition: true,
        location: true,
        status: true,
      },
    });
    return {
      items: items.map((item) => ({
        ...item,
        category: item.category?.name,
        condition: item.condition?.name,
        location: item.location?.name,
        status: item.status?.name,
      })),
    };
  }

  async getItem(itemId: string): Promise<ItemDetailResponse> {
    this.logger.info(`Fetching item with id: ${itemId}`);
    const item = await this.prismaService.item.findUnique({
      where: { id: itemId },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return {
      ...item,
    };
  }

  async updateItem(
    userId: string,
    itemId: string,
    request: UpdateItemRequest,
  ): Promise<ItemEditResponse> {
    this.logger.info(`Updating item with id: ${itemId}`);

    const updateItemRequest = this.validationService.validate(
      ItemValidation.UPDATE,
      request,
    );

    const dataUpdate =
      this.validationService.filterUndefinedValues(updateItemRequest);

    const itemIsExit = await this.prismaService.item.findUnique({
      where: { id: itemId },
    });
    if (!itemIsExit) {
      throw new NotFoundException('Item not found');
    }

    // Check if the category, condition, location, and status exist concurrently
    const [category, condition, location, status] = await Promise.all([
      dataUpdate.categoryId
        ? this.prismaService.category.findUnique({
            where: { id: dataUpdate.categoryId },
          })
        : null,
      dataUpdate.conditionId
        ? this.prismaService.condition.findUnique({
            where: { id: dataUpdate.conditionId },
          })
        : null,
      dataUpdate.locationId
        ? this.prismaService.location.findUnique({
            where: { id: dataUpdate.locationId },
          })
        : null,
      dataUpdate.statusId
        ? this.prismaService.status.findUnique({
            where: { id: dataUpdate.statusId },
          })
        : null,
    ]);

    if (dataUpdate.categoryId && !category) {
      throw new NotFoundException('Category not found');
    }
    if (dataUpdate.conditionId && !condition) {
      throw new NotFoundException('Condition not found');
    }
    if (dataUpdate.locationId && !location) {
      throw new NotFoundException('Location not found');
    }
    if (dataUpdate.statusId && !status) {
      throw new NotFoundException('Status not found');
    }

    const item = await this.prismaService.item.update({
      where: { id: itemId, ownerId: userId },
      data: dataUpdate,
      include: {
        category: true,
        condition: true,
        location: true,
        status: true,
      },
    });

    return {
      ...item,
      category: item.category?.name,
      condition: item.condition?.name,
      location: item.location?.name,
      status: item.status?.name,
    };
  }

  async deleteItem(userId: string, itemId: string): Promise<void> {
    this.logger.info(`Deleting item with id: ${itemId}`);

    const item = await this.prismaService.item.findUnique({
      where: { id: itemId },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.ownerId !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    await this.prismaService.item.delete({ where: { id: itemId } });
  }
}
