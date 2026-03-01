import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, Button, Container } from "react-bootstrap";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleRefresh = (): void => {
    // Reset error state and reload the page
    window.location.reload();
  };

  handleReset = (): void => {
    // Reset error state without reloading
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>
              <i className="bi bi-exclamation-triangle me-2"></i>
              Oops! Something went wrong
            </Alert.Heading>
            <p>
              We encountered an unexpected error while loading this page. This has been logged and
              we'll look into it.
            </p>
            <hr />
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={this.handleRefresh}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh Page
              </Button>
              <Button variant="outline-secondary" onClick={this.handleReset}>
                Try Again
              </Button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-3">
                <summary style={{ cursor: "pointer" }}>
                  <strong>Error Details (Development Only)</strong>
                </summary>
                <pre className="mt-2 p-3 bg-light border rounded">
                  <code>
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </code>
                </pre>
              </details>
            )}
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
