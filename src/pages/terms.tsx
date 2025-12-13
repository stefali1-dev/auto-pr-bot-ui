import Head from 'next/head';
import Link from 'next/link';
import { Github, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - Auto PR Bot</title>
        <meta name="description" content="Terms of Service for Auto PR Bot" />
      </Head>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Github className="h-8 w-8 text-foreground" />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Auto PR Bot</h1>
                  <p className="text-sm text-muted-foreground">Terms of Service</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: December 13, 2025</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
              <p>By using Auto PR Bot, you agree to these Terms of Service. If you don't agree, please don't use this service.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">User Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Only target repositories you have permission to fork and modify</li>
                <li>Respect repository licenses and contribution guidelines</li>
                <li>Not use this service to spam, harass, or submit malicious code</li>
                <li>Not abuse the rate limits or attempt to circumvent them</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Liability and Disclaimers</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>No Warranty:</strong> This service is provided "as is" without warranties</li>
                <li><strong>User Content:</strong> You are solely responsible for the content of PRs created</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">GitHub Terms</h2>
              <p>You must also comply with <a href="https://docs.github.com/en/site-policy/github-terms/github-terms-of-service" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub's Terms of Service</a> when using this tool.</p>
            </div>
          </div>
        </main>

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
