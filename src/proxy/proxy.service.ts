import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { JSDOM } from 'jsdom';

@Injectable()
export class ProxyService {
    async fetchAndModifyContent(url: string): Promise<string> {
        try {
            // Fetch the content from the target URL
            const response = await axios.get(url);
            const content = response.data;

            // Parse the HTML content using jsdom
            const dom = new JSDOM(content);
            const { document } = dom.window; // Get the document object from JSDOM
            const NodeFilter = dom.window.NodeFilter;
            // Modify only the text content within the <body> tag
            this.modifyTextNodes(document.body, NodeFilter);


            // Return the modified HTML
            return dom.serialize();
        } catch (error) {
            console.error('Error fetching content:', error.message);
            throw new HttpException('Failed to fetch content', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Helper function to modify only text nodes
    private modifyTextNodes(node: HTMLElement, NodeFilter: any): void {
        const walker = node.ownerDocument.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        let textNode;
        while ((textNode = walker.nextNode())) {
            // Modify six-letter words in the text node
            textNode.nodeValue = textNode.nodeValue.replace(/\b\w{6}\b/g, (word) => `${word}™`);
        }
    }
}
