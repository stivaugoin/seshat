import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        authors: z.array(z.string()),
        description: z.string().optional().nullable(),
        isbn: z.string(),
        pages: z.number().optional().nullable(),
        publishedYear: z.number().optional().nullable(),
        title: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const book = ctx.prisma.book.create({
        data: input,
      });

      return book;
    }),

  getBook: publicProcedure
    .input(z.object({ isbn: z.string() }))
    .query(({ ctx, input }) => {
      const book = ctx.prisma.book.findUniqueOrThrow({
        where: { isbn: input.isbn },
      });

      return book;
    }),

  getBooks: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.book.findMany({ orderBy: { createdAt: "desc" } });
  }),

  search: publicProcedure
    .input(z.object({ isbn: z.string() }))
    .output(
      z.object({
        book: z
          .union([
            z.object({
              id: z.string().optional().nullable(),
              title: z.string(),
              authors: z.array(z.string()),
              description: z.string().optional().nullable(),
              isbn: z.string(),
              pages: z.number().optional().nullable(),
              publishedYear: z.number().optional().nullable(),
              rating: z.number().optional().nullable(),
              readYear: z.number().optional().nullable(),
            }),
            z.null(),
          ])
          .optional(),
        source: z.union([z.literal("database"), z.literal("googleApi")]),
        status: z.union([
          z.literal("success"),
          z.literal("notFound"),
          z.literal("tooManyResults"),
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("input", input);
      // 1. Search in database
      const book = await ctx.prisma.book.findUnique({
        where: { isbn: input.isbn },
      });
      console.log("book", book);

      if (book?.id) {
        return {
          book,
          source: "database",
          status: "success",
        };
      }

      // 2. Search in Google API
      const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${input.isbn}&langRestrict=fr`;
      const result: GoogleApiResponse = await fetch(url).then((res) =>
        res.json()
      );

      console.log("result", result);

      if (!result || !result.items || result.items.length === 0) {
        return {
          book: null,
          source: "googleApi",
          status: "notFound",
        };
      }

      if (result.items.length > 1) {
        return {
          book: null,
          source: "googleApi",
          status: "tooManyResults",
        };
      }

      const item = result.items[0] as GoogleApiBook;

      const newBook = {
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        description: item.volumeInfo.description,
        isbn: input.isbn,
        pages: item.volumeInfo.pageCount,
        publishedYear: new Date(item.volumeInfo.publishedDate).getFullYear(),
      };

      return { book: newBook, status: "success", source: "googleApi" };
    }),

  update: publicProcedure
    .input(
      z.object({
        isbn: z.string(),
        rating: z.number().optional().nullable(),
        readYear: z.number().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const book = ctx.prisma.book.update({
        where: { isbn: input.isbn },
        data: input,
      });

      return book;
    }),
});

export type AppRouter = typeof appRouter;

type GoogleApiResponse = {
  kind: string;
  totalItems: number;
  items: GoogleApiBook[];
};

type GoogleApiBook = {
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    industryIdentifiers: {
      type: string;
      identifier: string;
    }[];
    pageCount: number;
    publishedDate: string;
  };
};
