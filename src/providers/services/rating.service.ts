import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating, RatingDocument } from 'src/models/rating.model';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
  ) {}

  async submitRating(createRatingDto: any): Promise<Rating> {
    const newRating = new this.ratingModel(createRatingDto);
    return newRating.save();
  }

  async getRatings(gameTitleId: string): Promise<Rating[]> {
    return this.ratingModel.find({ gameTitleId }).exec();
  }
}
