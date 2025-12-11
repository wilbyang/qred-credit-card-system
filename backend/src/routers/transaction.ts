import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '../db';

const TransactionSchema = z.object({
  id: z.string().uuid(),
  cardId: z.string().uuid(),
  description: z.string(),
  amount: z.number(),
  dataPoints: z.string(),
  date: z.date(),
  createdAt: z.date(),
});

const TransactionListSchema = z.object({
  transactions: z.array(TransactionSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});

export const transactionRouter = router({
  getByCard: publicProcedure
    .meta({ openapi: { method: 'GET', path: '/transactions', tags: ['Transactions'], summary: 'Get transactions for a card' } })
    .input(
      z.object({
        cardId: z.string().uuid(),
        limit: z.number().optional().default(3),
        offset: z.number().optional().default(0),
      })
    )
    .output(TransactionListSchema)
    .query(async ({ input, ctx }) => {
      return ctx.executor.execute(
        // Mock implementation
        () => ctx.mockProvider.getTransactionsByCard(input.cardId, input.limit, input.offset),
        // Real implementation
        async () => {
          const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
              where: { cardId: input.cardId },
              orderBy: { date: 'desc' },
              take: input.limit,
              skip: input.offset,
            }),
            prisma.transaction.count({
              where: { cardId: input.cardId },
            }),
          ]);

          return {
            transactions,
            total,
            limit: input.limit,
            offset: input.offset,
          };
        },
      );
    }),
});
