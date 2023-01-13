import {
  Badge,
  Container,
  createStyles,
  Group,
  Header,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ComponentProps } from "react";

interface Props extends ComponentProps<typeof Container> {
  children: React.ReactNode;
}

const LINKS = {
  search: { href: "/search", label: "Search" },
  books: { href: "/", label: "Books" },
};

export function Layout({ children, ...containerProps }: Props) {
  const { classes, cx } = useStyles();
  const router = useRouter();

  return (
    <>
      <Header height={60} pos="sticky" zIndex={900}>
        <Container className={classes.header}>
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
                {link.label}
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
  console.log({ href, pathname });
  if (pathname === "/[isbn]" && href === "/") return true;
  return pathname === href;
}

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colors.dark[9],
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
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
