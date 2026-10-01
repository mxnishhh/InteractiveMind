import './globals.css';
import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { WhatsAppButton } from '@/components/public/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Interactive Minds | Autism Care & Child Development Centre',
  description: 'Interactive Minds is an Autism Care & Child Development Centre dedicated to helping children learn, communicate, participate, and become independent through ABA, Occupational Therapy, Speech Therapy, and Special Education.',
  keywords: 'Autism Care, Child Development, ABA Therapy, Occupational Therapy, Speech Therapy, Special Education, Patna',
  openGraph: {
    title: 'Interactive Minds | Autism Care & Child Development Centre',
    description: 'Helping Every Child Learn, Grow & Shine through neurodiversity-affirming developmental therapies.',
    url: 'https://www.interactivemind.in',
    siteName: 'Interactive Minds',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
