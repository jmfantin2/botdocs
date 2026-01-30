import { useState, useRef, useEffect } from 'react';
import { Search, X, Building2, Bot, Workflow } from 'lucide-react';
import { useAppStore } from '../store';

export function SearchBar() {
  const { searchQuery, setSearchQuery, searchAll, navigate } = useAppStore();
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof searchAll> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      setResults(searchAll(searchQuery));
    } else {
      setResults(null);
    }
  }, [searchQuery, searchAll]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setIsFocused(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (type: 'org' | 'chatbot' | 'workflow', id: string) => {
    if (type === 'org') {
      navigate({ view: 'org', orgId: id });
    } else if (type === 'chatbot') {
      const chatbot = useAppStore.getState().getChatbot(id);
      if (chatbot) {
        navigate({ view: 'chatbot', orgId: chatbot.orgId, chatbotId: id });
      }
    } else if (type === 'workflow') {
      const workflow = useAppStore.getState().getWorkflow(id);
      if (workflow) {
        const chatbot = useAppStore.getState().getChatbot(workflow.chatbotId);
        if (chatbot) {
          navigate({
            view: 'workflow',
            orgId: chatbot.orgId,
            chatbotId: chatbot.id,
            workflowId: id,
          });
        }
      }
    }
    setSearchQuery('');
    setIsFocused(false);
  };

  const hasResults =
    results &&
    (results.organizations.length > 0 ||
      results.chatbots.length > 0 ||
      results.workflows.length > 0);

  return (
    <div ref={containerRef} className="relative px-6 py-4 bg-bg-primary border-b border-border">
      <div
        className={`flex items-center gap-3 px-4 py-2.5 bg-bg-secondary rounded-xl border transition-colors ${
          isFocused ? 'border-accent' : 'border-border hover:border-border-hover'
        }`}
      >
        <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search organizations, chatbots, workflows..."
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 rounded hover:bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <div className="text-2xs text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded">
          ⌘K
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isFocused && searchQuery && (
        <div className="absolute left-6 right-6 top-full mt-2 bg-bg-secondary border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-scale-in">
          {hasResults ? (
            <div className="max-h-80 overflow-y-auto">
              {/* Organizations */}
              {results.organizations.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-2xs uppercase tracking-wider text-text-muted bg-bg-tertiary">
                    Organizations
                  </div>
                  {results.organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => handleSelect('org', org.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-tertiary text-left transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-text-muted" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-primary truncate">{org.name}</div>
                        {org.description && (
                          <div className="text-xs text-text-muted truncate">
                            {org.description}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Chatbots */}
              {results.chatbots.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-2xs uppercase tracking-wider text-text-muted bg-bg-tertiary">
                    Chatbots
                  </div>
                  {results.chatbots.map((chatbot) => (
                    <button
                      key={chatbot.id}
                      onClick={() => handleSelect('chatbot', chatbot.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-tertiary text-left transition-colors"
                    >
                      <Bot className="w-4 h-4 text-text-muted" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-primary truncate">{chatbot.name}</div>
                        {chatbot.description && (
                          <div className="text-xs text-text-muted truncate">
                            {chatbot.description}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Workflows */}
              {results.workflows.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-2xs uppercase tracking-wider text-text-muted bg-bg-tertiary">
                    Workflows
                  </div>
                  {results.workflows.map((workflow) => (
                    <button
                      key={workflow.id}
                      onClick={() => handleSelect('workflow', workflow.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-tertiary text-left transition-colors"
                    >
                      <Workflow className="w-4 h-4 text-text-muted" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-primary truncate">
                          {workflow.emoji && `${workflow.emoji} `}
                          {workflow.name}
                        </div>
                        {workflow.description && (
                          <div className="text-xs text-text-muted truncate">
                            {workflow.description}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="text-text-muted text-sm">No results found</div>
              <div className="text-text-muted text-xs mt-1">
                Try different keywords
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
