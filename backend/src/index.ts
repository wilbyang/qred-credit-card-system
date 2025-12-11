import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';
import swaggerUi from 'swagger-ui-express';
import { appRouter } from './router';
import { openApiDocument } from './openapi';
import { createContext } from './trpc';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Swagger UI (must come before tRPC middleware)
app.use('/api/docs', swaggerUi.serve);
app.get('/api/docs', swaggerUi.setup(openApiDocument));

// OpenAPI spec endpoint (must come before tRPC middleware)
app.get('/api/openapi.json', (_req, res) => {
  res.json(openApiDocument);
});

// OpenAPI REST endpoints
app.use('/api/rest', createOpenApiExpressMiddleware({ router: appRouter, createContext }));

// tRPC endpoint (must come last for /api/*)
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const mockMode = process.env.USE_MOCK === 'true';
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 tRPC endpoint: http://localhost:${PORT}/api/trpc`);
  console.log(`🔌 REST API: http://localhost:${PORT}/api/rest`);
  console.log(`📖 Swagger UI: http://localhost:${PORT}/api/docs`);
  console.log(`📄 OpenAPI spec: http://localhost:${PORT}/api/openapi.json`);
  console.log(`${mockMode ? '🎭 MOCK MODE ENABLED' : '🗄️  Using real database'}`);
});
