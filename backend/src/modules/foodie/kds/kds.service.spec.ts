import { Test, TestingModule } from '@nestjs/testing';
import { KdsService } from './kds.service';

describe('KdsService', () => {
  let service: KdsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KdsService],
    }).compile();

    service = module.get<KdsService>(KdsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
