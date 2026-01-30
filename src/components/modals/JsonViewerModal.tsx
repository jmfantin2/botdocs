import { useState } from 'react';
import { Modal } from './Modal';
import type { TimelineEntry } from '../../types';
import { Copy, Check, Download } from 'lucide-react';

interface JsonViewerModalProps {
  entry: TimelineEntry;
  onClose: () => void;
}

export function JsonViewerModal({ entry, onClose }: JsonViewerModalProps) {
  const [copied, setCopied] = useState(false);

  let formattedJson = '';
  let parsedData: Record<string, unknown> | null = null;

  try {
    parsedData = JSON.parse(entry.content);
    formattedJson = JSON.stringify(parsedData, null, 2);
  } catch {
    formattedJson = entry.content;
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `n8n-export-${entry.timestamp.split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  // Extract workflow name if available
  const workflowName = parsedData?.name as string | undefined;

  return (
    <Modal title="n8n Export" onClose={onClose} width="xl">
      <div className="space-y-4">
        {/* Metadata */}
        <div className="flex items-center justify-between text-sm">
          <div className="text-text-muted">
            Uploaded: {formatDate(entry.timestamp)}
            {workflowName && (
              <span className="ml-3 text-text-secondary">
                Workflow: <span className="text-accent">{workflowName}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-status-success" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* JSON Content */}
        <div className="bg-bg-tertiary rounded-lg border border-border overflow-hidden">
          <pre className="p-4 text-sm font-mono text-text-secondary overflow-auto max-h-[60vh]">
            {formattedJson}
          </pre>
        </div>
      </div>
    </Modal>
  );
}
