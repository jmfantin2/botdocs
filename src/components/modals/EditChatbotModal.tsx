import { useState } from 'react';
import { Modal } from './Modal';
import { useAppStore } from '../../store';
import type { Chatbot } from '../../types';
import { Pipette } from 'lucide-react';

const PRESET_COLORS = [
  // Row 1
  '#64748b', // Slate (default)
  '#6b7280', // Gray
  '#78716c', // Stone
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#22c55e', // Green
  '#10b981', // Emerald
  // Row 2
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#0ea5e9', // Sky
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#a855f7', // Purple
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  // 20th slot is the color picker
];

interface EditChatbotModalProps {
  chatbot: Chatbot;
  onClose: () => void;
}

export function EditChatbotModal({ chatbot, onClose }: EditChatbotModalProps) {
  const { updateChatbot, setActiveAccentColor } = useAppStore();
  const [name, setName] = useState(chatbot.name);
  const [description, setDescription] = useState(chatbot.description);
  const [accentColor, setAccentColor] = useState(
    chatbot.accentColor || '#64748b',
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateChatbot(chatbot.id, {
      name: name.trim(),
      description: description.trim(),
      accentColor: accentColor,
    });
    setActiveAccentColor(accentColor);
    onClose();
  };

  return (
    <Modal title="Edit Chatbot" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Accent Color
          </label>
          <div className="grid grid-cols-10 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setAccentColor(color)}
                className={`w-8 h-8 rounded-lg transition-all ${
                  accentColor === color
                    ? 'ring-2 ring-offset-2 ring-offset-bg-secondary ring-white scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <label
              className={`w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center transition-all bg-gradient-to-br from-red-500 via-green-500 to-blue-500 ${
                !PRESET_COLORS.includes(accentColor)
                  ? 'ring-2 ring-offset-2 ring-offset-bg-secondary ring-white scale-110'
                  : 'hover:scale-105'
              }`}
              title="Custom color"
            >
              <Pipette className="w-4 h-4 text-white drop-shadow-md" />
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="sr-only"
              />
            </label>
          </div>
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
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
