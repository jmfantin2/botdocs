import { useState } from 'react';
import { Modal } from './Modal';
import { useAppStore } from '../../store';

interface LogEntryModalProps {
  workflowId: string;
  onClose: () => void;
}

export function LogEntryModal({ workflowId, onClose }: LogEntryModalProps) {
  const addTimelineEntry = useAppStore((s) => s.addTimelineEntry);
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addTimelineEntry(workflowId, {
      type: 'log',
      content: content.trim(),
    });
    onClose();
  };

  return (
    <Modal title="Add Log Entry" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Log Message (Markdown)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What did you change or update?"
            rows={5}
            className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors resize-none"
            autoFocus
          />
          <p className="text-xs text-text-muted mt-1.5">
            Supports Markdown formatting
          </p>
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
            disabled={!content.trim()}
            className="px-4 py-2 rounded-lg bg-accent text-bg-primary font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
}
