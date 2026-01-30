# BotDocs

A local-first documentation portal for managing WhatsApp chatbots, n8n workflows, and AI agents.

## Features

- **Organizations** → Group chatbots by client/project
- **Chatbots** → Document credentials, links, and tester data
- **Workflows** → Track n8n workflows with agents and version history
- **Timeline** → Log changes and upload n8n JSON exports
- **Search** → Find anything across orgs, chatbots, and workflows
- **Dark Theme** → Dracula-inspired UI with accent colors

## Quick Start

### Prerequisites

- Node.js 18+
- For desktop app: Rust (for Tauri)

### Development (Web)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:1420

### Build Desktop App (Tauri)

```bash
# Install Tauri CLI
npm install -g @tauri-apps/cli

# Initialize Tauri (first time only)
npm run tauri init

# Build
npm run tauri build
```

## Data Storage

All data is stored in `localStorage` (web) or local JSON files (Tauri).

For backups, commit the entire project folder to a private Git repo:

```bash
git init
git add .
git commit -m "Backup"
git remote add origin <your-private-repo>
git push
```

## Project Structure

```
botdocs/
├── src/
│   ├── components/
│   │   ├── modals/       # All modal dialogs
│   │   ├── views/        # Main content views
│   │   ├── Sidebar.tsx   # Navigation sidebar
│   │   ├── SearchBar.tsx # Global search
│   │   └── MainContent.tsx
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
└── tailwind.config.js
```

## Tech Stack

- **React 18** + TypeScript
- **Vite** for bundling
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Tauri** (optional) for desktop app
- **Lucide** for icons
- **react-markdown** for Markdown rendering

## License

Private use only.
