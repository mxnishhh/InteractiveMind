import React from 'react';
import { notFound } from 'next/navigation';
import { getServiceBySlugDB } from '@/lib/db';
import { TherapyPageContent } from '@/components/public/TherapyPageContent';

export default async function TherapyDetailPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlugDB(params.slug);

  if (!service) {
    notFound();
  }

  return <TherapyPageContent service={service} />;
}
