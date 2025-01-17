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

import { ConditionValidation } from './condition.validation';
import {
  CreateConditionRequest,
  UpdateConditionRequest,
  ConditionResponse,
  ConditionDetailResponse,
  ConditionListResponse,
} from '../model/condition.model';

@Injectable()
export class ConditionService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async createCondition(
    userId: string,
    request: CreateConditionRequest,
  ): Promise<ConditionResponse> {
    this.logger.info('Creating a new condition');

    const createConditionRequest = this.validationService.validate(
      ConditionValidation.CREATE,
      request,
    );

    try {
      const condition = await this.prismaService.condition.create({
        data: {
          name: createConditionRequest.name,
          description: createConditionRequest.description,
          userId: userId,
        },
      });

      return {
        ...condition,
      };
    } catch (error) {
      this.logger.error('Error creating condition', error);
      throw new InternalServerErrorException('Error creating condition');
    }
  }

  async getConditions(userId: string): Promise<ConditionListResponse> {
    this.logger.info('Fetching all conditions');
    try {
      const conditions = await this.prismaService.condition.findMany({
        where: {
          userId: userId,
        },
      });
      return {
        conditions: [...conditions],
      };
    } catch (error) {
      this.logger.error('Error fetching conditions', error);
      throw new InternalServerErrorException('Error fetching conditions');
    }
  }

  async getCondition(conditionId: string): Promise<ConditionDetailResponse> {
    this.logger.info(`Fetching condition with id: ${conditionId}`);
    const condition = await this.prismaService.condition.findUnique({
      where: { id: conditionId },
    });
    if (!condition) {
      throw new NotFoundException('Condition not found');
    }

    return {
      ...condition,
    };
  }

  async updateCondition(
    userId: string,
    conditionId: string,
    request: UpdateConditionRequest,
  ): Promise<ConditionResponse> {
    this.logger.info(`Updating condition with id: ${conditionId}`);

    const updateConditionRequest = this.validationService.validate(
      ConditionValidation.UPDATE,
      request,
    );

    const dataUpdate = this.validationService.filterUndefinedValues(
      updateConditionRequest,
    );

    try {
      const condition = await this.prismaService.condition.update({
        where: { id: conditionId, userId: userId },
        data: dataUpdate,
      });

      return {
        ...condition,
      };
    } catch (error) {
      this.logger.error('Error updating condition', error);
      throw new InternalServerErrorException('Error updating condition');
    }
  }

  async deleteCondition(userId: string, conditionId: string): Promise<void> {
    this.logger.info(`Deleting condition with id: ${conditionId}`);

    const condition = await this.prismaService.condition.findUnique({
      where: { id: conditionId },
    });
    if (!condition) {
      throw new NotFoundException('Condition not found');
    }

    if (condition.userId !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      await this.prismaService.condition.delete({ where: { id: conditionId } });
    } catch (error) {
      this.logger.error('Error deleting condition', error);
      throw new InternalServerErrorException('Error deleting condition');
    }
  }
}
