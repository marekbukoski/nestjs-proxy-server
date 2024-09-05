import { Controller, Get, Req, Res } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('*')
  async proxyRequest(@Req() req: Request, @Res() res: Response) {
    const targetUrl = process.env.PROXY_TARGET + req.url;

    // Fetch and modify the content
    const content = await this.proxyService.fetchAndModifyContent(targetUrl);

    // Replace internal links to point to the proxy server
    const proxyUrl = `${req.protocol}://${req.get('host')}`;
    const modifiedContent = content.replace(
      new RegExp(process.env.PROXY_TARGET, 'g'),
      proxyUrl,
    );

    res.send(modifiedContent);
  }
}
