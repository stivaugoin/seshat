import {
  Badge,
  Box,
  Button,
  Container,
  createStyles,
  Flex,
  Group,
  Header,
  Loader,
  Text,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ComponentProps } from "react";

interface Props extends ComponentProps<typeof Container> {
  children: React.ReactNode;
}

const LINKS = {
  search: { href: "/search", icon: <SearchIcon /> },
  books: { href: "/", label: "Books" },
};

export function Layout({ children, ...containerProps }: Props) {
  const { classes, cx } = useStyles();
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Box pos="absolute" top={0} left={0} right={0} bottom={0}>
        <Flex h="100%" w="100%" align="center" justify="center">
          <Loader size="xl" />
        </Flex>
      </Box>
    );
  }

  if (!session)
    return (
      <Button component={Link} href="/api/auth/signin">
        Sign in
      </Button>
    );

  return (
    <>
      <Header className={classes.header} height={60} pos="sticky" zIndex={900}>
        <Container className={classes.container}>
          <Group>
            <Text component={Link} href="/" size="lg">
              Seshat
            </Text>

            <Badge size="sm">Alpha</Badge>
          </Group>

          <Group spacing="md">
            {Object.entries(LINKS).map(([, link]) => (
              <Link
                className={cx(classes.link, {
                  [classes.linkActive]: isActive(link.href, router.pathname),
                })}
                href={link.href}
                key={link.href}
              >
                {"icon" in link && link.icon}
                {"label" in link && link.label}
              </Link>
            ))}
          </Group>
        </Container>
      </Header>

      <Container {...containerProps}>{children}</Container>
    </>
  );
}

function isActive(href: string, pathname: string) {
  if (pathname === "/[isbn]" && href === "/") return true;
  return pathname === href;
}

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
  header: {
    backgroundColor: theme.colors.dark[9],
  },
  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colors.dark[6],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).color,
    },
  },
}));

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ height: "1rem", width: "1rem" }}
    >
      <path
        fillRule="evenodd"
        d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}
