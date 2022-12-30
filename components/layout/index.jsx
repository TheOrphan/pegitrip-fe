import {
  AppShell,
  useMantineTheme,
  Container,
  ScrollArea,
} from "@mantine/core";
import Header from "./header";

export default function Layout({ Component, pageProps }) {
  const theme = useMantineTheme();
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          padding: 8,
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
    >
      <Container p={0} size={"100vw"}>
        <Header />
      </Container>
      <ScrollArea style={{ height: "87vh" }}>
        <Container p={0}>
          <Component {...pageProps} />
        </Container>
      </ScrollArea>
    </AppShell>
  );
}
