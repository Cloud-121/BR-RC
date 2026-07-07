import { Bitter, Open_Sans } from 'next/font/google';

export const bitter = Bitter({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-bitter',
});

export const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-open-sans',
});

export const fontVariables = `${bitter.variable} ${openSans.variable}`;
