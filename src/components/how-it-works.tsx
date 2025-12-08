import { GitFork, GitBranch, Bot, GitPullRequest } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function HowItWorks() {
  const steps = [
    {
      icon: GitFork,
      title: 'Fork Repository',
      description: 'The bot forks your target repository or reuses an existing fork',
    },
    {
      icon: GitBranch,
      title: 'Create Branch',
      description: 'A new timestamped feature branch is created for your changes',
    },
    {
      icon: Bot,
      title: 'AI Modifications',
      description: 'The bot analyzes the repo and applies your requested modifications',
    },
    {
      icon: GitPullRequest,
      title: 'Submit PR',
      description: 'Changes are committed and a pull request is created automatically',
    },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card key={index} className="relative">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
