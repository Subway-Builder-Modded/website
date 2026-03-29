import { notFound } from 'next/navigation';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: [] as string[] }];
}

export const metadata = {
  title: 'Docs | Subway Builder Modded',
};

export default function LegacyDocsRoutePage() {
  notFound();
}
