import { Test, TestingModule } from '@nestjs/testing';
import { ProxyService } from './proxy.service';
import axios from 'axios';
jest.mock('axios');

describe('ProxyService', () => {
    let service: ProxyService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProxyService],
        }).compile();

        service = module.get<ProxyService>(ProxyService);
    });

    it('should modify six-letter words with ™ symbol', async () => {
        const testContent = 'This is a sample sentence with nested and values';
        (axios.get as jest.Mock).mockResolvedValue({ data: testContent });

        const result = await service.fetchAndModifyContent('https://example.com');
        expect(result).toContain('nested™');
    });
});
