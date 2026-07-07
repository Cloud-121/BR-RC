import Head from 'next/head';
import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const DEFAULT_DESCRIPTION =
  'Baton Rouge Radio Control Club — AMA chartered club flying at Kissner Field in Port Allen, Louisiana.';

export default function Layout({
  title,
  description = DEFAULT_DESCRIPTION,
  children,
}: LayoutProps) {
  const fullTitle =
    title === 'Home' ? 'Baton Rouge Radio Control Club' : `${title} | Baton Rouge RC Club`;

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" type="image/jpeg" href="/favicon.jpg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.jpg" />
        <title>{fullTitle}</title>
      </Head>
      <Header />
      {children}
      <Footer />
    </>
  );
}
