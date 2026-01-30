import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  Organization,
  Chatbot,
  Workflow,
  NavigationState,
  Credential,
  Link,
  Agent,
  TimelineEntry,
} from '../types';

interface AppStore {
  // Data
  organizations: Organization[];
  chatbots: Chatbot[];
  workflows: Workflow[];
  
  // UI State
  navigation: NavigationState;
  searchQuery: string;
  expandedOrgs: Set<string>;
  expandedChatbots: Set<string>;
  
  // Navigation actions
  navigate: (nav: NavigationState) => void;
  setSearchQuery: (query: string) => void;
  toggleOrgExpanded: (orgId: string) => void;
  toggleChatbotExpanded: (chatbotId: string) => void;
  
  // Organization actions
  addOrganization: (name: string, description: string) => Organization;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;
  deleteOrganization: (id: string) => void;
  
  // Chatbot actions
  addChatbot: (orgId: string, name: string, description: string) => Chatbot;
  updateChatbot: (id: string, updates: Partial<Chatbot>) => void;
  deleteChatbot: (id: string) => void;
  addCredential: (chatbotId: string, credential: Omit<Credential, 'id'>) => void;
  updateCredential: (chatbotId: string, credentialId: string, updates: Partial<Credential>) => void;
  deleteCredential: (chatbotId: string, credentialId: string) => void;
  addLink: (chatbotId: string, link: Omit<Link, 'id'>) => void;
  updateLink: (chatbotId: string, linkId: string, updates: Partial<Link>) => void;
  deleteLink: (chatbotId: string, linkId: string) => void;
  
  // Workflow actions
  addWorkflow: (chatbotId: string, name: string, description: string, url: string, emoji?: string) => Workflow;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  addAgent: (workflowId: string, agent: Omit<Agent, 'id'>) => void;
  updateAgent: (workflowId: string, agentId: string, updates: Partial<Agent>) => void;
  deleteAgent: (workflowId: string, agentId: string) => void;
  addTimelineEntry: (workflowId: string, entry: Omit<TimelineEntry, 'id' | 'timestamp'>) => void;
  
  // Data persistence
  loadData: () => void;
  saveData: () => void;
  
  // Getters
  getOrganization: (id: string) => Organization | undefined;
  getChatbot: (id: string) => Chatbot | undefined;
  getWorkflow: (id: string) => Workflow | undefined;
  getChatbotsByOrg: (orgId: string) => Chatbot[];
  getWorkflowsByChatbot: (chatbotId: string) => Workflow[];
  
  // Search
  searchAll: (query: string) => {
    organizations: Organization[];
    chatbots: Chatbot[];
    workflows: Workflow[];
  };
}

const DATA_PATH = './data';

// Helper to get current timestamp
const now = () => new Date().toISOString();

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  organizations: [],
  chatbots: [],
  workflows: [],
  navigation: { view: 'home' },
  searchQuery: '',
  expandedOrgs: new Set<string>(),
  expandedChatbots: new Set<string>(),
  
  // Navigation
  navigate: (nav) => set({ navigation: nav }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleOrgExpanded: (orgId) => set((state) => {
    const newSet = new Set(state.expandedOrgs);
    if (newSet.has(orgId)) {
      newSet.delete(orgId);
    } else {
      newSet.add(orgId);
    }
    return { expandedOrgs: newSet };
  }),
  toggleChatbotExpanded: (chatbotId) => set((state) => {
    const newSet = new Set(state.expandedChatbots);
    if (newSet.has(chatbotId)) {
      newSet.delete(chatbotId);
    } else {
      newSet.add(chatbotId);
    }
    return { expandedChatbots: newSet };
  }),
  
  // Organization CRUD
  addOrganization: (name, description) => {
    const org: Organization = {
      id: uuidv4(),
      name,
      description,
      createdAt: now(),
      updatedAt: now(),
    };
    set((state) => ({ organizations: [...state.organizations, org] }));
    get().saveData();
    return org;
  },
  updateOrganization: (id, updates) => {
    set((state) => ({
      organizations: state.organizations.map((org) =>
        org.id === id ? { ...org, ...updates, updatedAt: now() } : org
      ),
    }));
    get().saveData();
  },
  deleteOrganization: (id) => {
    const chatbotIds = get().chatbots.filter(c => c.orgId === id).map(c => c.id);
    set((state) => ({
      organizations: state.organizations.filter((org) => org.id !== id),
      chatbots: state.chatbots.filter((c) => c.orgId !== id),
      workflows: state.workflows.filter((w) => !chatbotIds.includes(w.chatbotId)),
    }));
    get().saveData();
  },
  
  // Chatbot CRUD
  addChatbot: (orgId, name, description) => {
    const chatbot: Chatbot = {
      id: uuidv4(),
      orgId,
      name,
      description,
      credentials: [],
      links: [],
      testerData: '',
      createdAt: now(),
      updatedAt: now(),
    };
    set((state) => ({ chatbots: [...state.chatbots, chatbot] }));
    get().saveData();
    return chatbot;
  },
  updateChatbot: (id, updates) => {
    set((state) => ({
      chatbots: state.chatbots.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: now() } : c
      ),
    }));
    get().saveData();
  },
  deleteChatbot: (id) => {
    set((state) => ({
      chatbots: state.chatbots.filter((c) => c.id !== id),
      workflows: state.workflows.filter((w) => w.chatbotId !== id),
    }));
    get().saveData();
  },
  addCredential: (chatbotId, credential) => {
    const newCred = { ...credential, id: uuidv4() };
    set((state) => ({
      chatbots: state.chatbots.map((c) =>
        c.id === chatbotId
          ? { ...c, credentials: [...c.credentials, newCred], updatedAt: now() }
          : c
      ),
    }));
    get().saveData();
  },
  updateCredential: (chatbotId, credentialId, updates) => {
    set((state) => ({
      chatbots: state.chatbots.map((c) =>
        c.id === chatbotId
          ? {
              ...c,
              credentials: c.credentials.map((cred) =>
                cred.id === credentialId ? { ...cred, ...updates } : cred
              ),
              updatedAt: now(),
            }
          : c
      ),
    }));
    get().saveData();
  },
  deleteCredential: (chatbotId, credentialId) => {
    set((state) => ({
      chatbots: state.chatbots.map((c) =>
        c.id === chatbotId
          ? {
              ...c,
              credentials: c.credentials.filter((cred) => cred.id !== credentialId),
              updatedAt: now(),
            }
          : c
      ),
    }));
    get().saveData();
  },
  addLink: (chatbotId, link) => {
    const newLink = { ...link, id: uuidv4() };
    set((state) => ({
      chatbots: state.chatbots.map((c) =>
        c.id === chatbotId
          ? { ...c, links: [...c.links, newLink], updatedAt: now() }
          : c
      ),
    }));
    get().saveData();
  },
  updateLink: (chatbotId, linkId, updates) => {
    set((state) => ({
      chatbots: state.chatbots.map((c) =>
        c.id === chatbotId
          ? {
              ...c,
              links: c.links.map((link) =>
                link.id === linkId ? { ...link, ...updates } : link
              ),
              updatedAt: now(),
            }
          : c
      ),
    }));
    get().saveData();
  },
  deleteLink: (chatbotId, linkId) => {
    set((state) => ({
      chatbots: state.chatbots.map((c) =>
        c.id === chatbotId
          ? {
              ...c,
              links: c.links.filter((link) => link.id !== linkId),
              updatedAt: now(),
            }
          : c
      ),
    }));
    get().saveData();
  },
  
  // Workflow CRUD
  addWorkflow: (chatbotId, name, description, url, emoji) => {
    const workflow: Workflow = {
      id: uuidv4(),
      chatbotId,
      name,
      emoji,
      description,
      url,
      agents: [],
      timeline: [],
      createdAt: now(),
      updatedAt: now(),
    };
    set((state) => ({ workflows: [...state.workflows, workflow] }));
    get().saveData();
    return workflow;
  },
  updateWorkflow: (id, updates) => {
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === id ? { ...w, ...updates, updatedAt: now() } : w
      ),
    }));
    get().saveData();
  },
  deleteWorkflow: (id) => {
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
    }));
    get().saveData();
  },
  addAgent: (workflowId, agent) => {
    const newAgent = { ...agent, id: uuidv4() };
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId
          ? { ...w, agents: [...w.agents, newAgent], updatedAt: now() }
          : w
      ),
    }));
    get().saveData();
  },
  updateAgent: (workflowId, agentId, updates) => {
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              agents: w.agents.map((a) =>
                a.id === agentId ? { ...a, ...updates } : a
              ),
              updatedAt: now(),
            }
          : w
      ),
    }));
    get().saveData();
  },
  deleteAgent: (workflowId, agentId) => {
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              agents: w.agents.filter((a) => a.id !== agentId),
              updatedAt: now(),
            }
          : w
      ),
    }));
    get().saveData();
  },
  addTimelineEntry: (workflowId, entry) => {
    const newEntry: TimelineEntry = {
      ...entry,
      id: uuidv4(),
      timestamp: now(),
    };
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === workflowId
          ? { ...w, timeline: [newEntry, ...w.timeline], updatedAt: now() }
          : w
      ),
    }));
    get().saveData();
  },
  
  // Persistence (will be implemented with Tauri fs API)
  loadData: () => {
    // For now, load from localStorage as fallback
    try {
      const data = localStorage.getItem('botdocs_data');
      if (data) {
        const parsed = JSON.parse(data);
        set({
          organizations: parsed.organizations || [],
          chatbots: parsed.chatbots || [],
          workflows: parsed.workflows || [],
        });
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  },
  saveData: () => {
    // For now, save to localStorage as fallback
    try {
      const { organizations, chatbots, workflows } = get();
      localStorage.setItem('botdocs_data', JSON.stringify({
        organizations,
        chatbots,
        workflows,
      }));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  },
  
  // Getters
  getOrganization: (id) => get().organizations.find((o) => o.id === id),
  getChatbot: (id) => get().chatbots.find((c) => c.id === id),
  getWorkflow: (id) => get().workflows.find((w) => w.id === id),
  getChatbotsByOrg: (orgId) => get().chatbots.filter((c) => c.orgId === orgId),
  getWorkflowsByChatbot: (chatbotId) => get().workflows.filter((w) => w.chatbotId === chatbotId),
  
  // Search
  searchAll: (query) => {
    const q = query.toLowerCase();
    const { organizations, chatbots, workflows } = get();
    
    return {
      organizations: organizations.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
      ),
      chatbots: chatbots.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.testerData.toLowerCase().includes(q) ||
          c.credentials.some(
            (cred) =>
              cred.label.toLowerCase().includes(q) ||
              cred.service.toLowerCase().includes(q)
          )
      ),
      workflows: workflows.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.agents.some(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.role.toLowerCase().includes(q)
          )
      ),
    };
  },
}));
