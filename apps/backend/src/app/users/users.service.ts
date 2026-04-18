import { Injectable } from '@nestjs/common';
import { UserRole } from '@tradeforge/shared-types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService) {}

    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    findById(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    create(data: { email: string; passwordHash: string; name?: string; role?: UserRole }) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                name: data.name,
                role: data.role ?? UserRole.VIEWER,
            },
        });
    }

    findAll() {
        return this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
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
