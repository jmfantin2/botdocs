import { useState } from 'react';
import { Modal } from './Modal';
import { useAppStore } from '../../store';
import type { Link } from '../../types';

interface LinkModalProps {
  chatbotId: string;
  link?: Link;
  onClose: () => void;
}

export function LinkModal({ chatbotId, link, onClose }: LinkModalProps) {
  const { addLink, updateLink } = useAppStore();
  const [label, setLabel] = useState(link?.label || '');
  const [url, setUrl] = useState(link?.url || '');

  const isEdit = !!link;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;

    const data = {
      label: label.trim(),
      url: url.trim(),
    };

    if (isEdit) {
      updateLink(chatbotId, link.id, data);
    } else {
      addLink(chatbotId, data);
    }
    onClose();
  };

  return (
    <Modal title={isEdit ? 'Edit Link' : 'Add Link'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Label *
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., WhatsApp Business Dashboard"
            className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            URL *
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />
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
            disabled={!label.trim() || !url.trim()}
            className="px-4 py-2 rounded-lg bg-accent text-bg-primary font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEdit ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
