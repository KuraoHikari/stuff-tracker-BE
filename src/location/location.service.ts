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
import { PrismaService } from 'src/common/prisma.service';
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
    console.log('🚀 ~ LocationService ~ userId:', userId);
    console.log('🚀 ~ LocationService ~ request:', request);
    this.logger.info('Creating a new location');

    // Validate request
    const createLocationRequest = this.validationService.validate(
      LocationValidation.CREATE_LOCATION,
      request,
    );

    try {
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
    } catch (error) {
      console.log('🚀 ~ LocationService ~ error:', error.message);
      this.logger.error('Error creating location', error.message);
      throw new InternalServerErrorException('Error creating location');
    }
  }

  async getLocations(userId: string): Promise<LocationListResponse> {
    this.logger.info('Fetching all locations');
    try {
      const locations = await this.prismaService.location.findMany({
        where: {
          userId: userId,
        },
      });
      return {
        locations: [...locations],
      };
    } catch (error) {
      this.logger.error('Error fetching locations', error);
      throw new InternalServerErrorException('Error fetching locations');
    }
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
      location: location,
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

    try {
      const location = await this.prismaService.location.update({
        where: { id: locationId, userId: userId },
        data: dataUpdate,
      });

      return {
        ...location,
      };
    } catch (error) {
      this.logger.error('Error updating location', error);
      throw new InternalServerErrorException('Error updating location');
    }
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

    try {
      // Delete location
      await this.prismaService.location.delete({ where: { id: locationId } });
    } catch (error) {
      this.logger.error('Error deleting location', error);
      throw new InternalServerErrorException('Error deleting location');
    }
  }
}
