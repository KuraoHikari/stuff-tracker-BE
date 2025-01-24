import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import {
  CreateLocationRequest,
  UpdateLocationRequest,
  LocationResponse,
  LocationDetailResponse,
  LocationListResponse,
} from '../model/location.model';
import { LocationValidation } from './location.validation';

@Injectable()
export class LocationService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  // Create a new location
  async createLocation(
    userId: string,
    request: CreateLocationRequest,
  ): Promise<LocationResponse> {
    this.logger.info('Creating a new location');

    // Validate request
    const createLocationRequest = this.validationService.validate(
      LocationValidation.CREATE_LOCATION,
      request,
    );

    // Create a new location
    const location = await this.prismaService.location.create({
      data: {
        ...createLocationRequest,
        userId: userId,
      },
    });

    return {
      ...location,
    };
  }

  async getLocations(userId: string): Promise<LocationListResponse> {
    this.logger.info('Fetching all locations');

    const locations = await this.prismaService.location.findMany({
      where: {
        userId: userId,
      },
    });
    return {
      locations: [...locations],
    };
  }

  async getLocation(locationId: string): Promise<LocationDetailResponse> {
    this.logger.info(`Fetching location with id: ${locationId}`);
    const location = await this.prismaService.location.findUnique({
      where: { id: locationId },
    });
    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return {
      ...location,
    };
  }

  async updateLocation(
    userId: string,
    locationId: string,
    request: UpdateLocationRequest,
  ): Promise<LocationResponse> {
    this.logger.info(`Updating location with id: ${locationId}`);

    // Validate request
    const updateLocationRequest = this.validationService.validate(
      LocationValidation.UPDATE_LOCATION,
      request,
    );

    // Data update
    const dataUpdate = this.validationService.filterUndefinedValues(
      updateLocationRequest,
    );

    const isLocationExit = await this.prismaService.location.findUnique({
      where: { id: locationId },
    });
    if (!isLocationExit) {
      throw new NotFoundException('Location not found');
    }

    const location = await this.prismaService.location.update({
      where: { id: locationId, userId: userId },
      data: dataUpdate,
    });

    return {
      ...location,
    };
  }

  async deleteLocation(userId: string, locationId: string): Promise<void> {
    this.logger.info(`Deleting location with id: ${locationId}`);

    // Validate is owner
    const location = await this.prismaService.location.findUnique({
      where: { id: locationId },
    });
    if (!location) {
      throw new NotFoundException('Location not found');
    }

    if (location.userId !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Check if location is used
    const items = await this.prismaService.item.findMany({
      where: {
        locationId: locationId,
      },
    });
    if (items.length > 0) {
      throw new BadRequestException('Location is being used');
    }

    // Delete location
    await this.prismaService.location.delete({ where: { id: locationId } });
  }
}
