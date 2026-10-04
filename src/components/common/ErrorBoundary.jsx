import { Component } from 'react';
import { Button } from '../ui/Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <p className="font-display text-xl">Something went wrong</p>
          <p className="text-sm text-muted-foreground">Please refresh the page and try again.</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
