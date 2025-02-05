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

import { StatusValidation } from './status.validation';
import {
  CreateStatusRequest,
  UpdateStatusRequest,
  StatusResponse,
  StatusDetailResponse,
  StatusListResponse,
} from '../model/status.model';

@Injectable()
export class StatusService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async createStatus(
    userId: string,
    request: CreateStatusRequest,
  ): Promise<StatusResponse> {
    this.logger.info('Creating a new status');

    const createStatusRequest = this.validationService.validate(
      StatusValidation.CREATE,
      request,
    );

    const status = await this.prismaService.status.create({
      data: {
        name: createStatusRequest.name,
        description: createStatusRequest.description,
        userId: userId,
      },
    });

    return {
      ...status,
    };
  }

  async getStatuses(userId: string): Promise<StatusListResponse> {
    this.logger.info('Fetching all statuses');

    const statuses = await this.prismaService.status.findMany({
      where: {
        userId: userId,
      },
    });
    return {
      statuses: [...statuses],
    };
  }

  async getStatus(statusId: string): Promise<StatusDetailResponse> {
    this.logger.info(`Fetching status with id: ${statusId}`);
    const status = await this.prismaService.status.findUnique({
      where: { id: statusId },
    });
    if (!status) {
      throw new NotFoundException('Status not found');
    }

    return {
      ...status,
    };
  }

  async updateStatus(
    userId: string,
    statusId: string,
    request: UpdateStatusRequest,
  ): Promise<StatusResponse> {
    this.logger.info(`Updating status with id: ${statusId}`);

    const updateStatusRequest = this.validationService.validate(
      StatusValidation.UPDATE,
      request,
    );

    const dataUpdate =
      this.validationService.filterUndefinedValues(updateStatusRequest);

    const statusIsExit = await this.prismaService.status.findUnique({
      where: { id: statusId },
    });
    if (!statusIsExit) {
      throw new NotFoundException('Status not found');
    }

    const status = await this.prismaService.status.update({
      where: { id: statusId, userId: userId },
      data: dataUpdate,
    });

    return {
      ...status,
    };
  }

  async deleteStatus(userId: string, statusId: string): Promise<void> {
    this.logger.info(`Deleting status with id: ${statusId}`);

    const status = await this.prismaService.status.findUnique({
      where: { id: statusId },
    });
    if (!status) {
      throw new NotFoundException('Status not found');
    }

    if (status.userId !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    //check if status is in use
    const items = await this.prismaService.item.findMany({
      where: { statusId: statusId },
    });
    if (items.length > 0) {
      throw new UnauthorizedException('Status is in use');
    }

    await this.prismaService.status.delete({ where: { id: statusId } });
  }
}
