import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, GitFork, Download, Search, FileEdit, GitCommit, GitPullRequest, ExternalLink, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StatusTrackerProps {
  requestId: string;
  repository: string;
  apiEndpoint: string;
  onComplete?: () => void;
  onRejected?: () => void;
}

interface StatusResponse {
  requestId: string;
  status: string;
  message: string;
  step: number;
  timestamp: number;
  repository: string;
  prUrl?: string;
  errorDetails?: string;
}

interface StepInfo {
  id: string;
  label: string;
  icon: React.ElementType;
}

const steps: StepInfo[] = [
  { id: 'pending', label: 'Initializing', icon: Loader2 },
  { id: 'validating', label: 'Validating Prompt', icon: AlertCircle },
  { id: 'forking', label: 'Forking Repository', icon: GitFork },
  { id: 'cloning', label: 'Cloning Fork', icon: Download },
  { id: 'analyzing', label: 'Analyzing Code', icon: Search },
  { id: 'modifying', label: 'Generating Modifications', icon: FileEdit },
  { id: 'committing', label: 'Committing Changes', icon: GitCommit },
  { id: 'creating_pr', label: 'Creating Pull Request', icon: GitPullRequest },
];

export function StatusTracker({ requestId, repository, apiEndpoint, onComplete, onRejected }: StatusTrackerProps) {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    if (!isPolling) return;

    const pollStatus = async () => {
      try {
        const statusEndpoint = apiEndpoint.replace('/process', `/status/${requestId}`);
        
        const response = await fetch(statusEndpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch status: ${response.status}`);
        }

        const data: StatusResponse = await response.json();
        setStatus(data);

        // Stop polling if completed, rejected, or errored
        if (data.status === 'completed') {
          setIsPolling(false);
          // Add 1 second delay before showing completion
          setTimeout(() => {
            setShowCompleted(true);
            if (onComplete) onComplete();
          }, 1000);
        } else if (data.status === 'rejected') {
          setIsPolling(false);
          setShowCompleted(true);
        } else if (data.status === 'error') {
          setIsPolling(false);
          setShowCompleted(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch status');
        setIsPolling(false);
      }
    };

    // Poll immediately
    pollStatus();

    // Then poll every 3 seconds
    const interval = setInterval(pollStatus, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [requestId, apiEndpoint, isPolling]);

  const getStepState = (stepId: string): 'completed' | 'current' | 'pending' => {
    if (!status) return 'pending';
    
    const currentStepIndex = steps.findIndex(s => s.id === status.status);
    const stepIndex = steps.findIndex(s => s.id === stepId);

    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  if (error) {
    return (
      <Card className="shadow-lg border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <XCircle className="h-5 w-5" />
            Error Fetching Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button
            onClick={() => {
              setError(null);
              setIsPolling(true);
            }}
            variant="outline"
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status?.status === 'rejected') {
    return (
      <Card className="shadow-lg border-amber-200 dark:border-amber-900 animate-in fade-in duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-5 w-5" />
            Prompt Needs Improvement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-4 border border-amber-200 dark:border-amber-900">
            <p className="text-sm text-amber-900 dark:text-amber-100 font-medium mb-2">
              Your modification request is too vague or unclear.
            </p>
            {status.errorDetails && (
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                {status.errorDetails}
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Tips for writing clear prompts:
              </p>
              <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1.5 list-disc list-inside">
                <li>Be specific about which file(s) to modify</li>
                <li>Clearly describe what changes you want</li>
                <li>Include examples if helpful</li>
                <li>Avoid vague terms like "improve" or "make better"</li>
              </ul>
            </div>
          </div>
          
          <div className="rounded-lg bg-muted p-4 border">
            <p className="text-xs font-semibold text-foreground mb-2">Example good prompts:</p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>✓ "Add a 'Hello World' comment to the README.md file"</li>
              <li>✓ "Update the package.json version to 2.0.0"</li>
              <li>✓ "Add error handling to the main.go file"</li>
            </ul>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              Repository:{' '}
              <a
                href={status.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {status.repository}
              </a>
            </p>
            <p>Request ID: {requestId}</p>
          </div>
          
          {onRejected && (
            <Button
              onClick={onRejected}
              variant="default"
              className="w-full"
            >
              Try Again with Better Prompt
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (status?.status === 'error') {
    return (
      <Card className="shadow-lg border-red-200 dark:border-red-900 animate-in fade-in duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <XCircle className="h-5 w-5" />
            Processing Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4 border border-red-200 dark:border-red-900">
            <p className="text-sm text-red-900 dark:text-red-100 font-medium">
              {status.message}
            </p>
            {status.errorDetails && (
              <p className="text-xs text-red-700 dark:text-red-300 mt-2">
                {status.errorDetails}
              </p>
            )}
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              Repository:{' '}
              <a
                href={status.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {status.repository}
              </a>
            </p>
            <p>Request ID: {requestId}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status?.status === 'completed' && status.prUrl) {
    return (
      <Card className="shadow-lg border-green-200 dark:border-green-900 animate-in fade-in duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            Pull Request Created Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4 border border-green-200 dark:border-green-900">
            <p className="text-sm text-green-900 dark:text-green-100 font-medium mb-3">
              Your pull request has been created and is ready for review.
            </p>
            <a
              href={status.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 transition-colors"
            >
              View Pull Request
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          
          {/* Success Animation - Checkmark */}
          <div className="flex justify-center py-6">
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400 relative animate-in zoom-in duration-700" />
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              Repository:{' '}
              <a
                href={status.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {status.repository}
              </a>
            </p>
            <p>Request ID: {requestId}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
          Processing Your Request
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const state = getStepState(step.id);
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="flex items-center gap-3 transition-all duration-700 ease-out"
                style={{
                  opacity: state === 'pending' ? 0.5 : 1,
                  transform: state === 'current' ? 'translateX(2px)' : 'translateX(0)',
                }}
              >
                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    state === 'completed'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : state === 'current'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                  }`}
                >
                  {state === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className={`h-5 w-5 ${state === 'current' ? 'animate-pulse' : ''}`} />
                  )}
                </div>

                {/* Label */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium transition-colors duration-300 ${
                      state === 'completed'
                        ? 'text-green-700 dark:text-green-300'
                        : state === 'current'
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-500 dark:text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Progress Indicator */}
                {state === 'current' && (
                  <div className="w-6 h-6">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                {state === 'completed' && (
                  <div className="w-6 h-6 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-in zoom-in duration-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
          <p>
            Repository:{' '}
            <a
              href={repository}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {repository}
            </a>
          </p>
          <p>Request ID: {requestId}</p>
          <p className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
            Polling for updates every 3 seconds...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
