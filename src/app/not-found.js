import PageHero from '@/components/ui/PageHero';
import Button from '@/components/ui/Button';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <PageHero
      className="notfound"
      index="404"
      label="Page not found"
      aside="Systems. Structure. Precision."
      title="Zero error. Except this one."
      intro="The page you’re looking for has moved, or never existed."
      data-theme="blue"
      data-formation="split"
      data-fy="0.18"
      data-fs="0.66"
      data-label=""
    >
      <div className="page-hero__fade">
        <Button href="/">Back to home</Button>
      </div>
    </PageHero>
  );
}
