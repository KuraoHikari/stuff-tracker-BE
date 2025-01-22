import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import { Location, User } from '@prisma/client';

import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

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

  async createLocation(userId: string): Promise<Location> {
    return this.prismaService.location.create({
      data: {
        name: 'Warehouse',
        address: '123 Warehouse St',
        latitude: 40.7128,
        longitude: -74.006,
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
