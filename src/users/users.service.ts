import { Injectable } from '@nestjs/common';
import { CreateUserDto  } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as crypto from "crypto"

@Injectable()
export class UsersService {
  users: Array<User>;
  constructor() {
    this.users = [];
  }
  create(data: User): string {
    data._id = crypto.randomBytes(12).toString("hex")
    data.rol = data.rol ?? "User"
    this.users.push(data)
    return data._id
  }

  findAll() {
   return this.users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
