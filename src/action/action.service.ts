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

import { ActionValidation } from './action.validation';
import {
  CreateActionRequest,
  UpdateActionRequest,
  ActionResponse,
  ActionDetailResponse,
  ActionListResponse,
} from 'src/model/action.model';

@Injectable()
export class ActionService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async createAction(
    userId: string,
    request: CreateActionRequest,
  ): Promise<ActionResponse> {
    this.logger.info('Creating a new action');

    const createActionRequest = this.validationService.validate(
      ActionValidation.CREATE,
      request,
    );

    try {
      const action = await this.prismaService.action.create({
        data: {
          name: createActionRequest.name,
          description: createActionRequest.description,
          userId: userId,
        },
      });

      return {
        ...action,
      };
    } catch (error) {
      this.logger.error('Error creating action', error);
      throw new InternalServerErrorException('Error creating action');
    }
  }

  async getActions(userId: string): Promise<ActionListResponse> {
    this.logger.info('Fetching all actions');
    try {
      const actions = await this.prismaService.action.findMany({
        where: {
          userId: userId,
        },
      });
      return {
        actions: [...actions],
      };
    } catch (error) {
      this.logger.error('Error fetching actions', error);
      throw new InternalServerErrorException('Error fetching actions');
    }
  }

  async getAction(actionId: string): Promise<ActionDetailResponse> {
    this.logger.info(`Fetching action with id: ${actionId}`);
    const action = await this.prismaService.action.findUnique({
      where: { id: actionId },
    });
    if (!action) {
      throw new NotFoundException('Action not found');
    }

    return {
      ...action,
    };
  }

  async updateAction(
    userId: string,
    actionId: string,
    request: UpdateActionRequest,
  ): Promise<ActionResponse> {
    this.logger.info(`Updating action with id: ${actionId}`);

    const updateActionRequest = this.validationService.validate(
      ActionValidation.UPDATE,
      request,
    );

    const dataUpdate =
      this.validationService.filterUndefinedValues(updateActionRequest);

    try {
      const action = await this.prismaService.action.update({
        where: { id: actionId, userId: userId },
        data: dataUpdate,
      });

      return {
        ...action,
      };
    } catch (error) {
      this.logger.error('Error updating action', error);
      throw new InternalServerErrorException('Error updating action');
    }
  }

  async deleteAction(userId: string, actionId: string): Promise<void> {
    this.logger.info(`Deleting action with id: ${actionId}`);

    const action = await this.prismaService.action.findUnique({
      where: { id: actionId },
    });
    if (!action) {
      throw new NotFoundException('Action not found');
    }

    if (action.userId !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      await this.prismaService.action.delete({ where: { id: actionId } });
    } catch (error) {
      this.logger.error('Error deleting action', error);
      throw new InternalServerErrorException('Error deleting action');
    }
  }
}
