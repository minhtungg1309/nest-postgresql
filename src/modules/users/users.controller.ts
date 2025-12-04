import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query("query") query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
  ) {
    return this.usersService.findAll(query, +current, +pageSize);
  }

  // Endpoint tìm kiếm với Elasticsearch
  @Get('search')
  searchUsers(
    @Query('q') query: string,
    @Query('current') current: string = '1',
    @Query('pageSize') pageSize: string = '10',
    @Query('isActive') isActive?: string,
    @Query('address') address?: string,
  ) {
    const filters: any = {};
    
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    
    if (address) {
      filters.address = address;
    }

    return this.usersService.searchUsers(query, +current, +pageSize, filters);
  }

  // Endpoint migrate users to Elasticsearch
  @Post('migrate-to-elasticsearch')
  migrateToElasticsearch() {
    return this.usersService.migrateUsersToElasticsearch();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
