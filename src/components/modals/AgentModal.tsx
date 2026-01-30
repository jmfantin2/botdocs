import { useState } from 'react';
import { Modal } from './Modal';
import { useAppStore } from '../../store';
import type { Agent } from '../../types';
import { Plus, X } from 'lucide-react';

interface AgentModalProps {
  workflowId: string;
  agent?: Agent;
  onClose: () => void;
}

export function AgentModal({ workflowId, agent, onClose }: AgentModalProps) {
  const { addAgent, updateAgent } = useAppStore();
  const [name, setName] = useState(agent?.name || '');
  const [role, setRole] = useState(agent?.role || '');
  const [userMessage, setUserMessage] = useState(agent?.userMessage || '');
  const [systemMessage, setSystemMessage] = useState(agent?.systemMessage || '');
  const [tools, setTools] = useState<string[]>(agent?.tools || []);
  const [newTool, setNewTool] = useState('');

  const isEdit = !!agent;

  const handleAddTool = () => {
    if (newTool.trim() && !tools.includes(newTool.trim())) {
      setTools([...tools, newTool.trim()]);
      setNewTool('');
    }
  };

  const handleRemoveTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = {
      name: name.trim(),
      role: role.trim(),
      userMessage: userMessage.trim(),
      systemMessage: systemMessage.trim(),
      tools,
    };

    if (isEdit) {
      updateAgent(workflowId, agent.id, data);
    } else {
      addAgent(workflowId, data);
    }
    onClose();
  };

  return (
    <Modal title={isEdit ? 'Edit Agent' : 'Add Agent'} onClose={onClose} width="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Intent Classifier"
              className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Classifies user intent"
              className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            System Message
          </label>
          <textarea
            value={systemMessage}
            onChange={(e) => setSystemMessage(e.target.value)}
            placeholder="The system prompt for this agent..."
            rows={4}
            className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors resize-none font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            User Message (Prompt)
          </label>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="The user message template..."
            rows={4}
            className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors resize-none font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Tools
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTool();
                }
              }}
              placeholder="Add a tool..."
              className="flex-1 px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors text-sm"
            />
            <button
              type="button"
              onClick={handleAddTool}
              className="px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-muted hover:text-accent hover:border-accent transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {tools.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tools.map((tool, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-2 py-1 bg-bg-tertiary rounded text-sm text-text-secondary"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => handleRemoveTool(i)}
                    className="p-0.5 hover:text-status-error transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-bg-tertiary text-text-primary hover:bg-bg-elevated transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-4 py-2 rounded-lg bg-accent text-bg-primary font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEdit ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
