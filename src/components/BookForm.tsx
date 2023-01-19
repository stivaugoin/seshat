import {
  Button,
  Group,
  MultiSelect,
  NumberInput,
  Rating,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Book } from "@prisma/client";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../server/api/router";
import { api } from "../utils/api";

export function BookForm({
  data,
}: {
  data: inferRouterOutputs<AppRouter>["getBook"];
}) {
  const update = api.update.useMutation();
  const apiCtx = api.useContext();

  const form = useForm({
    initialValues: data,
  });

  async function handleSubmit(values: Book) {
    await update.mutateAsync(values);
    apiCtx.getBook.invalidate({ isbn: values.isbn });
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="xl">
        <TextInput
          disabled
          label="Title"
          name="title"
          {...form.getInputProps("title")}
        />

        <MultiSelect
          data={data.authors.map((author) => ({
            value: author,
            label: author,
          }))}
          disabled
          label="Authors"
          name="authors"
          {...form.getInputProps("authors")}
        />

        <TextInput
          disabled
          label="ISBN"
          name="isbn"
          {...form.getInputProps("isbn")}
        />

        <Textarea
          autosize
          disabled
          label="Description"
          name="description"
          maxRows={4}
          {...form.getInputProps("description")}
        />

        <Group grow>
          <NumberInput
            disabled
            label="Published year"
            max={new Date().getFullYear()}
            name="publishedYear"
            {...form.getInputProps("publishedYear")}
          />

          <NumberInput
            disabled
            label="Pages"
            name="pages"
            {...form.getInputProps("pages")}
          />
        </Group>

        <Group grow>
          <NumberInput
            label="Reading year"
            max={new Date().getFullYear()}
            name="readYear"
            {...form.getInputProps("readYear")}
          />

          <Rating
            name="rating"
            size="lg"
            style={{ justifyContent: "center" }}
            {...form.getInputProps("rating")}
          />
        </Group>

        <Button loading={update.isLoading} type="submit">
          Save
        </Button>
      </Stack>
    </form>
  );
}
