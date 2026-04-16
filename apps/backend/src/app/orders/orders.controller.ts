import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderIdParamDto } from './dto/order-id-param.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @ApiOperation({ summary: 'Get all orders' })
    @ApiOkResponse({
        type: OrderResponseDto,
        isArray: true,
    })
    @Get()
    async findAll(): Promise<OrderResponseDto[]> {
        return this.ordersService.findAll();
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
    async findOne(@Param() params: OrderIdParamDto): Promise<OrderResponseDto> {
        return this.ordersService.findOne(params.id);
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
    async create(@Body() payload: CreateOrderDto): Promise<OrderResponseDto> {
        return this.ordersService.create(payload);
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
    async cancel(@Param() params: OrderIdParamDto): Promise<OrderResponseDto> {
        return this.ordersService.cancel(params.id);
    }
}
