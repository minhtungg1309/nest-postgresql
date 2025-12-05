import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { ElasticsearchModule } from '@/elasticsearch/elasticsearch.module';

@Module({
  imports: [PrismaModule, ElasticsearchModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }