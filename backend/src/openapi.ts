import { generateOpenApiDocument } from 'trpc-openapi';
import { appRouter } from './router';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Qred Credit Card Management API',
  version: '1.0.0',
  description: 'API for managing credit cards, companies, and transactions',
  baseUrl: 'http://localhost:3000/api/rest',
  tags: ['Companies', 'Cards', 'Transactions'],
});
