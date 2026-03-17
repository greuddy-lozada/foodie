import { Test, TestingModule } from '@nestjs/testing';
import { KdsController } from './kds.controller';

describe('KdsController', () => {
  let controller: KdsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KdsController],
    }).compile();

    controller = module.get<KdsController>(KdsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
