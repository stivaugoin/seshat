import {
  Button,
  Divider,
  Group,
  MultiSelect,
  NumberInput,
  Rating,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
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
    await update.mutateAsync({ ...values, readYear: values.readYear || null });
    apiCtx.getBook.invalidate({ isbn: values.isbn });
    showNotification({
      color: "green",
      message: "Book updated successfully",
      title: "Book updated",
    });
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
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

        <Divider />

        <NumberInput
          label="Reading year"
          max={new Date().getFullYear()}
          name="readYear"
          {...form.getInputProps("readYear")}
        />

        <Stack spacing={4}>
          <Rating
            name="rating"
            size="lg"
            m="auto"
            {...form.getInputProps("rating")}
          />
          {(form.values.rating || 0) > 0 && (
            <Group sx={{ justifyContent: "center" }}>
              <Button
                color="dark"
                onClick={() => form.setFieldValue("rating", 0)}
                size="xs"
                variant="subtle"
              >
                Clear
              </Button>
            </Group>
          )}
        </Stack>
      </Stack>

      <Group grow>
        <Button loading={update.isLoading} mt={32} type="submit">
          Save
        </Button>
      </Group>
    </form>
  );
}
