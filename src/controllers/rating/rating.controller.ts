import { Body, Controller, Get, Post } from '@nestjs/common';
import { RatingService } from 'src/providers/services/rating.service';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post('create')
  async submitRating(@Body() createRatingDto: any) {
    return this.ratingService.submitRating(createRatingDto);
  }

  @Get('fetch')
  async getRatings(@Body() gameTitleId: string) {
    return this.ratingService.getRatings(gameTitleId);
  }
}
