import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPasswordHelper } from '@/helpers/util';
import { ChangePasswordAuthDto, CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService
  ) { }

  isEmailExist = async (email: string) => {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return !!user;
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;

    const isExist = await this.isEmailExist(email);
    if (isExist === true) {
      throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng sử dụng email khác.`)
    }

    const hashPassword = await hashPasswordHelper(password);
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        phone,
        address,
        image
      }
    })
    return {
      _id: user.id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const skip = (current - 1) * pageSize;

    const [totalItems, results] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          image: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems
      },
      results
    }
  }

  async findOne(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      image: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new BadRequestException(`User với ID ${id} không tồn tại`);
  }

  return user;
}

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async update(updateUserDto: UpdateUserDto) {
    const { _id, ...data } = updateUserDto;
    return await this.prisma.user.update({
      where: { id: _id },
      data
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id }
    });
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;

    const isExist = await this.isEmailExist(email);
    if (isExist === true) {
      throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng sử dụng email khác.`)
    }

    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        isActive: false,
        codeId: codeId,
        codeExpired: dayjs().add(5, 'minutes').toDate()
      }
    })

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account at @hoidanit',
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })

    return {
      _id: user.id
    }
  }

  async handleActive(data: CodeAuthDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: data._id,
        codeId: data.code
      }
    })
    
    if (!user) {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }

    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      await this.prisma.user.update({
        where: { id: data._id },
        data: { isActive: true }
      })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }
  }

  async retryActive(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    if (user.isActive) {
      throw new BadRequestException("Tài khoản đã được kích hoạt")
    }

    const codeId = uuidv4();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        codeId: codeId,
        codeExpired: dayjs().add(5, 'minutes').toDate()
      }
    })

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account at @hoidanit',
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return { _id: user.id }
  }

  async retryPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }

    const codeId = uuidv4();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        codeId: codeId,
        codeExpired: dayjs().add(5, 'minutes').toDate()
      }
    })

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Change your password account at @hoidanit',
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return { _id: user.id, email: user.email }
  }

  async changePassword(data: ChangePasswordAuthDto) {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException("Mật khẩu/xác nhận mật khẩu không chính xác.")
    }

    const user = await this.prisma.user.findUnique({ where: { email: data.email } });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }

    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      const newPassword = await hashPasswordHelper(data.password);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: newPassword }
      })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }
  }
}
