/**
 * On-Chain IDE Application
 * 
 * Full-featured code editor built into AbyssOS
 * Allows developers to build apps directly in the desktop
 */

import { useState, useRef, useEffect } from 'react';
import { useDesktopStore } from '../../../state/desktopStore';
import { useAbyssID } from '../../../hooks/useAbyssID';

interface Project {
  id: string;
  name: string;
  type: 'web-app' | 'abyssos-app' | 'rust-service' | 'node-bot';
  files: FileEntry[];
  createdAt: number;
  updatedAt: number;
}

interface FileEntry {
  path: string;
  content: string;
  type: 'file' | 'directory';
}

export function OnChainIDEApp() {
  const { session } = useAbyssID();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Load projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ide_projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load projects:', e);
      }
    }
  }, []);

  // Save projects to localStorage
  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem('ide_projects', JSON.stringify(newProjects));
  };

  const createProject = (name: string, type: Project['type']) => {
    const project: Project = {
      id: `project-${Date.now()}`,
      name,
      type,
      files: getTemplateFiles(type),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const newProjects = [...projects, project];
    saveProjects(newProjects);
    setCurrentProject(project);
    setSelectedFile(project.files[0]?.path || null);
    setCode(project.files[0]?.content || '');
  };

  const getTemplateFiles = (type: Project['type']): FileEntry[] => {
    switch (type) {
      case 'web-app':
        return [
          { path: 'package.json', content: getWebAppPackageJson(), type: 'file' },
          { path: 'src/App.tsx', content: getWebAppTemplate(), type: 'file' },
          { path: 'README.md', content: '# My Web App\n\nBuilt with Demiurge IDE', type: 'file' },
        ];
      case 'abyssos-app':
        return [
          { path: 'package.json', content: getAbyssOSAppPackageJson(), type: 'file' },
          { path: 'src/App.tsx', content: getAbyssOSAppTemplate(), type: 'file' },
          { path: 'manifest.json', content: getManifestTemplate(), type: 'file' },
        ];
      default:
        return [];
    }
  };

  const handleFileSelect = (path: string) => {
    if (!currentProject) return;
    const file = currentProject.files.find(f => f.path === path);
    if (file && file.type === 'file') {
      setSelectedFile(path);
      setCode(file.content);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (currentProject && selectedFile) {
      const updated = currentProject.files.map(f =>
        f.path === selectedFile ? { ...f, content: newCode } : f
      );
      const updatedProject = { ...currentProject, files: updated, updatedAt: Date.now() };
      setCurrentProject(updatedProject);
      const newProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
      saveProjects(newProjects);
    }
  };

  const handleBuild = async () => {
    if (!currentProject) return;
    setIsBuilding(true);
    setTerminalOutput(['Building project...']);
    
    // Simulate build process
    setTimeout(() => {
      setTerminalOutput(prev => [...prev, '✓ Dependencies installed', '✓ TypeScript compiled', '✓ Bundle created', '✓ Build successful!']);
      setIsBuilding(false);
    }, 2000);
  };

  const handleDeploy = async () => {
    if (!currentProject || !session) return;
    setIsDeploying(true);
    setTerminalOutput(['Deploying to staging...']);
    
    // Simulate deployment
    setTimeout(() => {
      setTerminalOutput(prev => [...prev, '✓ Project deployed to staging', '✓ Available at: https://staging.demiurge.cloud/apps/' + currentProject.id]);
      setIsDeploying(false);
    }, 3000);
  };

  const handleSubmit = async () => {
    if (!currentProject || !session) {
      alert('Please log in to submit apps');
      return;
    }
    
    // Create manifest
    const manifest = {
      id: currentProject.id,
      name: currentProject.name,
      version: '1.0.0',
      description: 'Built with On-Chain IDE',
      author: {
        username: session.username,
        address: session.publicKey,
      },
      category: 'productivity',
      icon: '💻',
      entry: 'src/App.tsx',
      files: currentProject.files,
    };
    
    // In production, this would:
    // 1. Create a GitHub branch
    // 2. Commit files
    // 3. Create PR
    // 4. Show submission status
    
    alert(`App "${currentProject.name}" submitted for review!\n\nA pull request will be created on GitHub.`);
  };

  if (!currentProject) {
    return (
      <div className="w-full h-full bg-abyss-dark text-white p-8">
        <h2 className="text-2xl font-bold text-abyss-cyan mb-6">On-Chain IDE</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => createProject('My Web App', 'web-app')}
                className="p-4 bg-abyss-navy/50 border border-abyss-cyan/30 rounded-lg hover:bg-abyss-cyan/20 transition-colors"
              >
                <div className="text-2xl mb-2">🌐</div>
                <div className="font-semibold">Web App</div>
                <div className="text-sm text-gray-400">Next.js dApp template</div>
              </button>
              
              <button
                onClick={() => createProject('My AbyssOS App', 'abyssos-app')}
                className="p-4 bg-abyss-navy/50 border border-abyss-cyan/30 rounded-lg hover:bg-abyss-cyan/20 transition-colors"
              >
                <div className="text-2xl mb-2">🖥️</div>
                <div className="font-semibold">AbyssOS App</div>
                <div className="text-sm text-gray-400">AbyssOS application</div>
              </button>
            </div>
          </div>
          
          {projects.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
              <div className="space-y-2">
                {projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setCurrentProject(project);
                      setSelectedFile(project.files[0]?.path || null);
                      setCode(project.files[0]?.content || '');
                    }}
                    className="w-full p-3 bg-abyss-navy/30 border border-abyss-cyan/20 rounded-lg hover:bg-abyss-cyan/10 transition-colors text-left"
                  >
                    <div className="font-semibold">{project.name}</div>
                    <div className="text-sm text-gray-400">{project.type}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-abyss-dark text-white flex flex-col">
      {/* Toolbar */}
      <div className="h-12 bg-abyss-navy/50 border-b border-abyss-cyan/20 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-abyss-cyan">{currentProject.name}</span>
          <span className="text-xs text-gray-400">{currentProject.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBuild}
            disabled={isBuilding}
            className="px-4 py-1 bg-abyss-cyan/20 hover:bg-abyss-cyan/30 rounded text-sm disabled:opacity-50"
          >
            {isBuilding ? 'Building...' : 'Build'}
          </button>
          <button
            onClick={handleDeploy}
            disabled={isDeploying || !session}
            className="px-4 py-1 bg-abyss-cyan/20 hover:bg-abyss-cyan/30 rounded text-sm disabled:opacity-50"
          >
            {isDeploying ? 'Deploying...' : 'Deploy'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!session}
            className="px-4 py-1 bg-green-500/20 hover:bg-green-500/30 rounded text-sm disabled:opacity-50"
          >
            Submit for Review
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* File Browser */}
        <div className="w-64 bg-abyss-navy/30 border-r border-abyss-cyan/20 overflow-y-auto p-2">
          <div className="text-xs text-gray-400 mb-2">Files</div>
          {currentProject.files.map(file => (
            <button
              key={file.path}
              onClick={() => handleFileSelect(file.path)}
              className={`w-full text-left px-2 py-1 rounded text-sm mb-1 ${
                selectedFile === file.path
                  ? 'bg-abyss-cyan/20 text-abyss-cyan'
                  : 'hover:bg-abyss-cyan/10 text-gray-300'
              }`}
            >
              {file.type === 'directory' ? '📁' : '📄'} {file.path}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedFile && (
            <>
              <div className="h-8 bg-abyss-navy/40 border-b border-abyss-cyan/20 px-4 flex items-center text-sm">
                {selectedFile}
              </div>
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="flex-1 w-full bg-abyss-dark text-white font-mono text-sm p-4 resize-none focus:outline-none"
                spellCheck={false}
              />
            </>
          )}
        </div>
      </div>

      {/* Terminal */}
      <div className="h-48 bg-black border-t border-abyss-cyan/20 flex flex-col">
        <div className="h-6 bg-abyss-navy/50 px-4 flex items-center text-xs text-gray-400">
          Terminal
        </div>
        <div className="flex-1 overflow-y-auto p-2 font-mono text-xs text-green-400">
          {terminalOutput.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Template functions
function getWebAppPackageJson(): string {
  return JSON.stringify({
    name: 'my-web-app',
    version: '1.0.0',
    dependencies: {
      '@demiurge/ts-sdk': '^1.0.0',
      'next': '^16.0.0',
      'react': '^18.0.0',
    },
  }, null, 2);
}

function getWebAppTemplate(): string {
  return `import { useUrgeID } from '@demiurge/ts-sdk';

export default function App() {
  const { identity, balance } = useUrgeID();
  
  return (
    <div>
      <h1>My Web App</h1>
      {identity && (
        <div>
          <p>Address: {identity.address}</p>
          <p>Balance: {balance} CGT</p>
        </div>
      )}
    </div>
  );
}`;
}

function getAbyssOSAppPackageJson(): string {
  return JSON.stringify({
    name: 'my-abyssos-app',
    version: '1.0.0',
    dependencies: {
      'react': '^18.0.0',
    },
  }, null, 2);
}

function getAbyssOSAppTemplate(): string {
  return `import { useState } from 'react';

export function MyAbyssOSApp() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4">
      <h1>My AbyssOS App</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}`;
}

function getManifestTemplate(): string {
  return JSON.stringify({
    id: 'my-abyssos-app',
    name: 'My AbyssOS App',
    version: '1.0.0',
    description: 'Built with On-Chain IDE',
    category: 'productivity',
    icon: '💻',
    entry: 'src/App.tsx',
  }, null, 2);
}
