import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app/app.controller';
import { AppService } from '../providers/services/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/config/configuration';
import * as Joi from 'joi';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';
import { MongooseModule } from '@nestjs/mongoose';

import { GameTitleModule } from './gametitle.module';
import { AuctionModule } from './auctions.module';
import { PaymentModule } from './payment.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { UploadsModule } from './uploads.module';
import { RatingModule } from './rating.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, //join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
    }),
    AuthModule,
    RatingModule,
    GameTitleModule,
    AuctionModule,
    UploadsModule,
    PaymentModule,
    UserModule,
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'staging')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_USER: Joi.string(),
        DATABASE_PASSWORD: Joi.string(),
        DATABASE_HOST: Joi.string(),
        DATABASE_PORT: Joi.string(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    MongooseModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],

      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('database.dbURI'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AppController,
    //  BlockchainController
  ],
  providers: [
    AppService,
    //  BlockchainService
  ],
})
export class AppModule {}
