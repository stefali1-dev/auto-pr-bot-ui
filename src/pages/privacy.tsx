import Head from 'next/head';
import Link from 'next/link';
import { Github, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Auto PR Bot</title>
        <meta name="description" content="Privacy Policy for Auto PR Bot" />
      </Head>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Github className="h-8 w-8 text-foreground" />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Auto PR Bot</h1>
                  <p className="text-sm text-muted-foreground">Privacy Policy</p>
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
              <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: December 13, 2025</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
              <p>When you use Auto PR Bot, we collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>IP Address:</strong> Used for rate limiting</li>
                <li><strong>Repository URL:</strong> The GitHub repository you want to modify</li>
                <li><strong>GitHub Username (Optional):</strong> If you choose to provide it for collaboration access</li>
                <li><strong>Request Data:</strong> Temporary tracking of your request status</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To process your pull request creation</li>
                <li>To enforce rate limits and prevent abuse</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Data Storage and Retention</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All data is stored temporarily with automatic expiration (TTL)</li>
                <li>Request data expires within 24 hours</li>
                <li>Rate limit data expires after 1 hour</li>
                <li>We do not permanently store your modification prompts or personal data</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Data Sharing</h2>
              <p>We do not sell, trade, or share your data with third parties. Your data is only used to operate this service.</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Third-Party Services</h2>
              <p>This service uses:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>GitHub API:</strong> To fork repositories and create pull requests</li>
                <li><strong>OpenAI:</strong> To analyze code and generate modifications</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact</h2>
              <p>For privacy concerns, contact: <a href="https://github.com/stefali1-dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">@stefali1-dev</a></p>
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
