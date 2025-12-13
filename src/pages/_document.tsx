import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="AI-powered pull request automation. Fork repositories, make modifications, and create PRs automatically." />
        <meta name="keywords" content="github, automation, pull request, AI, GPT-5-mini, OpenAI, open source" />
        <meta name="author" content="stefali1-dev" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
