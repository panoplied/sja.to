import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';

import { prisma } from '../../../db/prisma-client';

export const appRouter = trpc
  .router()
  .query("fetchUrl", {
    input: z.object({ slug: z.string() }),
    async resolve({ input }) {
      const urlCount = await prisma.Url.count({
        where: {
          slug: {
            equals: input.slug,
          },
        },
      });
      return { used: urlCount > 0 };
    },
  })
  .mutation("addUrl", {
    input: z.object({ slug: z.string(), url: z.string() }),
    async resolve({ input }) {
      try {
        await prisma.Url.create({
          data: {
            slug: input.slug,
            url: input.url,
          },
        });
      } catch (err) {
        console.error(err);
      }
    },
  });

  // export type definition of API
  export type AppRouter = typeof appRouter;

  // export API handler
  export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: () => null,
  });