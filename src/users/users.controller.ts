import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserType } from './users.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: User) {
    try {
      const user = await this.usersService.create(data);
      if (!user) {
        throw new HttpException('not created', 400);
      }
      return 'usuario creado ' + user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      if (users.length === 0) {
        throw new HttpException('not found', 404);
      }
      return users;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findById(id);
      if (!user) {
        throw new HttpException('not found', 404);
      }
      return user;
    } catch (error) {
      throw new HttpException('not found', 404);
    }
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersService.updateById(id, updateUserDto);
      if (!user) {
        throw new HttpException('not found', 404);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const user = await this.usersService.removeById(id);
      if (!user) {
        throw new HttpException('not found', 404);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
