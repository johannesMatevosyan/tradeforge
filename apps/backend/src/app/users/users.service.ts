import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@tradeforge/shared-types';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService) {}

    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    findById(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    create(data: {
        email: string;
        passwordHash: string;
        name?: string;
        role?: UserRole
    }) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                name: data.name,
                role: data.role ?? UserRole.VIEWER,

            },
        });
    }

    // explicit for public registration
    createViewer(data: {
        email: string;
        passwordHash: string;
        name?: string;
    }) {
        return this.prisma.user.create({
            data: {
            email: data.email,
            passwordHash: data.passwordHash,
            name: data.name,
            role: UserRole.VIEWER, // hardcoded
            },
        });
    }

    updateMe(userId: string, dto: UpdateMeDto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                name: dto.name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
    }

    async updatePassword(userId: string, dto: UpdatePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isMatch = await bcrypt.compare(
            dto.currentPassword,
            user.passwordHash,
        );

        if (!isMatch) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        const newHash = await bcrypt.hash(dto.newPassword, 10);

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash: newHash,
            },
        });

        return { message: 'Password updated successfully' };
    }

    findAll() {
        return this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async createByAdmin(dto: CreateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true },
        });

        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        return this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                name: dto.name,
                role: dto.role ?? UserRole.VIEWER,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async updateByAdmin(currentUserId: string, userId: string, dto: UpdateUserDto) {
        const existing = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true },
        });

        if (!existing) {
            throw new BadRequestException('User not found');
        }

        if (
            currentUserId === userId &&
            dto.role === UserRole.VIEWER
        ) {
            throw new BadRequestException('You cannot remove your own admin role.');
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: {
            ...(dto.name !== undefined && { name: dto.name }),
            ...(dto.role !== undefined && { role: dto.role }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    update(id: string, data: { name?: string; role?: UserRole }) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    remove(id: string) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
