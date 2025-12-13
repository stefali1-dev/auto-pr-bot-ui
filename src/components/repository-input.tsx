import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Github, ExternalLink, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface GitHubRepo {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
}

interface RepositoryInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function RepositoryInput({ value, onChange, disabled }: RepositoryInputProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GitHubRepo[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [rateLimitError, setRateLimitError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if input is a URL
  const isUrl = (text: string) => {
    return text.startsWith('http://') || text.startsWith('https://');
  };

  // Debounced search
  useEffect(() => {
    if (disabled) return;

    const trimmedValue = value.trim();
    
    // Don't search if it's a URL or too short
    if (!trimmedValue || trimmedValue.length < 3 || isUrl(trimmedValue)) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      setRateLimitError(false);
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(trimmedValue)}&per_page=8&sort=stars&order=desc`
        );
        
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.items || []);
          setShowDropdown(data.items?.length > 0);
        } else if (response.status === 403) {
          setRateLimitError(true);
          setSearchResults([]);
          setShowDropdown(false);
        } else {
          setSearchResults([]);
          setShowDropdown(false);
        }
      } catch (error) {
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [value, disabled]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
          selectRepo(searchResults[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const selectRepo = (repo: GitHubRepo) => {
    onChange(repo.html_url);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search repositories or paste URL..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {rateLimitError && (
        <div className="absolute z-50 w-full mt-1 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-md shadow-lg p-3 animate-in fade-in duration-300">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                GitHub API Rate Limit Reached
              </p>
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                You've hit the 60 requests/hour limit for repository searches. Please paste the repository URL directly or try again later.
              </p>
            </div>
          </div>
        </div>
      )}

      {showDropdown && searchResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-96 overflow-y-auto"
        >
          {searchResults.map((repo, index) => (
            <button
              key={repo.id}
              type="button"
              onClick={() => selectRepo(repo)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0 ${
                highlightedIndex === index ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <Github className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">{repo.full_name}</p>
                    {repo.language && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex-shrink-0">
                        {repo.language}
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                      </svg>
                      {formatNumber(repo.stargazers_count)}
                    </span>
                  </div>
                </div>
                <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
