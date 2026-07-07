import type { AppProps } from 'next/app';
import { Bitter, Open_Sans } from 'next/font/google';
import '@/styles/globals.css';

const bitter = Bitter({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-bitter',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-open-sans',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${bitter.variable} ${openSans.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
