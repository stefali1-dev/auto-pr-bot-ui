import { useState } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { HowItWorks } from '@/components/how-it-works';

interface ProcessingStatus {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
  repository?: string;
}

export default function Home() {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [modificationPrompt, setModificationPrompt] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({ status: 'idle' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repositoryUrl || !modificationPrompt) {
      setProcessingStatus({
        status: 'error',
        message: 'Repository URL and modification prompt are required'
      });
      return;
    }

    setIsSubmitting(true);
    setProcessingStatus({ status: 'processing', message: 'Submitting your request...' });

    try {
      // TODO: Replace with actual API endpoint URL
      const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || 'YOUR_API_GATEWAY_URL_HERE';
      
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

      if (response.ok) {
        setProcessingStatus({
          status: 'success',
          message: data.message || 'Your request is being processed. Check CloudWatch logs for progress.',
          repository: data.repository || repositoryUrl
        });
        
        // Reset form after successful submission
        setRepositoryUrl('');
        setModificationPrompt('');
        setGithubUsername('');
      } else {
        setProcessingStatus({
          status: 'error',
          message: data.message || 'Failed to submit request'
        });
      }
    } catch (error) {
      setProcessingStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Auto PR Bot - AI-Powered Pull Request Automation</title>
        <meta name="description" content="Automate GitHub contributions with AI. Fork repositories, make intelligent code modifications, and create pull requests automatically." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Github className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Auto PR Bot</h1>
                <p className="text-sm text-muted-foreground">AI-powered pull request automation</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
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
                <Input
                  id="repositoryUrl"
                  type="url"
                  placeholder="https://github.com/owner/repository"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  The GitHub repository you want to contribute to
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
                <p className="text-xs text-muted-foreground">
                  Be specific about what changes you'd like the AI to make
                </p>
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

              {/* Status Messages */}
              {processingStatus.status !== 'idle' && (
                <div
                  className={`rounded-lg border p-4 ${
                    processingStatus.status === 'processing'
                      ? 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950'
                      : processingStatus.status === 'success'
                      ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                      : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {processingStatus.status === 'processing' && (
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400 mt-0.5" />
                    )}
                    {processingStatus.status === 'success' && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    )}
                    {processingStatus.status === 'error' && (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          processingStatus.status === 'processing'
                            ? 'text-blue-900 dark:text-blue-100'
                            : processingStatus.status === 'success'
                            ? 'text-green-900 dark:text-green-100'
                            : 'text-red-900 dark:text-red-100'
                        }`}
                      >
                        {processingStatus.message}
                      </p>
                      {processingStatus.repository && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Repository: {processingStatus.repository}
                        </p>
                      )}
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

        {/* Info Section */}
        <div className="mt-8 text-center text-sm text-muted-foreground space-y-2">
          <p>
            This bot will fork the repository, create a new branch, apply AI-powered modifications,
            and submit a pull request automatically.
          </p>
          <p className="text-xs">
            Processing happens asynchronously. You'll receive confirmation once submitted.
          </p>
        </div>

        {/* How It Works Section */}
        <HowItWorks />
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
