import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class BookmarksService {
  constructor(private readonly db: DbService) {}
}
