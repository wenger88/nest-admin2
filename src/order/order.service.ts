import { Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './models/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService extends AbstractService {
  constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>) {
    super(orderRepository);
  }

  async paginate(page: number = 1, relations = []): Promise<any> {
    const { data, meta } = await super.paginate(page, relations);

    return {
      data: data.map((order: Order) => ({
        id: order.id,
        name: order.name,
        email: order.email,
        created_at: order.created_at,
        total: order.total,
        order_items: order.order_items,
      })),
      meta,
    };
  }
}
