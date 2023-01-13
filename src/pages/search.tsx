import { Button, Code, Loader, Stack, TextInput } from "@mantine/core";
import type { inferRouterOutputs } from "@trpc/server";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import type { FormEvent } from "react";
import { AlertError } from "../components/AlertError";
import { Layout } from "../components/Layout";
import type { AppRouter } from "../server/api/router";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const search = api.search.useMutation();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isbn = e.currentTarget.search.value as string;
    await search.mutateAsync({ isbn });
  };

  return (
    <Layout py="xl">
      <Stack spacing="xl">
        <form method="post" onSubmit={handleSearch}>
          <TextInput
            name="search"
            placeholder="Search book by ISBN"
            size="lg"
            type="search"
          />
        </form>

        {search.isLoading && <Loader />}
        {search.error && <AlertError message={search.error.message} />}
        {search.data && <Result data={search.data} />}
      </Stack>
    </Layout>
  );
};

export default Home;

function Result({ data }: { data: inferRouterOutputs<AppRouter>["search"] }) {
  const router = useRouter();
  const addBook = api.create.useMutation();

  const handleClickAdd = async () => {
    if (!data.book) return;
    const { book } = data;

    const { isbn } = await addBook.mutateAsync({
      authors: book.authors,
      description: book.description,
      isbn: book.isbn,
      pages: book.pages,
      publishedYear: book.publishedYear,
      title: book.title,
    });

    router.push(`/book/${isbn}`);
  };

  if (data.status === "notFound") {
    return <AlertError message="Book not found" />;
  }

  if (data.status === "tooManyResults") {
    return <AlertError message="Too many results" />;
  }

  if (!data.book) {
    return <AlertError message="Something went wrong" />;
  }

  return (
    <>
      {addBook.error && <AlertError message={addBook.error.message} />}

      <Code block>{JSON.stringify(data, null, 4)}</Code>

      {data.source === "database" && (
        <Button onClick={() => router.push(`/books/${data.book?.isbn}`)}>
          View in bookshelf
        </Button>
      )}

      {data.source === "googleApi" && (
        <Button loading={addBook.isLoading} onClick={handleClickAdd}>
          Add to bookshelf
        </Button>
      )}
    </>
  );
}
