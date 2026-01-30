import { useEffect } from 'react';
import { useAppStore } from './store';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { MainContent } from './components/MainContent';

function App() {
  const loadData = useAppStore((s) => s.loadData);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SearchBar />
        <MainContent />
      </div>
    </div>
  );
}

export default App;
