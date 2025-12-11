import { initTRPC } from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';
import { z } from 'zod';
import { createMockContext } from './mocks/provider';
import { createMockProvider } from './mocks/provider';
import { createDualExecutor } from './mocks/executor';

export type Context = ReturnType<typeof createContext>;

/**
 * create tRPC context，for mock data support
 */
export const createContext = () => {
  const mockContext = createMockContext();
  const mockProvider = createMockProvider(mockContext.mockData);
  const executor = createDualExecutor(mockContext.useMock, mockProvider);

  return {
    ...mockContext,
    mockProvider,
    executor,
  };
};

export const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
