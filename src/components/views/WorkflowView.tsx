import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Workflow,
  Edit2,
  Trash2,
  MoreVertical,
  Plus,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  FileJson,
  FolderOpen,
  Eye,
  User,
  Cpu,
  Wrench,
} from 'lucide-react';
import { useAppStore } from '../../store';
import type { Agent, TimelineEntry } from '../../types';
import { EditWorkflowModal } from '../modals/EditWorkflowModal';
import { ConfirmModal } from '../modals/ConfirmModal';
import { AgentModal } from '../modals/AgentModal';
import { LogEntryModal } from '../modals/LogEntryModal';
import { JsonViewerModal } from '../modals/JsonViewerModal';

interface WorkflowViewProps {
  workflowId: string;
}

export function WorkflowView({ workflowId }: WorkflowViewProps) {
  const {
    getWorkflow,
    getChatbot,
    getOrganization,
    navigate,
    deleteWorkflow,
    deleteAgent,
    addTimelineEntry,
    setActiveAccentColor,
  } = useAppStore();

  const workflow = getWorkflow(workflowId);
  const chatbot = workflow ? getChatbot(workflow.chatbotId) : undefined;
  const org = chatbot ? getOrganization(chatbot.orgId) : undefined;

  // Set accent color from parent chatbot
  useEffect(() => {
    if (chatbot?.accentColor) {
      setActiveAccentColor(chatbot.accentColor);
    }
  }, [chatbot?.accentColor, setActiveAccentColor]);

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [deleteAgentId, setDeleteAgentId] = useState<string | null>(null);
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set());
  const [showAddLog, setShowAddLog] = useState(false);
  const [viewJsonEntry, setViewJsonEntry] = useState<TimelineEntry | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!workflow || !chatbot || !org) {
    return (
      <div className="p-8 text-center text-text-muted">Workflow not found</div>
    );
  }

  const handleDelete = () => {
    deleteWorkflow(workflowId);
    navigate({ view: 'chatbot', orgId: org.id, chatbotId: chatbot.id });
  };

  const toggleAgent = (agentId: string) => {
    setExpandedAgents((prev) => {
      const next = new Set(prev);
      if (next.has(agentId)) {
        next.delete(agentId);
      } else {
        next.add(agentId);
      }
      return next;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        // Validate JSON
        JSON.parse(content);
        // Store as timeline entry
        addTimelineEntry(workflowId, {
          type: 'export',
          content: content,
        });
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
        <button
          onClick={() => navigate({ view: 'org', orgId: org.id })}
          className="hover:text-accent transition-colors"
        >
          {org.name}
        </button>
        <ChevronRight className="w-4 h-4" />
        <button
          onClick={() =>
            navigate({ view: 'chatbot', orgId: org.id, chatbotId: chatbot.id })
          }
          className="hover:text-accent transition-colors"
        >
          {chatbot.name}
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-text-primary">
          {workflow.emoji && `${workflow.emoji} `}
          {workflow.name}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-accent-muted rounded-xl flex items-center justify-center">
            <span className="text-2xl">{workflow.emoji || '⚙️'}</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {workflow.name}
            </h1>
            {workflow.description && (
              <p className="text-text-secondary mt-1">{workflow.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* n8n URL Button */}
          {workflow.url && (
            <a
              href={workflow.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-accent text-bg-primary rounded-lg font-medium text-sm hover:bg-accent-hover transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open in n8n
            </a>
          )}

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-bg-secondary text-text-muted hover:text-text-primary transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-bg-secondary border border-border rounded-lg shadow-xl overflow-hidden z-20 animate-scale-in">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowEdit(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-bg-tertiary transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowDelete(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-status-error hover:bg-bg-tertiary transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Agents */}
        <div>
          <section className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent" />
                <h2 className="font-medium text-text-primary">Agents</h2>
              </div>
              <button
                onClick={() => setShowAddAgent(true)}
                className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-accent transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2">
              {workflow.agents.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <Cpu className="w-10 h-10 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-muted">No agents yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {workflow.agents.map((agent) => {
                    const isExpanded = expandedAgents.has(agent.id);
                    return (
                      <div
                        key={agent.id}
                        className="bg-bg-tertiary rounded-lg overflow-hidden"
                      >
                        {/* Agent Header */}
                        <div
                          className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-bg-elevated transition-colors"
                          onClick={() => toggleAgent(agent.id)}
                        >
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-text-muted" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-text-muted" />
                            )}
                            <span className="font-medium text-text-primary text-sm">
                              {agent.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditAgent(agent);
                              }}
                              className="p-1.5 rounded hover:bg-bg-secondary text-text-muted hover:text-text-primary transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteAgentId(agent.id);
                              }}
                              className="p-1.5 rounded hover:bg-bg-secondary text-text-muted hover:text-status-error transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Agent Details */}
                        {isExpanded && (
                          <div className="px-3 pb-3 pt-1 space-y-3 animate-fade-in border-t border-border/50">
                            {/* Role */}
                            <div>
                              <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                                <User className="w-3 h-3" />
                                Role
                              </div>
                              <p className="text-sm text-text-secondary">
                                {agent.role || 'No role defined'}
                              </p>
                            </div>

                            {/* System Message */}
                            {agent.systemMessage && (
                              <div>
                                <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                                  <Cpu className="w-3 h-3" />
                                  System Message
                                </div>
                                <div className="bg-bg-primary rounded-lg p-2 text-sm font-mono text-text-secondary max-h-32 overflow-y-auto">
                                  {agent.systemMessage}
                                </div>
                              </div>
                            )}

                            {/* User Message */}
                            {agent.userMessage && (
                              <div>
                                <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                                  <MessageSquare className="w-3 h-3" />
                                  User Message (Prompt)
                                </div>
                                <div className="bg-bg-primary rounded-lg p-2 text-sm font-mono text-text-secondary max-h-32 overflow-y-auto">
                                  {agent.userMessage}
                                </div>
                              </div>
                            )}

                            {/* Tools */}
                            {agent.tools.length > 0 && (
                              <div>
                                <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                                  <Wrench className="w-3 h-3" />
                                  Tools
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {agent.tools.map((tool, i) => (
                                    <span
                                      key={i}
                                      className="text-xs px-2 py-1 bg-bg-primary rounded text-text-secondary"
                                    >
                                      {tool}
                                    </span>
                                  ))}
                                </div>
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
          </section>
        </div>

        {/* Right Column - Timeline */}
        <div>
          <section className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" />
                <h2 className="font-medium text-text-primary">Timeline</h2>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowAddLog(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-accent text-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Log
                </button>
                <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-accent text-xs transition-colors cursor-pointer">
                  <FileJson className="w-3.5 h-3.5" />
                  JSON
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div className="p-2 max-h-[500px] overflow-y-auto">
              {workflow.timeline.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <MessageSquare className="w-10 h-10 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-muted">No entries yet</p>
                  <p className="text-xs text-text-muted mt-1">
                    Add logs or upload n8n exports
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {workflow.timeline.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-bg-tertiary"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          entry.type === 'log'
                            ? 'bg-status-info/20'
                            : 'bg-status-warning/20'
                        }`}
                      >
                        {entry.type === 'log' ? (
                          <MessageSquare className="w-4 h-4 text-status-info" />
                        ) : (
                          <FileJson className="w-4 h-4 text-status-warning" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-text-muted mb-1">
                          {formatDate(entry.timestamp)}
                        </div>
                        {entry.type === 'log' ? (
                          <div className="markdown-content text-sm">
                            <ReactMarkdown>{entry.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-text-secondary">
                              n8n Export
                            </span>
                            <button
                              onClick={() => setViewJsonEntry(entry)}
                              className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      {showEdit && (
        <EditWorkflowModal
          workflow={workflow}
          onClose={() => setShowEdit(false)}
        />
      )}
      {showDelete && (
        <ConfirmModal
          title="Delete Workflow"
          message={`Are you sure you want to delete "${workflow.name}"?`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          destructive
        />
      )}
      {(showAddAgent || editAgent) && (
        <AgentModal
          workflowId={workflow.id}
          agent={editAgent || undefined}
          onClose={() => {
            setShowAddAgent(false);
            setEditAgent(null);
          }}
        />
      )}
      {deleteAgentId && (
        <ConfirmModal
          title="Delete Agent"
          message="Are you sure you want to delete this agent?"
          confirmLabel="Delete"
          onConfirm={() => {
            deleteAgent(workflow.id, deleteAgentId);
            setDeleteAgentId(null);
          }}
          onCancel={() => setDeleteAgentId(null)}
          destructive
        />
      )}
      {showAddLog && (
        <LogEntryModal
          workflowId={workflow.id}
          onClose={() => setShowAddLog(false)}
        />
      )}
      {viewJsonEntry && (
        <JsonViewerModal
          entry={viewJsonEntry}
          onClose={() => setViewJsonEntry(null)}
        />
      )}
    </div>
  );
}
