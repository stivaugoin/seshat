import {
  Button,
  Code,
  Loader,
  NumberInput,
  Rating,
  Stack,
} from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { AlertError } from "../components/AlertError";
import { Layout } from "../components/Layout";
import { api } from "../utils/api";

const BookISBNPage: NextPage = () => {
  const router = useRouter();
  const isbn = router.query.isbn as string;

  const query = api.getBook.useQuery(
    { isbn: router.query.isbn as string },
    { enabled: Boolean(router.query.isbn) }
  );

  return (
    <Layout py="xl">
      <Stack spacing="xl">
        {query.isLoading && <Loader />}
        {query.error && <AlertError message={query.error.message} />}
        {query.data && (
          <>
            <Code block>{JSON.stringify(query.data, null, 4)}</Code>

            <Form
              isbn={isbn}
              rating={query.data.rating}
              readYear={query.data.readYear}
            />
          </>
        )}
      </Stack>
    </Layout>
  );
};

export default BookISBNPage;

function Form({
  isbn,
  rating,
  readYear,
}: {
  isbn: string;
  rating: number | null | undefined;
  readYear: number | null | undefined;
}) {
  const update = api.update.useMutation();
  const apiCtx = api.useContext();

  const [localRating, setLocalRating] = useState(rating);
  const [localReadYear, setLocalReadYear] = useState(readYear);

  const handleClickSave = async () => {
    await update.mutateAsync({
      isbn,
      rating: localRating,
      readYear: localReadYear,
    });

    apiCtx.getBook.invalidate({ isbn });
  };

  return (
    <form>
      <Stack spacing="xl">
        <NumberInput
          defaultValue={readYear ?? undefined}
          max={new Date().getFullYear()}
          name="readYear"
          onChange={setLocalReadYear}
        />

        <Rating
          defaultValue={rating ?? undefined}
          name="rating"
          onChange={setLocalRating}
          size="lg"
        />

        <Button
          loading={update.isLoading}
          onClick={handleClickSave}
          type="button"
        >
          Save
        </Button>
      </Stack>
    </form>
  );
}
