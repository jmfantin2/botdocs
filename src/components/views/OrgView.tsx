import { useState } from 'react';
import { Building2, Bot, Workflow, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { useAppStore } from '../../store';
import { EditOrgModal } from '../modals/EditOrgModal';
import { ConfirmModal } from '../modals/ConfirmModal';

interface OrgViewProps {
  orgId: string;
}

export function OrgView({ orgId }: OrgViewProps) {
  const { getOrganization, getChatbotsByOrg, getWorkflowsByChatbot, navigate, deleteOrganization } =
    useAppStore();
  const org = getOrganization(orgId);
  const chatbots = getChatbotsByOrg(orgId);

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (!org) {
    return (
      <div className="p-8 text-center text-text-muted">Organization not found</div>
    );
  }

  const totalWorkflows = chatbots.reduce(
    (acc, c) => acc + getWorkflowsByChatbot(c.id).length,
    0
  );

  const handleDelete = () => {
    deleteOrganization(orgId);
    navigate({ view: 'home' });
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-accent-muted rounded-xl flex items-center justify-center">
            <Building2 className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">{org.name}</h1>
            {org.description && (
              <p className="text-text-secondary mt-1">{org.description}</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-accent" />
            <div>
              <div className="text-xl font-semibold text-text-primary">
                {chatbots.length}
              </div>
              <div className="text-sm text-text-muted">Chatbots</div>
            </div>
          </div>
        </div>
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Workflow className="w-5 h-5 text-accent" />
            <div>
              <div className="text-xl font-semibold text-text-primary">
                {totalWorkflows}
              </div>
              <div className="text-sm text-text-muted">Total Workflows</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbots */}
      <div>
        <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
          Chatbots
        </h2>
        {chatbots.length === 0 ? (
          <div className="bg-bg-secondary border border-border border-dashed rounded-xl p-8 text-center">
            <Bot className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No chatbots yet</p>
            <p className="text-sm text-text-muted mt-1">
              Add a chatbot using the + button in the sidebar
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {chatbots.map((chatbot) => {
              const workflows = getWorkflowsByChatbot(chatbot.id);
              return (
                <div
                  key={chatbot.id}
                  onClick={() =>
                    navigate({
                      view: 'chatbot',
                      orgId: org.id,
                      chatbotId: chatbot.id,
                    })
                  }
                  className="bg-bg-secondary border border-border rounded-xl p-4 cursor-pointer hover:border-border-hover transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-bg-tertiary rounded-lg flex items-center justify-center group-hover:bg-accent-muted transition-colors">
                      <Bot className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">{chatbot.name}</div>
                      {chatbot.description && (
                        <div className="text-sm text-text-muted mt-0.5 line-clamp-2">
                          {chatbot.description}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                        <span>{workflows.length} workflows</span>
                        <span>{chatbot.credentials.length} credentials</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showEdit && <EditOrgModal org={org} onClose={() => setShowEdit(false)} />}
      {showDelete && (
        <ConfirmModal
          title="Delete Organization"
          message={`Are you sure you want to delete "${org.name}"? This will also delete all chatbots and workflows within it.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          destructive
        />
      )}
    </div>
  );
}
