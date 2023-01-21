import { Loader, Stack } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { AlertError } from "../components/AlertError";
import { BookForm } from "../components/BookForm";
import { Layout } from "../components/Layout";
import { trpc } from "../utils/trpc";

const BookISBNPage: NextPage = () => {
  const router = useRouter();
  const isbn = router.query.isbn as string;

  const query = trpc.getBook.useQuery({ isbn }, { enabled: Boolean(isbn) });

  return (
    <Layout py="xl">
      <Stack spacing="xl">
        {query.isLoading && <Loader />}
        {query.error && <AlertError message={query.error.message} />}
        {query.data && <BookForm data={query.data} />}
      </Stack>
    </Layout>
  );
};

export default BookISBNPage;
