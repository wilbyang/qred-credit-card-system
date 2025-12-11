import { TRPCError } from '@trpc/server';
import { getMockData } from './data';

/**
 * Middleware: provide access to mock data
 * Passes mock data into procedures via context
 */

export interface MockContext {
  useMock: boolean;
  mockData: ReturnType<typeof getMockData>;
}

/**
 * Create mock context
 */
export const createMockContext = (): MockContext => {
  const useMock = process.env.USE_MOCK === 'true';
  return {
    useMock,
    mockData: getMockData(),
  };
};

/**
 * Mock data provider helper class
 * Used by procedures to access mock data
 */
export class MockProvider {
  constructor(private mockData: ReturnType<typeof getMockData>) {}

  /**
   * Get all mock companies
   */
  getAllCompanies() {
    return this.mockData.companies;
  }

  /**
   * Get company by ID
   */
  getCompanyById(id: string) {
    const company = this.mockData.companies.find((c) => c.id === id);
    if (!company) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Company not found',
      });
    }
    return company;
  }

  /**
   * Get cards for a company
   */
  getCardsByCompany(companyId: string) {
    const company = this.getCompanyById(companyId); // validate company exists
    const cards = this.mockData.cards.get(companyId);
    return cards || [];
  }

  /**
   * Get card by ID
   */
  getCardById(cardId: string) {
    for (const cards of this.mockData.cards.values()) {
      const card = cards.find((c) => c.id === cardId);
      if (card) return card;
    }
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Card not found',
    });
  }

  /**
   * Get transactions for a card
   */
  getTransactionsByCard(cardId: string, limit: number = 10, offset: number = 0) {
    // validate card exists
    this.getCardById(cardId);

    const transactions = this.mockData.transactions.get(cardId) || [];
    const paginatedTransactions = transactions.slice(offset, offset + limit);

    return {
      transactions: paginatedTransactions,
      total: transactions.length,
      limit,
      offset,
    };
  }
}

/**
 * Create a mock provider instance
 */
export const createMockProvider = (mockData: ReturnType<typeof getMockData>) => {
  return new MockProvider(mockData);
};
