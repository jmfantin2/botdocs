import { useAppStore } from '../store';
import { HomeView } from './views/HomeView';
import { OrgView } from './views/OrgView';
import { ChatbotView } from './views/ChatbotView';
import { WorkflowView } from './views/WorkflowView';

export function MainContent() {
  const navigation = useAppStore((s) => s.navigation);

  return (
    <main className="flex-1 overflow-y-auto bg-bg-primary">
      {navigation.view === 'home' && <HomeView />}
      {navigation.view === 'org' && navigation.orgId && (
        <OrgView orgId={navigation.orgId} />
      )}
      {navigation.view === 'chatbot' && navigation.chatbotId && (
        <ChatbotView chatbotId={navigation.chatbotId} />
      )}
      {navigation.view === 'workflow' && navigation.workflowId && (
        <WorkflowView workflowId={navigation.workflowId} />
      )}
    </main>
  );
}
