export interface Organization {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Credential {
  id: string;
  label: string;
  service: string; // e.g., "Z-API", "Quacker.io", "Meta Business"
  identifier: string; // e.g., email, phone, account ID
  notes?: string;
}

export interface Link {
  id: string;
  label: string;
  url: string;
  icon?: string; // lucide icon name
}

export interface Chatbot {
  id: string;
  orgId: string;
  name: string;
  description: string;
  credentials: Credential[];
  links: Link[];
  testerData: string; // markdown
  accentColor?: string; // hex color, e.g., "#ff6b2c"
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  userMessage: string;
  systemMessage: string;
  tools: string[];
}

export interface TimelineEntry {
  id: string;
  type: 'log' | 'export';
  timestamp: string;
  content: string; // for log: the message, for export: filename
}

export interface Workflow {
  id: string;
  chatbotId: string;
  name: string;
  emoji?: string;
  description: string;
  url: string; // n8n URL
  agents: Agent[];
  timeline: TimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

// Navigation state
export type ViewType = 'home' | 'org' | 'chatbot' | 'workflow';

export interface NavigationState {
  view: ViewType;
  orgId?: string;
  chatbotId?: string;
  workflowId?: string;
}

// Store state
export interface AppState {
  organizations: Organization[];
  chatbots: Chatbot[];
  workflows: Workflow[];
  navigation: NavigationState;
  searchQuery: string;
  expandedOrgs: Set<string>;
  expandedChatbots: Set<string>;
}
