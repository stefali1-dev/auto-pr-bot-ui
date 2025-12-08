import { useState } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Loader2, XCircle, ArrowLeft, Clock, AlertTriangle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { HowItWorks } from '@/components/how-it-works';
import { StatusTracker } from '@/components/status-tracker';
import { RepositoryInput } from '@/components/repository-input';

interface ProcessingState {
  isTracking: boolean;
  requestId?: string;
  repository?: string;
  error?: string;
  isRateLimited?: boolean;
  rateLimitMessage?: string;
  resetTime?: string;
  resetTimeRelative?: string;
}

export default function Home() {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [modificationPrompt, setModificationPrompt] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [processingState, setProcessingState] = useState<ProcessingState>({ isTracking: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format time difference in human-readable format
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = timestamp * 1000 - now; // Convert to milliseconds
    
    if (diff <= 0) return 'now';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `in ${hours}h ${remainingMinutes}m`
        : `in ${hours}h`;
    }
    
    return `in ${minutes}m`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repositoryUrl || !modificationPrompt) {
      setProcessingState({
        isTracking: false,
        error: 'Repository URL and modification prompt are required'
      });
      return;
    }

    setIsSubmitting(true);
    setProcessingState({ isTracking: false });

    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://k80r4uyfj1.execute-api.eu-central-1.amazonaws.com/Prod/process';
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repositoryUrl,
          modificationPrompt,
          githubUsername: githubUsername || undefined,
        }),
      });

      const data = await response.json();

      // Handle rate limiting
      if (response.status === 429) {
        // Check if we have structured rate limit data
        let rateLimitMessage = 'Rate limit exceeded. Please try again later.';
        let resetTime = '';
        let resetTimeRelative = '';

        if (data.rateLimit) {
          const { limit, used, resetAt } = data.rateLimit;
          const resetDate = new Date(resetAt * 1000);
          
          // Format in user's local timezone
          resetTime = resetDate.toLocaleString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short'
          });
          
          resetTimeRelative = formatRelativeTime(resetAt);
          
          rateLimitMessage = `You've used ${used}/${limit} requests this hour.`;
        } else if (data.error) {
          // Fallback to old format if backend hasn't been updated
          rateLimitMessage = data.error;
        }

        setProcessingState({
          isTracking: false,
          isRateLimited: true,
          rateLimitMessage,
          resetTime,
          resetTimeRelative,
          error: data.error || 'Rate limit exceeded'
        });
        return;
      }

      if (response.ok && data.requestId) {
        // Start tracking the request
        setProcessingState({
          isTracking: true,
          requestId: data.requestId,
          repository: data.repository || repositoryUrl,
        });
      } else {
        setProcessingState({
          isTracking: false,
          error: data.error || 'Failed to submit request'
        });
      }
    } catch (error) {
      setProcessingState({
        isTracking: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setProcessingState({ isTracking: false });
    setRepositoryUrl('');
    setModificationPrompt('');
    setGithubUsername('');
  };

  const handleRejected = () => {
    setProcessingState({ isTracking: false });
  };

  return (
    <>
      <Head>
        <title>Auto PR Bot - AI-Powered Pull Request Automation</title>
        <meta name="description" content="Automate GitHub contributions with AI. Fork repositories, make intelligent code modifications, and create pull requests automatically." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Github className="h-8 w-8 text-foreground" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Auto PR Bot</h1>
                <p className="text-sm text-muted-foreground">AI-powered pull request automation</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {processingState.isTracking && processingState.requestId ? (
          /* Status Tracker View */
          <div className="space-y-6">
            <Button
              onClick={handleReset}
              variant="ghost"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Create Another PR
            </Button>
            
            <StatusTracker
              requestId={processingState.requestId}
              repository={processingState.repository || repositoryUrl}
              apiEndpoint={process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://k80r4uyfj1.execute-api.eu-central-1.amazonaws.com/Prod/process'}
              onRejected={handleRejected}
            />
          </div>
        ) : (
          /* Form View */
          <>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Create Automated Pull Request</CardTitle>
                <CardDescription>
                  Fork a repository, make AI-powered modifications, and submit a pull request automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
              {/* Repository URL */}
              <div className="space-y-2">
                <Label htmlFor="repositoryUrl">
                  Repository URL <span className="text-destructive">*</span>
                </Label>
                <RepositoryInput
                  value={repositoryUrl}
                  onChange={setRepositoryUrl}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Search for a repository or paste the full URL
                </p>
              </div>

              {/* Modification Prompt */}
              <div className="space-y-2">
                <Label htmlFor="modificationPrompt">
                  Modification Prompt <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="modificationPrompt"
                  placeholder="Describe the changes you want to make to the repository..."
                  value={modificationPrompt}
                  onChange={(e) => setModificationPrompt(e.target.value)}
                  required
                  disabled={isSubmitting}
                  rows={6}
                  className="resize-none"
                />
              </div>

              {/* GitHub Username (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="githubUsername">GitHub Username (Optional)</Label>
                <Input
                  id="githubUsername"
                  type="text"
                  placeholder="your-github-username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  You'll be added as a collaborator to the fork so you can edit the PR
                </p>
              </div>

              {/* Error Message */}
              {processingState.error && !processingState.isRateLimited && (
                <div className="rounded-lg border p-4 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950 animate-in fade-in duration-300">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900 dark:text-red-100">
                        {processingState.error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rate Limit Message */}
              {processingState.isRateLimited && processingState.rateLimitMessage && (
                <div className="rounded-lg border p-4 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950 animate-in fade-in duration-300">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                          Rate Limit Reached
                        </p>
                      </div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {processingState.rateLimitMessage}
                      </p>
                      {processingState.resetTime && (
                        <div className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                          Next available: {processingState.resetTime}
                          {processingState.resetTimeRelative && (
                            <span className="ml-1 text-yellow-700 dark:text-yellow-300">
                              ({processingState.resetTimeRelative})
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
                        This helps prevent abuse and ensures fair usage for everyone. Thank you for your patience!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* How It Works Section */}
        <HowItWorks />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <a
            href="https://github.com/stefali1-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            @stefali1-dev
          </a>
        </div>
      </footer>
    </div>
    </>
  );
}
