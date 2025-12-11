import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '../db';
import { generateMockCardDetail } from '../mocks/data';

// Shared schemas
const CardSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  cardNumber: z.string(),
  status: z.string(),
  limit: z.number(),
  currentSpend: z.number(),
  currency: z.string(),
  cardImageUrl: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const CardDetailSchema = CardSchema.extend({
  remainingSpend: z.number(),
});

const InvoiceSchema = z.object({
  cardId: z.string().uuid(),
  dueDate: z.date(),
  amount: z.number(),
  currency: z.string(),
  isPaid: z.boolean(),
});

export const cardRouter = router({
  getByCompany: publicProcedure
    .meta({ openapi: { method: 'GET', path: '/cards', tags: ['Cards'], summary: 'Get all cards for a company' } })
    .input(z.object({ companyId: z.string().uuid() }))
    .output(z.array(CardSchema))
    .query(async ({ input, ctx }) => {
      return ctx.executor.execute(
        // Mock implementation
        () => ctx.mockProvider.getCardsByCompany(input.companyId),
        // Real implementation
        () => prisma.card.findMany({
          where: { companyId: input.companyId },
          orderBy: { createdAt: 'desc' },
        }),
      );
    }),

  getById: publicProcedure
    .meta({ openapi: { method: 'GET', path: '/cards/{id}', tags: ['Cards'], summary: 'Get card details' } })
    .input(z.object({ id: z.string().uuid() }))
    .output(CardDetailSchema)
    .query(async ({ input, ctx }) => {
      return ctx.executor.execute(
        // Mock implementation
        () => {
          const card = ctx.mockProvider.getCardById(input.id);
          return generateMockCardDetail(card);
        },
        // Real implementation
        async () => {
          const card = await prisma.card.findUnique({
            where: { id: input.id },
          });
          if (!card) {
            throw new Error('Card not found');
          }
          const remainingSpend = card.limit - card.currentSpend;
          return { ...card, remainingSpend };
        },
      );
    }),

  activate: publicProcedure
    .meta({ openapi: { method: 'POST', path: '/cards/{id}/activate', tags: ['Cards'], summary: 'Activate a credit card' } })
    .input(z.object({ id: z.string().uuid() }))
    .output(CardSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.executor.executeMutation(
        // Mock implementation
        () => {
          const card = ctx.mockProvider.getCardById(input.id);
          if (card.status === 'active') {
            throw new Error('Card already activated');
          }
          return { ...card, status: 'active' };
        },
        // Real implementation
        async () => {
          const card = await prisma.card.findUnique({
            where: { id: input.id },
          });
          if (!card) {
            throw new Error('Card not found');
          }
          if (card.status === 'active') {
            throw new Error('Card already activated');
          }
          return await prisma.card.update({
            where: { id: input.id },
            data: { status: 'active' },
          });
        },
      );
    }),

  getInvoice: publicProcedure
    .meta({ openapi: { method: 'GET', path: '/cards/{id}/invoice', tags: ['Cards'], summary: 'Get invoice information for a card' } })
    .input(z.object({ id: z.string().uuid() }))
    .output(InvoiceSchema.nullable())
    .query(async ({ input, ctx }) => {
      return ctx.executor.execute(
        // Mock implementation
        () => {
          // Generate mock invoice for card
          ctx.mockProvider.getCardById(input.id);
          return {
            cardId: input.id,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            amount: Math.floor(Math.random() * 5000) + 100,
            currency: 'USD',
            isPaid: false,
          };
        },
        // Real implementation
        () => prisma.invoice.findUnique({
          where: { cardId: input.id },
        }),
      );
    }),
});
