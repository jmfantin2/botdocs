import { useState } from 'react';
import {
  Building2,
  Bot,
  Workflow,
  ChevronRight,
  ChevronDown,
  Plus,
  Home,
} from 'lucide-react';
import { useAppStore } from '../store';
import { AddOrgModal } from './modals/AddOrgModal';
import { AddChatbotModal } from './modals/AddChatbotModal';
import { AddWorkflowModal } from './modals/AddWorkflowModal';

export function Sidebar() {
  const {
    organizations,
    navigation,
    navigate,
    expandedOrgs,
    expandedChatbots,
    toggleOrgExpanded,
    toggleChatbotExpanded,
    getChatbotsByOrg,
    getWorkflowsByChatbot,
  } = useAppStore();

  const [showAddOrg, setShowAddOrg] = useState(false);
  const [addChatbotToOrg, setAddChatbotToOrg] = useState<string | null>(null);
  const [addWorkflowToChatbot, setAddWorkflowToChatbot] = useState<
    string | null
  >(null);

  return (
    <>
      <aside className="w-72 bg-bg-secondary border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-bg-primary" />
            </div>
            <span className="font-semibold text-lg text-text-primary">
              botdocs
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {/* Home */}
          <button
            onClick={() => navigate({ view: 'home' })}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-2 ${
              navigation.view === 'home'
                ? 'bg-accent-muted text-accent'
                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Overview</span>
          </button>

          {/* Organizations */}
          <div className="mt-2">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-2xs uppercase tracking-wider text-text-muted font-medium">
                Organizations
              </span>
              <button
                onClick={() => setShowAddOrg(true)}
                className="p-1 rounded hover:bg-bg-tertiary text-text-muted hover:text-accent transition-colors"
                title="Add Organization"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-1 space-y-0.5">
              {organizations.map((org) => {
                const isExpanded = expandedOrgs.has(org.id);
                const isActive =
                  navigation.orgId === org.id && navigation.view === 'org';
                const chatbots = getChatbotsByOrg(org.id);

                return (
                  <div key={org.id}>
                    {/* Org Item */}
                    <div
                      className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-accent-muted text-accent'
                          : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                      }`}
                    >
                      <button
                        onClick={() => toggleOrgExpanded(org.id)}
                        className="p-0.5 rounded hover:bg-bg-elevated"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <Building2 className="w-4 h-4 flex-shrink-0" />
                      <span
                        onClick={() => navigate({ view: 'org', orgId: org.id })}
                        className="flex-1 text-sm truncate"
                      >
                        {org.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddChatbotToOrg(org.id);
                        }}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-bg-elevated text-text-muted hover:text-accent transition-all"
                        title="Add Chatbot"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Chatbots */}
                    {isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5 animate-fade-in">
                        {chatbots.map((chatbot) => {
                          const isChatbotExpanded = expandedChatbots.has(
                            chatbot.id,
                          );
                          const isChatbotActive =
                            navigation.chatbotId === chatbot.id &&
                            navigation.view === 'chatbot';
                          const workflows = getWorkflowsByChatbot(chatbot.id);

                          return (
                            <div key={chatbot.id}>
                              {/* Chatbot Item */}
                              <div
                                className={`group flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                  isChatbotActive
                                    ? 'bg-accent-muted text-accent'
                                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                                }`}
                              >
                                <button
                                  onClick={() =>
                                    toggleChatbotExpanded(chatbot.id)
                                  }
                                  className="p-0.5 rounded hover:bg-bg-elevated"
                                >
                                  {isChatbotExpanded ? (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <Bot className="w-4 h-4 flex-shrink-0" />
                                <span
                                  onClick={() =>
                                    navigate({
                                      view: 'chatbot',
                                      orgId: org.id,
                                      chatbotId: chatbot.id,
                                    })
                                  }
                                  className="flex-1 text-sm truncate"
                                >
                                  {chatbot.name}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAddWorkflowToChatbot(chatbot.id);
                                  }}
                                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-bg-elevated text-text-muted hover:text-accent transition-all"
                                  title="Add Workflow"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Workflows */}
                              {isChatbotExpanded && (
                                <div className="ml-6 mt-0.5 space-y-0.5 animate-fade-in">
                                  {workflows.map((workflow) => {
                                    const isWorkflowActive =
                                      navigation.workflowId === workflow.id &&
                                      navigation.view === 'workflow';

                                    return (
                                      <div
                                        key={workflow.id}
                                        onClick={() =>
                                          navigate({
                                            view: 'workflow',
                                            orgId: org.id,
                                            chatbotId: chatbot.id,
                                            workflowId: workflow.id,
                                          })
                                        }
                                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                          isWorkflowActive
                                            ? 'bg-accent-muted text-accent'
                                            : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                                        }`}
                                      >
                                        <Workflow className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="text-sm truncate">
                                          {workflow.emoji &&
                                            `${workflow.emoji} `}
                                          {workflow.name}
                                        </span>
                                      </div>
                                    );
                                  })}
                                  {workflows.length === 0 && (
                                    <div className="px-2 py-1.5 text-xs text-text-muted italic">
                                      No workflows yet
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {chatbots.length === 0 && (
                          <div className="px-2 py-1.5 text-xs text-text-muted italic">
                            No chatbots yet
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {organizations.length === 0 && (
                <div className="px-3 py-4 text-sm text-text-muted text-center">
                  <p>No organizations yet.</p>
                  <button
                    onClick={() => setShowAddOrg(true)}
                    className="mt-2 text-accent hover:text-accent-hover"
                  >
                    Create your first org →
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <div className="text-2xs text-text-muted text-center">
            v0.1.0 · Local Storage Mode
          </div>
        </div>
      </aside>

      {/* Modals */}
      {showAddOrg && <AddOrgModal onClose={() => setShowAddOrg(false)} />}
      {addChatbotToOrg && (
        <AddChatbotModal
          orgId={addChatbotToOrg}
          onClose={() => setAddChatbotToOrg(null)}
        />
      )}
      {addWorkflowToChatbot && (
        <AddWorkflowModal
          chatbotId={addWorkflowToChatbot}
          onClose={() => setAddWorkflowToChatbot(null)}
        />
      )}
    </>
  );
}
