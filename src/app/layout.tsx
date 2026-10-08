import './globals.css';
import React from 'react';
import { Metadata } from 'next';
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { WhatsAppButton } from '@/components/public/WhatsAppButton';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.interactivemind.in'),
  title: 'Interactive Minds | Autism Care & Child Development Centre',
  description: 'Interactive Minds is an Autism Care & Child Development Centre dedicated to helping children learn, communicate, participate, and become independent through ABA, Occupational Therapy, Speech Therapy, and Special Education.',
  keywords: 'Autism Care, Child Development, ABA Therapy, Occupational Therapy, Speech Therapy, Special Education, Patna',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Interactive Minds | Autism Care & Child Development Centre',
    description: 'Helping Every Child Learn, Grow & Shine through neurodiversity-affirming developmental therapies.',
    url: 'https://www.interactivemind.in',
    siteName: 'Interactive Minds',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Minds | Autism Care & Child Development Centre',
    description: 'Helping Every Child Learn, Grow & Shine through neurodiversity-affirming developmental therapies.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${fraunces.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
