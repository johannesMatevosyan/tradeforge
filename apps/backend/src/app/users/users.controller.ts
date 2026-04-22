import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserRole } from "@tradeforge/shared-types";
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UpdateMeDto } from "./dto/update-me.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    getMe(@CurrentUser() user: { id: string; email: string; name: string, role: UserRole }) {
        return user;
    }

    @Get()
    @Roles(UserRole.ADMIN)
    findAll() {
        return this.usersService.findAll();
    }

    @Patch('me')
    updateMe(
        @CurrentUser() user: { id: string },
        @Body() dto: UpdateMeDto,
    ) {
        return this.usersService.updateMe(user.id, dto);
    }

    @Patch('me/password')
    updatePassword(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdatePasswordDto,
    ) {
        return this.usersService.updatePassword(user.id, dto);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    update(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
    ) {
        return this.usersService.update(id, dto);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    updateByAdmin(
        @CurrentUser() currentUser: { id: string; role: UserRole },
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
    ) {
        return this.usersService.updateByAdmin(currentUser.id, id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
