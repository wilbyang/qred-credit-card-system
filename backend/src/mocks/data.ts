import { randomUUID } from 'crypto';



const generateId = () => randomUUID();


export const generateMockCompanies = (count: number = 3) => {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    name: `Company ${i + 1}`,
    createdAt: new Date(Date.now() - (count - i) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - (count - i - 1) * 12 * 60 * 60 * 1000),
  }));
};


export const generateMockCards = (companyId: string, count: number = 5) => {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    companyId,
    cardNumber: `4532${Math.random().toString().slice(2, 10)}${i}`,
    status: ['active', 'inactive', 'suspended'][i % 3],
    limit: (i + 1) * 5000,
    currentSpend: Math.floor(Math.random() * 5000),
    currency: 'USD',
    cardImageUrl: `https://via.placeholder.com/400x250?text=Card+${i + 1}`,
    createdAt: new Date(Date.now() - (count - i) * 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - (count - i - 1) * 24 * 60 * 60 * 1000),
  }));
};


export const generateMockCardDetail = (cardData: ReturnType<typeof generateMockCards>[0]) => {
  return {
    ...cardData,
    remainingSpend: cardData.limit - cardData.currentSpend,
  };
};


export const generateMockTransactions = (cardId: string, count: number = 10) => {
  const descriptions = [
    'Office Supplies',
    'Travel Booking',
    'Software Subscription',
    'Hotel Stay',
    'Flight Ticket',
    'Restaurant',
    'Gas Station',
    'Internet Service',
    'Equipment Purchase',
    'Training Course',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    cardId,
    description: descriptions[i % descriptions.length],
    amount: Math.floor(Math.random() * 2000) + 50,
    dataPoints: `transaction-${i + 1}`,
    date: new Date(Date.now() - (count - i) * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - (count - i) * 24 * 60 * 60 * 1000),
  }));
};


let mockDataCache: {
  companies: ReturnType<typeof generateMockCompanies>;
  cards: Map<string, ReturnType<typeof generateMockCards>>;
  transactions: Map<string, ReturnType<typeof generateMockTransactions>>;
} | null = null;


export const initializeMockData = () => {
  if (mockDataCache) return mockDataCache;

  const companies = generateMockCompanies(3);
  const cards = new Map<string, ReturnType<typeof generateMockCards>>();
  const transactions = new Map<string, ReturnType<typeof generateMockTransactions>>();

  
  companies.forEach((company) => {
    const companyCards = generateMockCards(company.id, 4);
    cards.set(company.id, companyCards);

    companyCards.forEach((card) => {
      transactions.set(card.id, generateMockTransactions(card.id, 8));
    });
  });

  mockDataCache = { companies, cards, transactions };
  return mockDataCache;
};


export const getMockData = () => {
  if (!mockDataCache) {
    initializeMockData();
  }
  return mockDataCache!;
};


export const resetMockData = () => {
  mockDataCache = null;
  initializeMockData();
};
