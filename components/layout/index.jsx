import { AppShell } from "@mantine/core";
import Header from "./header";
import { HEADER_HEIGHT } from "./header/header.usestyle";

export default function Layout({ Component, pageProps }) {
  return (
    <AppShell
      styles={{
        main: {
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
