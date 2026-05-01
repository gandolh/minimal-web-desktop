import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class ServicesService {
  constructor(private readonly db: DbService) {}
}
