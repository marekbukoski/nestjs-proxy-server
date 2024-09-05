# Proxy Service for NestJS

This project provides a NestJS-based proxy server that modifies the text content of pages from specified websites. It is designed to:

- Add the "™" symbol to each six-letter word on the pages.
- Ensure that the original site's functionality, including JavaScript, CSS, and images, remains intact.
- Redirect internal navigation links to the proxy server.

## Features

- Proxy server to fetch and modify web page content.
- Preserve JavaScript, CSS, and images functionality.
- Modify text content while preserving original site functionality.
- Redirect internal site links through the proxy server.

## Requirements

- Node.js 20.x or later
- NestJS
- Puppeteer
- Jest for testing

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd your-repo
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

## Configuration

1. **Create a `.env` File**

    Create a `.env` file in the root directory of your project and add the following environment variables:

   ```bash
   PROXY_TARGET=https://docs.nestjs.com
   ```

2. **Configure Environment Variables**

    NestJS automatically loads environment variables from the .env file. Make sure to include these variables in your NestJS configuration.


## Usage

### Starting the Application

Run the following command to start the NestJS application:

   ```bash
   npm run start
   ```
The application will start a server, and you can access the proxy through the defined routes.

### Example Usage

To access a specific page such as `/websockets/gateways`, navigate to:

   ```bash
   http://localhost:3000/websockets/gateways
   ```
This will proxy and modify the content of `https://docs.nestjs.com/websockets/gateways`.


## Testing

Unit tests for the proxy service are written using Jest. To run the unit tests, use the following command:

   ```bash
   npm run test
   ```


## Docker Setup

A Docker container is included for easy deployment. To build and run the Docker container:

1. **Build the Docker Image**

   ```bash
   docker build -t proxy-service .
   ```
  
2. **Run the Docker Container**

   ```bash
   docker run -p 3000:3000 --env-file .env proxy-service
   ```


## License

This project is licensed under the MIT License.
