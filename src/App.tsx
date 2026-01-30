import { useEffect } from 'react';
import { useAppStore } from './store';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { MainContent } from './components/MainContent';

const DEFAULT_ACCENT = '#64748b';

function hexToHoverColor(hex: string): string {
  // Lighten the color for hover state
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lighten = (c: number) => Math.min(255, c + 40);
  return `#${lighten(r).toString(16).padStart(2, '0')}${lighten(g).toString(16).padStart(2, '0')}${lighten(b).toString(16).padStart(2, '0')}`;
}

function App() {
  const loadData = useAppStore((s) => s.loadData);
  const activeAccentColor = useAppStore((s) => s.activeAccentColor);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Apply accent color to CSS variables
  useEffect(() => {
    const color = activeAccentColor || DEFAULT_ACCENT;
    const root = document.documentElement;
    root.style.setProperty('--color-accent', color);
    root.style.setProperty('--color-accent-hover', hexToHoverColor(color));
    root.style.setProperty('--color-accent-muted', `${color}20`);
  }, [activeAccentColor]);

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
