import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <SEO title="Page Not Found" />
      <p className="font-display text-6xl text-primary">404</p>
      <h1 className="mt-3 font-display text-2xl text-foreground">Page not found</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
}
