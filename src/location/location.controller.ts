import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('/api/location')
export class LocationController {
  constructor(private locationService: LocationService) {}
  // Create a new location
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createLocation() {}

  // Get all locations
  @Get()
  @HttpCode(HttpStatus.OK)
  async getLocations() {}

  // Get location by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getLocation() {}

  // Update location by id
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateLocation() {}

  // Delete location by id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLocation() {}
}
