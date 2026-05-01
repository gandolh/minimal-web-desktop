import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class DockerService {
  constructor(private readonly db: DbService) {}
}
