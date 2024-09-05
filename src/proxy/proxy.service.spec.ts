import { Test, TestingModule } from '@nestjs/testing';
import { ProxyService } from './proxy.service';
import puppeteer from 'puppeteer';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('puppeteer');
const mockPage = {
  goto: jest.fn(),
  evaluate: jest.fn(),
  close: jest.fn(),
};
const mockBrowser = {
  newPage: jest.fn(() => Promise.resolve(mockPage)),
  close: jest.fn(),
};

describe('ProxyService', () => {
  let service: ProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProxyService],
    }).compile();

    service = module.get<ProxyService>(ProxyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should modify six-letter words with ™ symbol', async () => {
    const testContent =
      '<html><body>This is a sample sentence with nested and values</body></html>';

    // Mocking Puppeteer
    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser as any);
    mockPage.goto.mockResolvedValue(undefined);
    mockPage.evaluate.mockResolvedValue(
      '<html><body>This is a sample sentence with nested™ and values</body></html>',
    );

    const result = await service.fetchAndModifyContent('https://example.com');
    expect(result).toContain('nested™');
    expect(mockPage.evaluate).toHaveBeenCalled();
  });

  it('should handle errors during fetch and modification', async () => {
    // Simulate an error during Puppeteer launch
    (puppeteer.launch as jest.Mock).mockRejectedValue(
      new Error('Puppeteer launch failed'),
    );

    await expect(
      service.fetchAndModifyContent('https://example.com'),
    ).rejects.toThrow(
      new HttpException(
        'Failed to fetch and modify content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
