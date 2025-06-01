import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTrackDto } from '../models/dtos/update-track.dto';
import { UpdateTrackRepository } from '../repositories/update-track.repository';
import { Track } from '@prisma/client';
import { LoadTrackByIdRepository } from '../repositories/load-track-by-id.repository';

@Injectable()
export class UpdateTrackService {
  constructor(
    private readonly updateTrackRepository: UpdateTrackRepository,
    private readonly loadTrackByIdRepository: LoadTrackByIdRepository,
  ) {}

  async update(
    trackId: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    const track = await this.loadTrackByIdRepository.load(trackId);

    if (!track) {
      throw new NotFoundException({
        message: 'Track not found',
        source: UpdateTrackService.name,
      });
    }

    return this.updateTrackRepository.update(trackId, updateTrackDto);
  }
}
