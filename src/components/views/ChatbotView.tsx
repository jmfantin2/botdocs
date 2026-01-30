import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Bot,
  Workflow,
  Edit2,
  Trash2,
  MoreVertical,
  Plus,
  Key,
  Link as LinkIcon,
  ExternalLink,
  TestTube,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../../store';
import type { Credential, Link } from '../../types';
import { EditChatbotModal } from '../modals/EditChatbotModal';
import { ConfirmModal } from '../modals/ConfirmModal';
import { CredentialModal } from '../modals/CredentialModal';
import { LinkModal } from '../modals/LinkModal';
import { TesterDataModal } from '../modals/TesterDataModal';

interface ChatbotViewProps {
  chatbotId: string;
}

export function ChatbotView({ chatbotId }: ChatbotViewProps) {
  const {
    getChatbot,
    getOrganization,
    getWorkflowsByChatbot,
    navigate,
    deleteChatbot,
    deleteCredential,
    deleteLink,
  } = useAppStore();

  const chatbot = getChatbot(chatbotId);
  const org = chatbot ? getOrganization(chatbot.orgId) : undefined;
  const workflows = chatbot ? getWorkflowsByChatbot(chatbot.id) : [];

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editCredential, setEditCredential] = useState<Credential | null>(null);
  const [showAddCredential, setShowAddCredential] = useState(false);
  const [editLink, setEditLink] = useState<Link | null>(null);
  const [showAddLink, setShowAddLink] = useState(false);
  const [showTesterData, setShowTesterData] = useState(false);
  const [deleteCredentialId, setDeleteCredentialId] = useState<string | null>(null);
  const [deleteLinkId, setDeleteLinkId] = useState<string | null>(null);

  if (!chatbot || !org) {
    return (
      <div className="p-8 text-center text-text-muted">Chatbot not found</div>
    );
  }

  const handleDelete = () => {
    deleteChatbot(chatbotId);
    navigate({ view: 'org', orgId: org.id });
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
        <span className="text-text-primary">{chatbot.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-accent-muted rounded-xl flex items-center justify-center">
            <Bot className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {chatbot.name}
            </h1>
            {chatbot.description && (
              <p className="text-text-secondary mt-1">{chatbot.description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
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

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Credentials */}
          <section className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-accent" />
                <h2 className="font-medium text-text-primary">Credentials</h2>
              </div>
              <button
                onClick={() => setShowAddCredential(true)}
                className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-accent transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2">
              {chatbot.credentials.length === 0 ? (
                <div className="px-3 py-4 text-sm text-text-muted text-center">
                  No credentials added yet
                </div>
              ) : (
                <div className="space-y-1">
                  {chatbot.credentials.map((cred) => (
                    <div
                      key={cred.id}
                      className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-tertiary transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-primary">
                            {cred.label}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-bg-elevated rounded text-text-muted">
                            {cred.service}
                          </span>
                        </div>
                        <div className="text-xs text-text-muted mt-0.5">
                          {cred.identifier}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditCredential(cred)}
                          className="p-1.5 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteCredentialId(cred.id)}
                          className="p-1.5 rounded hover:bg-bg-elevated text-text-muted hover:text-status-error transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Links */}
          <section className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-accent" />
                <h2 className="font-medium text-text-primary">Links</h2>
              </div>
              <button
                onClick={() => setShowAddLink(true)}
                className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-accent transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2">
              {chatbot.links.length === 0 ? (
                <div className="px-3 py-4 text-sm text-text-muted text-center">
                  No links added yet
                </div>
              ) : (
                <div className="space-y-1">
                  {chatbot.links.map((link) => (
                    <div
                      key={link.id}
                      className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-tertiary transition-colors"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-text-primary hover:text-accent transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {link.label}
                      </a>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditLink(link)}
                          className="p-1.5 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteLinkId(link.id)}
                          className="p-1.5 rounded hover:bg-bg-elevated text-text-muted hover:text-status-error transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Tester Data */}
          <section className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <TestTube className="w-4 h-4 text-accent" />
                <h2 className="font-medium text-text-primary">Tester Data</h2>
              </div>
              <button
                onClick={() => setShowTesterData(true)}
                className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-accent transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              {chatbot.testerData ? (
                <div className="markdown-content text-sm">
                  <ReactMarkdown>{chatbot.testerData}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-sm text-text-muted text-center py-2">
                  No tester data added yet
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Workflows */}
        <div>
          <section className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-accent" />
                <h2 className="font-medium text-text-primary">Workflows</h2>
              </div>
              <span className="text-xs text-text-muted bg-bg-tertiary px-2 py-1 rounded">
                {workflows.length}
              </span>
            </div>
            <div className="p-2">
              {workflows.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <Workflow className="w-10 h-10 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-muted">No workflows yet</p>
                  <p className="text-xs text-text-muted mt-1">
                    Add one using the + button in the sidebar
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {workflows.map((wf) => (
                    <button
                      key={wf.id}
                      onClick={() =>
                        navigate({
                          view: 'workflow',
                          orgId: org.id,
                          chatbotId: chatbot.id,
                          workflowId: wf.id,
                        })
                      }
                      className="w-full flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-bg-tertiary text-left transition-colors group"
                    >
                      <div className="w-8 h-8 bg-bg-elevated rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent-muted transition-colors">
                        {wf.emoji ? (
                          <span className="text-base">{wf.emoji}</span>
                        ) : (
                          <Workflow className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-text-primary text-sm">
                          {wf.name}
                        </div>
                        <div className="text-xs text-text-muted mt-0.5 line-clamp-2">
                          {wf.description}
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-2xs text-text-muted">
                          <span>{wf.agents.length} agents</span>
                          <span>{wf.timeline.length} entries</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      {showEdit && (
        <EditChatbotModal chatbot={chatbot} onClose={() => setShowEdit(false)} />
      )}
      {showDelete && (
        <ConfirmModal
          title="Delete Chatbot"
          message={`Are you sure you want to delete "${chatbot.name}"? This will also delete all workflows within it.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          destructive
        />
      )}
      {(showAddCredential || editCredential) && (
        <CredentialModal
          chatbotId={chatbot.id}
          credential={editCredential || undefined}
          onClose={() => {
            setShowAddCredential(false);
            setEditCredential(null);
          }}
        />
      )}
      {(showAddLink || editLink) && (
        <LinkModal
          chatbotId={chatbot.id}
          link={editLink || undefined}
          onClose={() => {
            setShowAddLink(false);
            setEditLink(null);
          }}
        />
      )}
      {showTesterData && (
        <TesterDataModal
          chatbot={chatbot}
          onClose={() => setShowTesterData(false)}
        />
      )}
      {deleteCredentialId && (
        <ConfirmModal
          title="Delete Credential"
          message="Are you sure you want to delete this credential?"
          confirmLabel="Delete"
          onConfirm={() => {
            deleteCredential(chatbot.id, deleteCredentialId);
            setDeleteCredentialId(null);
          }}
          onCancel={() => setDeleteCredentialId(null)}
          destructive
        />
      )}
      {deleteLinkId && (
        <ConfirmModal
          title="Delete Link"
          message="Are you sure you want to delete this link?"
          confirmLabel="Delete"
          onConfirm={() => {
            deleteLink(chatbot.id, deleteLinkId);
            setDeleteLinkId(null);
          }}
          onCancel={() => setDeleteLinkId(null)}
          destructive
        />
      )}
    </div>
  );
}
