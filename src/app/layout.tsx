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
  metadataBase: new URL('https://interactivemind.in'),
  title: 'Interactive Minds | Autism Care & Child Development Centre',
  description: 'Interactive Minds is an Autism Care & Child Development Centre dedicated to helping children learn, communicate, participate, and become independent through ABA, Occupational Therapy, Speech Therapy, and Special Education.',
  keywords: 'Autism Care, Child Development, ABA Therapy, Occupational Therapy, Speech Therapy, Special Education, Patna',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Interactive Minds | Autism Care & Child Development Centre',
    description: 'Helping Every Child Learn, Grow & Shine through neurodiversity-affirming developmental therapies.',
    url: 'https://interactivemind.in',
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'Interactive Minds',
  alternateName: 'Interactive Minds Autism Care & Child Development Centre',
  url: 'https://interactivemind.in',
  logo: 'https://interactivemind.in/images/interactive-minds-logo.webp',
  image: 'https://interactivemind.in/images/interactive-minds-mark.webp',
  description: 'Interactive Minds is an Autism Care & Child Development Centre dedicated to helping children learn, communicate, participate, and become independent through ABA, Occupational Therapy, Speech Therapy, and Special Education.',
  telephone: '+919031041991',
  email: 'interactivemindsindia@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1st Floor, Hira Shiv Palace, Gudari Bazar, Ashokraj Path',
    addressLocality: 'Patna City',
    addressRegion: 'Bihar',
    postalCode: '800008',
    addressCountry: 'IN',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
  ],
  medicalSpecialty: 'Pediatrics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${fraunces.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
