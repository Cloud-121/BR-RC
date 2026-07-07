import { Head, Html, Main, NextScript } from 'next/document';
import { fontVariables } from '@/lib/fonts';

export default function Document() {
  return (
    <Html lang="en" className={fontVariables}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
