// image.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async save(file: Express.Multer.File) {
    const image = this.imageRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: `/uploads/${file.filename}`,
    });
    return await this.imageRepository.save(image);
  }

  async findAll() {
    return await this.imageRepository.find({
      order: { uploadedAt: 'DESC' },
    });
  }
}
