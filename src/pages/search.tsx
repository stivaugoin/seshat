import { Button, Divider, Loader, Stack, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import type { FormEvent } from "react";
import { AlertError } from "../components/AlertError";
import { BookView } from "../components/BookView";
import { Layout } from "../components/Layout";
import type { RouterOutputs } from "../utils/trpc";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const search = trpc.search.useMutation();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = e.currentTarget.search.value as string;

    await search.mutateAsync(
      isIsbn(value) ? { isbn: value } : { query: value }
    );
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
        {search.data?.length === 0 && <AlertError message="No results" />}
        {search.data?.length ? <Result data={search.data} /> : ""}
      </Stack>
    </Layout>
  );
};

export default Home;

function Result({ data }: { data: RouterOutputs["search"] }) {
  const router = useRouter();
  const addBook = trpc.create.useMutation();

  const handleClickAdd = async ({ isbn }: { isbn: string }) => {
    if (!data || data.length === 0) return;
    const book = data.find(({ book }) => book.isbn === isbn)?.book;
    if (!book) return;

    const newBook = await addBook.mutateAsync({
      authors: book.authors,
      description: book.description,
      isbn: book.isbn,
      pages: book.pages,
      publishedYear: book.publishedYear,
      title: book.title,
    });

    showNotification({
      color: "green",
      message: `${newBook.title} has been added to your bookshelf`,
      title: "Book added",
    });

    router.push(`/${newBook.isbn}`);
  };

  return (
    <>
      {addBook.error && <AlertError message={addBook.error.message} />}

      {data.map(({ book, source }) => (
        <Stack key={book.isbn}>
          <BookView book={book} />

          {source === "database" && (
            <Button
              color="gray"
              leftIcon={<IconView />}
              onClick={() => router.push(`/${book?.isbn}`)}
              variant="outline"
              radius="xl"
            >
              View in bookshelf
            </Button>
          )}

          {source === "googleApi" && (
            <Button
              leftIcon={<IconAdd />}
              loading={addBook.isLoading}
              onClick={() => handleClickAdd({ isbn: book.isbn })}
              radius="xl"
              variant="outline"
            >
              Add to bookshelf
            </Button>
          )}

          <Divider />
        </Stack>
      ))}
    </>
  );
}

function isIsbn(value: string) {
  return value.length === 13 && !isNaN(Number(value));
}

function IconView() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      style={{ height: "1rem", width: "1rem" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function IconAdd() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      style={{ height: "1rem", width: "1rem" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}
