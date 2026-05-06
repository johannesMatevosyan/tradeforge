import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderIdParamDto } from './dto/order-id-param.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @ApiOperation({ summary: 'Get all orders' })
    @ApiOkResponse({
        type: OrderResponseDto,
        isArray: true,
    })
    @Get()
    async findAll(@CurrentUser() user: { id: string }): Promise<OrderResponseDto[]> {
        return this.ordersService.findAll(user.id);
    }

    @ApiOperation({ summary: 'Get one order by id' })
    @ApiOkResponse({
        type: OrderResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid order id format',
    })
    @ApiNotFoundResponse({
        description: 'Order not found',
    })
    @Get(':id')
    async findOne(
      @CurrentUser() user: { id: string },
      @Param() params: OrderIdParamDto,
    ): Promise<OrderResponseDto> {
        return this.ordersService.findOne(user.id, params.id);
    }

    @ApiOperation({ summary: 'Create a new order' })
    @ApiOkResponse({
        type: OrderResponseDto,
    })
    @ApiBadRequestResponse({
        description:
        'Invalid payload, inactive symbol, invalid quantity, invalid price, or wrong order type/price combination',
    })
    @ApiNotFoundResponse({
        description: 'Symbol not found',
    })
    @Post()
    async create(
      @CurrentUser() user: { id: string },
      @Body() payload: CreateOrderDto,
    ): Promise<OrderResponseDto> {
        return this.ordersService.create(user.id, payload);
    }

    @ApiOperation({ summary: 'Cancel an open order' })
    @ApiOkResponse({
        type: OrderResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid order id format or order cannot be cancelled',
    })
    @ApiNotFoundResponse({
        description: 'Order not found',
    })
    @Patch(':id/cancel')
    async cancel(
      @CurrentUser() user: { id: string },
      @Param() params: OrderIdParamDto,
    ): Promise<OrderResponseDto> {
        return this.ordersService.cancel(user.id, params.id);
    }
}
