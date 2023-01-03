import { AppShell, useMantineTheme } from "@mantine/core";
import Header from "./header";
import { HEADER_HEIGHT } from "./header/header.usestyle";

export default function Layout({ Component, pageProps }) {
  const theme = useMantineTheme();
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "light"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          padding: 8,
        },
      }}
    >
      <Header />
      <section style={{ marginTop: HEADER_HEIGHT }}>
        <Component {...pageProps} />
      </section>
    </AppShell>
  );
}
