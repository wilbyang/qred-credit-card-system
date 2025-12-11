import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '../db';

const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const companyRouter = router({
  getAll: publicProcedure
    .meta({ openapi: { method: 'GET', path: '/companies', tags: ['Companies'], summary: 'Get all companies' } })
    .input(z.void())
    .output(z.array(CompanySchema))
    .query(async ({ ctx }) => {
      return ctx.executor.execute(
        // Mock implementation
        () => ctx.mockProvider.getAllCompanies(),
        // Real implementation
        () => prisma.company.findMany({ orderBy: { createdAt: 'desc' } }),
      );
    }),

  getById: publicProcedure
    .meta({ openapi: { method: 'GET', path: '/companies/{id}', tags: ['Companies'], summary: 'Get company by ID' } })
    .input(z.object({ id: z.string().uuid() }))
    .output(CompanySchema)
    .query(async ({ input, ctx }) => {
      return ctx.executor.execute(
        // Mock implementation
        () => ctx.mockProvider.getCompanyById(input.id),
        // Real implementation
        async () => {
          const company = await prisma.company.findUnique({
            where: { id: input.id },
          });
          if (!company) {
            throw new Error('Company not found');
          }
          return company;
        },
      );
    }),
});
