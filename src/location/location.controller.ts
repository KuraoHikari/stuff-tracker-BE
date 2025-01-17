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
import { LocationService } from './location.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import {
  CreateLocationRequest,
  UpdateLocationRequest,
  LocationResponse,
  LocationDetailResponse,
  LocationListResponse,
} from '../model/location.model';
import { WebResponse } from '../model/web.model';
import { UserRequest } from '../model/user.model';

@Controller('/api/locations')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createLocation(
    @Request() req: UserRequest,
    @Body() request: CreateLocationRequest,
  ): Promise<WebResponse<LocationResponse>> {
    console.log('🚀 ~ LocationController ~ request:', req.user);
    const result = await this.locationService.createLocation(
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
  async getLocations(
    @Request() req: UserRequest,
  ): Promise<WebResponse<LocationListResponse>> {
    const result = await this.locationService.getLocations(req.user.userId);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getLocation(
    @Param('id') locationId: string,
  ): Promise<WebResponse<LocationDetailResponse>> {
    const result = await this.locationService.getLocation(locationId);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateLocation(
    @Request() req: UserRequest,
    @Param('id') locationId: string,
    @Body() request: UpdateLocationRequest,
  ): Promise<WebResponse<LocationResponse>> {
    const result = await this.locationService.updateLocation(
      req.user.userId,
      locationId,
      request,
    );
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLocation(
    @Request() req: UserRequest,
    @Param('id') locationId: string,
  ): Promise<void> {
    await this.locationService.deleteLocation(req.user.userId, locationId);
  }
}
