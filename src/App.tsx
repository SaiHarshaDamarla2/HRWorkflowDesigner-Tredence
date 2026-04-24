import './App.css'

// Features
import { Sidebar } from './features/canvas/Sidebar';
import { WorkflowCanvas } from './features/canvas/WorkflowCanvas';
import { NodeConfigPanel } from './features/forms/NodeConfigPanel'; 
// Components
import { Topbar } from './components/Topbar';
// For Toast Notifcations
import { Toaster } from 'sonner';
// Enabling keyboard shortcuts
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Footer } from './components/Footer';

function App() {
  useKeyboardShortcuts();
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Toaster with professional settings */}
      <Toaster position="bottom-right" richColors expand={false} />

      {/* Top Navigation */}
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar for Drag & Drop */}
        <Sidebar />
        
        {/* Main Graph Canvas */}
        <main className="flex-1 relative">
          <WorkflowCanvas />
        </main>

        {/* Right Sidebar for Node Configuration */}
        <NodeConfigPanel />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App;
