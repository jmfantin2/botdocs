import { Building2, Bot, Workflow, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store';

export function HomeView() {
  const {
    organizations,
    chatbots,
    workflows,
    navigate,
    getChatbotsByOrg,
    getWorkflowsByChatbot,
    toggleOrgExpanded,
    expandedOrgs,
  } = useAppStore();

  const stats = [
    { label: 'Organizations', value: organizations.length, icon: Building2 },
    { label: 'Chatbots', value: chatbots.length, icon: Bot },
    { label: 'Workflows', value: workflows.length, icon: Workflow },
  ];

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Overview</h1>
        <p className="text-text-secondary mt-1">
          Select an organization to view its chatbots and workflows.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-bg-secondary border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-bg-tertiary rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Organization Picker */}
      <div>
        <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
          Pick an Organization
        </h2>

        {organizations.length === 0 ? (
          <div className="bg-bg-secondary border border-border border-dashed rounded-xl p-8 text-center">
            <Building2 className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No organizations yet</p>
            <p className="text-sm text-text-muted mt-1">
              Create your first organization using the sidebar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {organizations.map((org) => {
              const orgChatbots = getChatbotsByOrg(org.id);
              const isExpanded = expandedOrgs.has(org.id);

              return (
                <div
                  key={org.id}
                  className="bg-bg-secondary border border-border rounded-xl overflow-hidden"
                >
                  {/* Org Header */}
                  <button
                    onClick={() => {
                      toggleOrgExpanded(org.id);
                    }}
                    className="w-full flex items-center justify-between p-4 hover:bg-bg-tertiary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent-muted rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-accent" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-text-primary">{org.name}</div>
                        <div className="text-sm text-text-muted">
                          {orgChatbots.length} chatbot{orgChatbots.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-5 h-5 text-text-muted transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {/* Expanded Chatbots */}
                  {isExpanded && (
                    <div className="border-t border-border bg-bg-tertiary/50 animate-fade-in">
                      {orgChatbots.length === 0 ? (
                        <div className="p-4 text-sm text-text-muted text-center">
                          No chatbots in this organization
                        </div>
                      ) : (
                        <div className="p-2">
                          {orgChatbots.map((chatbot) => {
                            const chatbotWorkflows = getWorkflowsByChatbot(chatbot.id);

                            return (
                              <div
                                key={chatbot.id}
                                className="p-3 hover:bg-bg-elevated rounded-lg cursor-pointer transition-colors"
                                onClick={() =>
                                  navigate({
                                    view: 'chatbot',
                                    orgId: org.id,
                                    chatbotId: chatbot.id,
                                  })
                                }
                              >
                                <div className="flex items-start gap-3">
                                  <Bot className="w-5 h-5 text-text-muted mt-0.5" />
                                  <div className="flex-1">
                                    <div className="font-medium text-text-primary text-sm">
                                      {chatbot.name}
                                    </div>
                                    {chatbot.description && (
                                      <div className="text-xs text-text-muted mt-0.5 line-clamp-1">
                                        {chatbot.description}
                                      </div>
                                    )}
                                    {/* Workflow list */}
                                    {chatbotWorkflows.length > 0 && (
                                      <div className="mt-2 space-y-1">
                                        {chatbotWorkflows.map((wf) => (
                                          <div
                                            key={wf.id}
                                            className="flex items-center gap-2 text-xs text-text-secondary"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigate({
                                                view: 'workflow',
                                                orgId: org.id,
                                                chatbotId: chatbot.id,
                                                workflowId: wf.id,
                                              });
                                            }}
                                          >
                                            <Workflow className="w-3 h-3" />
                                            <span className="hover:text-accent transition-colors">
                                              {wf.emoji && `${wf.emoji} `}
                                              {wf.name}
                                            </span>
                                            <span className="text-text-muted">—</span>
                                            <span className="text-text-muted truncate">
                                              {wf.description}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
