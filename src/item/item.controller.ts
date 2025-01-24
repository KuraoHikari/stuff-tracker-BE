// Import necessary decorators and classes from NestJS
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

// Import the ItemService
import { ItemService } from './item.service';

// Import the JWT authentication guard
import { JwtAuthGuard } from '../common/jwt-auth.guard';

// Import response models
import { WebResponse } from '../model/web.model';
import { UserRequest } from '../model/user.model';
import {
  CreateItemRequest,
  UpdateItemRequest,
  ItemResponse,
  ItemDetailResponse,
  ItemListResponse,
  ItemEditResponse,
} from '../model/item.model';

// Define the controller for the /api/items route
@Controller('/api/items')
export class ItemController {
  // Inject the ItemService
  constructor(private itemService: ItemService) {}

  // Define a POST endpoint to create an item, protected by JWT authentication
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createItem(
    @Request() req: UserRequest, // Get the user request
    @Body() request: CreateItemRequest, // Get the request body
  ): Promise<WebResponse<ItemResponse>> {
    // Call the service to create an item
    const result = await this.itemService.createItem(req.user.userId, request);
    // Return the created item in the response
    return {
      data: result,
    };
  }

  // Define a GET endpoint to get all items, protected by JWT authentication
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getItems(
    @Request() req: UserRequest, // Get the user request
  ): Promise<WebResponse<ItemListResponse>> {
    // Call the service to get all items
    const result = await this.itemService.getItems(req.user.userId);
    // Return the list of items in the response
    return {
      data: result,
    };
  }

  // Define a GET endpoint to get a single item by ID, protected by JWT authentication
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getItem(
    @Request() req: UserRequest, // Get the user request
    @Param('id') itemId: string, // Get the item ID from the route parameter
  ): Promise<WebResponse<ItemDetailResponse>> {
    // Call the service to get the item by ID
    const result = await this.itemService.getItem(itemId);
    // Return the item details in the response
    return {
      data: result,
    };
  }

  // Define a PUT endpoint to update an item by ID, protected by JWT authentication
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateItem(
    @Request() req: UserRequest, // Get the user request
    @Param('id') itemId: string, // Get the item ID from the route parameter
    @Body() request: UpdateItemRequest, // Get the request body
  ): Promise<WebResponse<ItemEditResponse>> {
    // Call the service to update the item by ID
    const result = await this.itemService.updateItem(
      req.user.userId,
      itemId,
      request,
    );
    // Return the updated item in the response
    return {
      data: result,
    };
  }

  // Define a DELETE endpoint to delete an item by ID, protected by JWT authentication
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteItem(
    @Request() req: UserRequest, // Get the user request
    @Param('id') itemId: string, // Get the item ID from the route parameter
  ): Promise<void> {
    // Call the service to delete the item by ID
    await this.itemService.deleteItem(req.user.userId, itemId);
  }
}
