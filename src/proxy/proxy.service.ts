import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class ProxyService {
  async fetchAndModifyContent(urlString: string): Promise<string> {
    let browser;
    try {
      // Validate the URL
      const validatedUrl = this.validateUrl(urlString);
      if (!validatedUrl) {
        throw new HttpException('Invalid URL', HttpStatus.BAD_REQUEST);
      }

      // Launch Puppeteer in headless mode
      browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Go to the specified URL
      await page.goto(validatedUrl, { waitUntil: 'networkidle0' });

      // Get the fully rendered HTML content after JavaScript execution
      const modifiedContent = await page.evaluate(() => {
        // Function to modify only text nodes
        const modifyTextNodes = (element: HTMLElement) => {
          const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
          );
          let node;
          while ((node = walker.nextNode())) {
            // Modify text content
            if (node.nodeValue) {
              node.nodeValue = node.nodeValue.replace(
                /\b\w{6}\b/g,
                (word) => `${word}™`,
              );
            }
          }
        };

        // Apply text modification to the whole document body
        modifyTextNodes(document.body);

        // Return the modified HTML
        return document.documentElement.outerHTML;
      });

      // Return the modified HTML
      return modifiedContent;
    } catch (error) {
      console.error('Error fetching or modifying content:', error.message);
      throw new HttpException(
        'Failed to fetch and modify content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      // Ensure the browser is closed in case of error
      if (browser) {
        await browser.close();
      }
    }
  }

  private validateUrl(urlString: string): string | null {
    try {
      const parsedUrl = new URL(urlString);
      // Ensure the URL starts with http or https
      if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
        return urlString;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
