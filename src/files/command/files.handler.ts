import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { UrnConverter } from 'src/common/utils/urn-converter';
import { ForgeService } from '../../services/index';

export class UploadFileCommand {
  constructor(public readonly file: Express.Multer.File) {}
}

@CommandHandler(UploadFileCommand)
export class UploadFileCommandHandler
  implements ICommandHandler<UploadFileCommand>
{
  constructor(
    private readonly forgeService: ForgeService,
    private readonly prismaService: PrismaService
  ) {}

  async execute(command: UploadFileCommand) {
    const { file } = command;

    const bucketKey = process.env.FILE_BUCKET_NAME ?? '';
    let bucketData = await this.forgeService.makeRequest(`buckets/${bucketKey}/details`, 'bucket:read');

    if (bucketData instanceof Error && bucketData.message.includes('404')) {
      bucketData = await this.forgeService.makeRequest('buckets', 'bucket:create', {
        method: 'POST',
        body: {
          bucketKey,
          policyKey: 'transient',
        },
      });
    }

    const result = await this.forgeService.uploadFile(file);
    const data = {
      bucketKey: result.bucketKey,
      objectId: result.objectId,
      filename: result.objectKey,
      size: result.size,
      filepath: result.location,
      mimetype: result.contentType,
    };
    await this.prismaService.files.create({
      data: data,
    });

    return {
      message: 'File uploaded successfully',
      data: result,
    };
  }
}

export class ConvertFileCommand {
  constructor(public readonly urn: string) {}
}

@CommandHandler(ConvertFileCommand)
export class ConvertFileCommandHandler
  implements ICommandHandler<ConvertFileCommand>
{
  constructor(
    private readonly forgeService: ForgeService,
    private readonly prismaService: PrismaService
  ) {}

  async execute(command: ConvertFileCommand) {
    const { urn } = command;
    const fileRecord = await this.prismaService.files.findFirst({
      where: { objectId: urn },
    });
    if (!fileRecord) {
      throw new Error('File not found');
    }

    const urnBuffer = UrnConverter.encode(fileRecord.objectId);
    const jobPayload = {
      input: {
        urn: urnBuffer,
      },
      output: {
        formats: [
          {
            type: 'svf',
            views: ['2d', '3d'],
          },
        ],
      },
    };
    const conversionResult = await this.forgeService.makeRequest(
      `designdata/job`,
      'data:read data:write',
      {
        method: 'POST',
        body: jobPayload,
      },
      process.env.AUTODESK_DERIVATIVE_BASE_URL
    );
    if (conversionResult?.urn) {
      const x = await this.prismaService.files.update({
        where: { objectId: fileRecord.objectId },
        data: { manifestUrn: conversionResult.urn },
      });
    }

    return {
      message: 'Conversion job submitted successfully',
      data: conversionResult,
    };
  }
}


