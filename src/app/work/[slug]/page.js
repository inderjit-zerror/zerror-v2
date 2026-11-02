import { notFound } from 'next/navigation';
import { caseStudies } from '@/lib/content';
import CaseStudy from '@/components/pages/CaseStudy';

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) return {};
  return { title: `${study.client} — Case study`, description: study.overview.slice(0, 155) };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const index = caseStudies.findIndex((c) => c.slug === slug);
  if (index < 0) notFound();
  const next = caseStudies[(index + 1) % caseStudies.length];
  return <CaseStudy study={caseStudies[index]} next={next} />;
}
