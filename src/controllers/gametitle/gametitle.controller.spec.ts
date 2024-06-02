import { Test, TestingModule } from '@nestjs/testing';
import { GametitleController } from './gametitle.controller';

describe('GametitleController', () => {
  let controller: GametitleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GametitleController],
    }).compile();

    controller = module.get<GametitleController>(GametitleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
