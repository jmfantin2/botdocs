import { useState } from 'react';
import { Modal } from './Modal';
import { useAppStore } from '../../store';
import type { Credential } from '../../types';

interface CredentialModalProps {
  chatbotId: string;
  credential?: Credential;
  onClose: () => void;
}

export function CredentialModal({ chatbotId, credential, onClose }: CredentialModalProps) {
  const { addCredential, updateCredential } = useAppStore();
  const [label, setLabel] = useState(credential?.label || '');
  const [service, setService] = useState(credential?.service || '');
  const [identifier, setIdentifier] = useState(credential?.identifier || '');
  const [notes, setNotes] = useState(credential?.notes || '');

  const isEdit = !!credential;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !service.trim() || !identifier.trim()) return;

    const data = {
      label: label.trim(),
      service: service.trim(),
      identifier: identifier.trim(),
      notes: notes.trim() || undefined,
    };

    if (isEdit) {
      updateCredential(chatbotId, credential.id, data);
    } else {
      addCredential(chatbotId, data);
    }
    onClose();
  };

  return (
    <Modal title={isEdit ? 'Edit Credential' : 'Add Credential'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Label *
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Main WhatsApp Account"
            className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Service *
          </label>
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="e.g., Z-API, Quacker.io, Meta Business"
            className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Identifier *
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="e.g., email@example.com, +5511999999999"
            className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes..."
            rows={2}
            className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors resize-none"
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
            disabled={!label.trim() || !service.trim() || !identifier.trim()}
            className="px-4 py-2 rounded-lg bg-accent text-bg-primary font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEdit ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
