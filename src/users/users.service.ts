import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPasswordHelper } from '@/helpers/utils';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, phone, image, address } = createUserDto;
    const isExist = this.userModel.exists({ email });
    if (isExist) {
      throw new BadRequestException(
        `Email ${email} is existed. Please try another email.`,
      );
    }
    const hashPassword = await hashPasswordHelper(password);
    // const createdUser = new this.userModel({
    //   name,
    //   email,
    //   password: hashPassword,
    //   phone,
    //   image,
    //   address,
    // });
    // await createdUser.save();
    // return createdUser;
    const createdUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      image,
      address,
    });
    return createdUser;
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalUsers = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalUsers / pageSize);
    const skip = (current - 1) * pageSize;

    const result = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any)
      .exec();

    return { result, totalPages };
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
