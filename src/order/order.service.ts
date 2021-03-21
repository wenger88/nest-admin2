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

  async chart() {
    return this.orderRepository.query(`
    SELECT DATE_FORMAT(o.created_at, '%Y-%m-%d') as date, sum(i.price * i.quantity) as sum
    FROM orders o 
    JOIN order_items i on o.id = i.order_id 
    GROUP BY date;
    `);
  }
}
