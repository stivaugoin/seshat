import { Badge, Group, Rating, Stack, Text, Title } from "@mantine/core";
import type { Book } from "@prisma/client";

interface Props {
  book: Book;
}

export function BookView({ book }: Props) {
  return (
    <Stack spacing="sm">
      <Title order={3}>{book.title}</Title>

      <Group>
        {book.authors.map((author) => (
          <Badge color="gray" variant="outline" key={author}>
            {author}
          </Badge>
        ))}
      </Group>

      <Text color="dimmed">
        {book.publishedYear} &middot; {book.pages} pages
      </Text>

      <Group grow position="apart">
        {book.rating ? (
          <Rating readOnly value={book.rating} />
        ) : (
          <Text color="dimmed" italic>
            Not rated yet
          </Text>
        )}

        {book.readYear ? (
          <Text align="right" color="dimmed">
            Read in {book.readYear}
          </Text>
        ) : (
          <Text align="right" color="dimmed" italic>
            Not read yet
          </Text>
        )}
      </Group>
    </Stack>
  );
}
