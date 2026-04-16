import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderIdParamDto } from './dto/order-id-param.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @ApiOperation({ summary: 'Get all orders' })
    @ApiOkResponse({ type: OrderResponseDto, isArray: true })
    @Get()
    async findAll(): Promise<OrderResponseDto[]> {
        return this.ordersService.findAll();
    }

    @ApiOperation({ summary: 'Get one order by id' })
    @ApiOkResponse({ type: OrderResponseDto })
    @Get(':id')
    async findOne(@Param() params: OrderIdParamDto): Promise<OrderResponseDto> {
        return this.ordersService.findOne(params.id);
    }

    @ApiOperation({ summary: 'Create a new order' })
    @ApiOkResponse({ type: OrderResponseDto })
    @Post()
    async create(@Body() payload: CreateOrderDto): Promise<OrderResponseDto> {
        return this.ordersService.create(payload);
    }

    @ApiOperation({ summary: 'Cancel an open order' })
    @ApiOkResponse({ type: OrderResponseDto })
    @Patch(':id/cancel')
    async cancel(@Param() params: OrderIdParamDto): Promise<OrderResponseDto> {
        return this.ordersService.cancel(params.id);
    }
}
