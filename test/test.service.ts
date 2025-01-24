import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import { Location, User } from '@prisma/client';

import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async cleanDb() {
    await this.deleteAllCategories();
    await this.deleteAllStatuses();
    await this.deleteAllLocations();
    await this.deleteAllConditions();
    await this.deleteAllItems();
  }

  async createConditionLocationCategoryStatus(userId: string) {
    await this.createCategory(userId);
    await this.createStatus(userId);
    await this.createCondition(userId);
    await this.createLocation(userId);
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        email: 'test@mail.com',
      },
    });
  }
  async getUser(): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        email: 'test@mail.com',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        email: 'test@mail.com',
        password: await bcrypt.hash('test password', 10),
        name: 'test name',
      },
    });
  }

  async deleteAllCategories() {
    await this.prismaService.category.deleteMany({
      where: {
        name: {
          contains: 'test name',
        },
      },
    });
  }

  async deleteAllStatuses() {
    await this.prismaService.status.deleteMany({
      where: {
        name: {
          contains: 'test name',
        },
      },
    });
  }

  async deleteAllLocations() {
    await this.prismaService.location.deleteMany({
      where: {
        name: {
          contains: 'test name',
        },
      },
    });
  }

  async deleteAllConditions() {
    await this.prismaService.condition.deleteMany({
      where: {
        name: {
          contains: 'test name',
        },
      },
    });
  }

  async deleteAllItems() {
    await this.prismaService.item.deleteMany({
      where: {
        name: {
          contains: 'test name',
        },
      },
    });
  }

  async createLocation(userId: string): Promise<Location> {
    return this.prismaService.location.create({
      data: {
        name: 'test name',
        address: 'test address',
        latitude: 40.7128,
        longitude: -74.006,
        userId: userId,
      },
    });
  }

  async createCategory(userId: string) {
    return this.prismaService.category.create({
      data: {
        name: 'test name',
        description: 'test description',
        userId: userId,
      },
    });
  }

  async createStatus(userId: string) {
    return this.prismaService.status.create({
      data: {
        name: 'test name',
        description: 'test description',
        userId: userId,
      },
    });
  }

  async createCondition(userId: string) {
    return this.prismaService.condition.create({
      data: {
        name: 'test name',
        description: 'test description',
        userId: userId,
      },
    });
  }

  // async getLocation(id: string): Promise<Location> {
  //   return this.prismaService.location.findUnique({
  //     where: { id },
  //   });
  // }

  // async updateLocation(id: string, data: Partial<Location>): Promise<Location> {
  //   return this.prismaService.location.update({
  //     where: { id },
  //     data,
  //   });
  // }

  // async deleteLocation(id: string): Promise<Location> {
  //   return this.prismaService.location.delete({
  //     where: { id },
  //   });
  // }
}
