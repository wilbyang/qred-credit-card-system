import { TRPCError } from '@trpc/server';
import { MockProvider } from './provider';

/**
 * Execution strategy: choose using mock or real implementation
 */
export type ExecutionStrategy = 'mock' | 'real' | 'auto';

interface ExecutorOptions {
  useMock: boolean;
  mockProvider: MockProvider;
}

/**
 * Generic mock/real data executor
 * Supports auto-switching and canary testing
 */
export class DualExecutor {
  constructor(private options: ExecutorOptions) {}

  /**
   * Execute a query and choose mock or real implementation based on configuration
   * @param mockFn - mock implementation
   * @param realFn - real implementation
   * @param strategy - execution strategy
   */
  async execute<T>(
    mockFn: () => Promise<T> | T,
    realFn: () => Promise<T> | T,
    strategy: ExecutionStrategy = 'auto',
  ): Promise<T> {
    // Determine whether to use mock
    const shouldUseMock =
      strategy === 'mock'
        ? true
        : strategy === 'real'
          ? false
          : this.options.useMock;

    try {
      if (shouldUseMock) {
        return await Promise.resolve(mockFn());
      } else {
        return await Promise.resolve(realFn());
      }
    } catch (error) {
      // If real data source fails and we're in auto mode, fall back to mock
      if (!shouldUseMock && strategy === 'auto') {
        console.warn('[tRPC] Real data source failed, falling back to mock:', error);
        return await Promise.resolve(mockFn());
      }
      throw error;
    }
  }

  /**
   * Execute a mutation operation
   * Note: write operations under mock mode are performed in-memory only
   */
  async executeMutation<T>(
    mockFn: () => Promise<T> | T,
    realFn: () => Promise<T> | T,
  ): Promise<T> {
    if (this.options.useMock) {
      console.info('[tRPC] Using mock data for mutation operation');
      return await Promise.resolve(mockFn());
    }
    return await Promise.resolve(realFn());
  }

  /**
   * Get the mock provider
   */
  getMockProvider(): MockProvider {
    return this.options.mockProvider;
  }
}

/**
 * Create executor factory function
 */
export const createDualExecutor = (
  useMock: boolean,
  mockProvider: MockProvider,
): DualExecutor => {
  return new DualExecutor({ useMock, mockProvider });
};
