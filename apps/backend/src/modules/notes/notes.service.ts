import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { join, resolve, relative } from 'path';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import { UpsertRecentDto } from './dto/upsert-recent.dto';
import { CreateFileDto, UpdateFileDto } from './dto/file-ops.dto';
import { CreateDirectoryDto } from './dto/directory-ops.dto';

@Injectable()
export class NotesService {
  private readonly notesRoot: string;

  constructor(private readonly db: DbService) {
    this.notesRoot = resolve(process.cwd(), 'data/notes');
  }

  private getSafePath(relativePath: string): string {
    const safePath = resolve(this.notesRoot, relativePath.startsWith('/') ? relativePath.substring(1) : relativePath);
    if (!safePath.startsWith(this.notesRoot)) {
      throw new BadRequestException('Invalid path');
    }
    return safePath;
  }

  async list(path: string = '') {
    const fullPath = this.getSafePath(path);
    if (!existsSync(fullPath)) throw new NotFoundException('Directory not found');
    
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    return entries.map(entry => ({
      name: entry.name,
      path: relative(this.notesRoot, join(fullPath, entry.name)),
      type: entry.isDirectory() ? 'directory' : 'file',
    }));
  }

  async readFile(path: string) {
    const fullPath = this.getSafePath(path);
    if (!existsSync(fullPath)) throw new NotFoundException('File not found');
    const content = await fs.readFile(fullPath, 'utf-8');
    return { path, content };
  }

  async createFile(dto: CreateFileDto) {
    const fullPath = this.getSafePath(dto.path);
    if (existsSync(fullPath)) throw new BadRequestException('File already exists');
    await fs.writeFile(fullPath, dto.content ?? '');
    return { path: dto.path, content: dto.content ?? '' };
  }

  async updateFile(dto: UpdateFileDto) {
    const fullPath = this.getSafePath(dto.path);
    if (!existsSync(fullPath)) throw new NotFoundException('File not found');
    await fs.writeFile(fullPath, dto.content);
    return { path: dto.path, content: dto.content };
  }

  async deleteFile(path: string) {
    const fullPath = this.getSafePath(path);
    if (!existsSync(fullPath)) throw new NotFoundException('File not found');
    await fs.unlink(fullPath);
  }

  async createDirectory(dto: CreateDirectoryDto) {
    const fullPath = this.getSafePath(dto.path);
    if (existsSync(fullPath)) throw new BadRequestException('Directory already exists');
    await fs.mkdir(fullPath, { recursive: true });
    return { path: dto.path };
  }

  async deleteDirectory(path: string) {
    const fullPath = this.getSafePath(path);
    if (!existsSync(fullPath)) throw new NotFoundException('Directory not found');
    await fs.rm(fullPath, { recursive: true });
  }

  getRecent() {
    return this.db.db
      .prepare('SELECT * FROM recent_files ORDER BY last_opened DESC LIMIT 10')
      .all();
  }

  upsertRecent(dto: UpsertRecentDto) {
    this.db.db
      .prepare(
        `INSERT INTO recent_files (path, last_opened) 
         VALUES (@path, CURRENT_TIMESTAMP)
         ON CONFLICT(path) DO UPDATE SET last_opened = CURRENT_TIMESTAMP`,
      )
      .run({ path: dto.path });
    return { path: dto.path };
  }
}
