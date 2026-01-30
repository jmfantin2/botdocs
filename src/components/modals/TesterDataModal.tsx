import { useState } from 'react';
import { Modal } from './Modal';
import { useAppStore } from '../../store';
import type { Chatbot } from '../../types';

interface TesterDataModalProps {
  chatbot: Chatbot;
  onClose: () => void;
}

export function TesterDataModal({ chatbot, onClose }: TesterDataModalProps) {
  const updateChatbot = useAppStore((s) => s.updateChatbot);
  const [testerData, setTesterData] = useState(chatbot.testerData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateChatbot(chatbot.id, { testerData });
    onClose();
  };

  return (
    <Modal title="Edit Tester Data" onClose={onClose} width="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Tester Data (Markdown)
          </label>
          <textarea
            value={testerData}
            onChange={(e) => setTesterData(e.target.value)}
            placeholder={`# Test Users

| Name | Phone | Notes |
|------|-------|-------|
| John | +5511999999999 | Main tester |

## Database Test Rows
- User ID: \`abc-123\`
- Order ID: \`order-456\`
`}
            rows={15}
            className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors resize-none font-mono text-sm"
            autoFocus
          />
          <p className="text-xs text-text-muted mt-1.5">
            Supports Markdown: headers, lists, tables, code blocks, etc.
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
            className="px-4 py-2 rounded-lg bg-accent text-bg-primary font-medium hover:bg-accent-hover transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
