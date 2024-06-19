import { Html, Head, Main, NextScript } from "next/document";

import { basePath } from "@/config/index";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="robots" content="noindex"></meta>
        <link href={`${basePath}/fonts/webfonts.css`} rel="stylesheet" />
        <link href={`${basePath}/favicon.png`} rel="icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
