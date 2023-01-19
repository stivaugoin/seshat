import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";
import Head from "next/head";
import { api } from "../utils/api";

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Seshat - My virtual bookshelf</title>
        <meta name="description" content="Virtual bookshelf" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SessionProvider session={pageProps.session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "dark",
            primaryColor: "yellow",
          }}
        >
          <NotificationsProvider>
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}

export default api.withTRPC(App);
