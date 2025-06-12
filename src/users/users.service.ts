import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserType, UserSchema } from './users.model';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private UserModel: Model<UserType>) {}

  async create(data: User): Promise<Types.ObjectId> {
    const one = await this.UserModel.create(data);
    return one._id;
  }

  async findAll() {
    const all = await this.UserModel.find();
    return all;
  }

  async findById(id: String) {
    const one = await this.UserModel.findById(id);
    return one;
  }

  async updateById(id: String, updateUserDto: UpdateUserDto) {
    const one = await this.UserModel.findByIdAndUpdate(id, updateUserDto);
    return one;
  }

  async removeById(id: String) {
    const one = await this.UserModel.findById(id);
    return one;
  }
}
