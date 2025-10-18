import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForgeService } from '../../services/index';


export class ListBucketObjectsQuery {}

@QueryHandler(ListBucketObjectsQuery)
export class ListBucketObjectsHandler implements IQueryHandler<ListBucketObjectsQuery> {
  private readonly base = process.env.AUTODESK_OSS_BASE_URL;

  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async execute() {
    try {
      const data = await this.prismaService.files.findMany();
      return data;
    } catch (err: any) {
      const status = err?.response?.status ?? 500;
      const data = err?.response?.data ?? { message: err?.message ?? 'unknown' };
      throw new HttpException(data, status);
    }
  }
}

