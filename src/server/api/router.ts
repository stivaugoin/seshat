import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "./trpc";

const createSchema = z.object({
  authors: z.array(z.string()),
  description: z.string().optional().nullable(),
  isbn: z.string(),
  pages: z.number().optional().nullable(),
  publishedYear: z.number().optional().nullable(),
  title: z.string(),
});

export const appRouter = createTRPCRouter({
  create: privateProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const book = ctx.prisma.book.create({
        data: input,
      });

      return book;
    }),

  getBook: privateProcedure
    .input(z.object({ isbn: z.string() }))
    .query(({ ctx, input }) => {
      const book = ctx.prisma.book.findUniqueOrThrow({
        where: { isbn: input.isbn },
      });

      return book;
    }),

  getBooks: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.book.findMany({ orderBy: { createdAt: "desc" } });
  }),

  search: privateProcedure
    .input(
      z.union([z.object({ isbn: z.string() }), z.object({ query: z.string() })])
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Search in Google API
      // TODO: Add language restriction to improve results

      const q = "isbn" in input ? `isbn:${input.isbn}` : input.query;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&fields=items(volumeInfo)`;
      const result: GoogleApiResponse = await fetch(url).then((res) =>
        res.json()
      );

      if (!result || !result.items || result.items.length === 0) {
        return [];
      }

      // 2. Filter results to keep only books with ISBN and keep only 10 first results
      const resultWithIsbn = result.items
        .filter(
          (item) => createSchema.safeParse(formatGoogleApiBook(item)).success
        )
        .slice(0, 10);

      // 3. Find books in database with these ISBNs
      const allIsbn = resultWithIsbn.map(getIsbnFromGoogleApiBook) as string[];

      const booksInDatabase = await ctx.prisma.book.findMany({
        where: { isbn: { in: allIsbn } },
      });

      // 4. Return books with source
      const books = resultWithIsbn.map((item) => {
        const isbn = getIsbnFromGoogleApiBook(item) as string;

        const bookInDatabase = booksInDatabase.find(
          (book) => book.isbn === isbn
        );

        if (bookInDatabase) {
          return {
            book: bookInDatabase,
            source: "database" as const,
          };
        }

        return {
          book: formatGoogleApiBook(item),
          source: "googleApi" as const,
        };
      });

      return books;
    }),

  update: privateProcedure
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

function getIsbnFromGoogleApiBook(item: GoogleApiBook) {
  return item.volumeInfo.industryIdentifiers.find(
    ({ type }) => type === "ISBN_13"
  )?.identifier;
}

function formatGoogleApiBook(item: GoogleApiBook) {
  return {
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors,
    description: item.volumeInfo.description,
    isbn: getIsbnFromGoogleApiBook(item),
    pages: item.volumeInfo.pageCount,
    publishedYear: new Date(item.volumeInfo.publishedDate).getFullYear(),
  };
}
