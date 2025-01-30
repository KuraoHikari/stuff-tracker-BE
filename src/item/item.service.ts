// Import necessary decorators and exceptions from NestJS
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

// Import the ValidationService
import { ValidationService } from '../common/validation.service';

// Import the WINSTON_MODULE_PROVIDER for logging
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

// Import the Logger from winston
import { Logger } from 'winston';

// Import the PrismaService for database access
import { PrismaService } from '../common/prisma.service';

// Import the ItemValidation for request validation
import { ItemValidation } from './item.validation';

// Import request and response models
import {
  CreateItemRequest,
  UpdateItemRequest,
  ItemResponse,
  ItemDetailResponse,
  ItemListResponse,
  ItemEditResponse,
  ItemCreateResponse,
} from '../model/item.model';

// Define the ItemService as an injectable service
@Injectable()
export class ItemService {
  // Inject the necessary services and logger
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  // Method to create a new item
  async createItem(
    userId: string,
    request: CreateItemRequest,
  ): Promise<ItemCreateResponse> {
    this.logger.info('Creating a new item');

    // Validate the create item request
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

    // Throw exceptions if any of the related entities are not found
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

    // Create the item in the database
    const item = await this.prismaService.item.create({
      data: {
        ...createItemRequest,
        ownerId: userId,
      },
      include: {
        category: true,
        condition: true,
        location: true,
        status: true,
      },
    });

    // Return the created item
    return {
      ...item,
      category: item.category?.name, // Include only the category name
      condition: item.condition?.name, // Include only the condition name
      location: item.location?.name, // Include only the location name
      status: item.status?.name, // Include only the
    };
  }

  // Method to get all items for a user
  async getItems(userId: string): Promise<ItemListResponse> {
    this.logger.info('Fetching all items');

    // Fetch all items for the user from the database
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

    // Return the list of items
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

  // Method to get a single item by ID
  async getItem(itemId: string): Promise<ItemDetailResponse> {
    this.logger.info(`Fetching item with id: ${itemId}`);

    // Fetch the item from the database
    const item = await this.prismaService.item.findUnique({
      where: { id: itemId },
    });

    // Throw an exception if the item is not found
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Return the item details
    return {
      ...item,
    };
  }

  // Method to update an item by ID
  async updateItem(
    userId: string,
    itemId: string,
    request: UpdateItemRequest,
  ): Promise<ItemEditResponse> {
    this.logger.info(`Updating item with id: ${itemId}`);

    // Validate the update item request
    const updateItemRequest = this.validationService.validate(
      ItemValidation.UPDATE,
      request,
    );

    // Filter out undefined values from the update request
    const dataUpdate =
      this.validationService.filterUndefinedValues(updateItemRequest);

    // Check if the item exists
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

    // Throw exceptions if any of the related entities are not found
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

    // Update the item in the database
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

    // Return the updated item
    return {
      ...item,
      category: item.category?.name,
      condition: item.condition?.name,
      location: item.location?.name,
      status: item.status?.name,
    };
  }

  // Method to delete an item by ID
  async deleteItem(userId: string, itemId: string): Promise<void> {
    this.logger.info(`Deleting item with id: ${itemId}`);

    // Fetch the item from the database
    const item = await this.prismaService.item.findUnique({
      where: { id: itemId },
    });

    // Throw an exception if the item is not found
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Throw an exception if the user is not authorized to delete the item
    if (item.ownerId !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Delete the item from the database
    await this.prismaService.item.delete({ where: { id: itemId } });
  }
}
