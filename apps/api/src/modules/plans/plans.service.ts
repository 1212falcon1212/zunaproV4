import { Injectable } from '@nestjs/common';
import { masterPrisma } from '@zunapro/db';

@Injectable()
export class PlansService {
  async findAll() {
    return masterPrisma.plan.findMany({
      orderBy: { price: 'asc' },
    });
  }
}
