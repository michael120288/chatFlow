import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Something went wrong.{' '}
            <button onClick={() => this.setState({ hasError: false })}>Try again</button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
