import { router } from './trpc';
import { companyRouter } from './routers/company';
import { cardRouter } from './routers/card';
import { transactionRouter } from './routers/transaction';

export const appRouter = router({
  company: companyRouter,
  card: cardRouter,
  transaction: transactionRouter,
});

export type AppRouter = typeof appRouter;
