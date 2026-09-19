import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';

export function StatCard({ label, value, icon: Icon, to }) {
  const content = (
    <CardContent className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 font-display text-2xl text-foreground">{value}</p>
      </div>
      {Icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-200 text-foreground">
          <Icon className="h-5 w-5" />
        </div>
      )}
    </CardContent>
  );

  if (to) {
    return (
      <Link to={to}>
        <Card className="transition-colors hover:border-primary hover:bg-cream-100">{content}</Card>
      </Link>
    );
  }

  return <Card>{content}</Card>;
}
