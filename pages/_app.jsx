import Head from "next/head";
import Script from "next/script";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import Layout from "../components/layout";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  // Create a new supabase browser client on every first render.
  return (
    <>
      <Head>
        <title>Pegi Trip</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-K3BYGB8CVT"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-K3BYGB8CVT');
            `}
      </Script>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
          spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
        }}
      >
        <NotificationsProvider position="bottom-center" zIndex={2077}>
          <ModalsProvider>
            <Layout {...{ Component, pageProps }} />
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}
