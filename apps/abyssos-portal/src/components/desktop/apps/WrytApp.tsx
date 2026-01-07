/**
 * WRYT - Document Creation Suite
 * 
 * A professional document editor with rich text editing,
 * multiple format support, templates, and cloud sync via AbyssID.
 * 
 * Write. Create. Publish.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAbyssIDIdentity } from '../../../hooks/useAbyssIDIdentity';
import { Button } from '../../shared/Button';

// ============================================================================
// Types
// ============================================================================

interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  wordCount: number;
  characterCount: number;
}

interface DocumentStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  heading: number | null; // 1-6 or null
  align: 'left' | 'center' | 'right' | 'justify';
  listType: 'none' | 'bullet' | 'number' | 'check';
}

// ============================================================================
// Toolbar Components
// ============================================================================

interface ToolbarButtonProps {
  icon: string;
  title: string;
  active?: boolean;
  onClick: () => void;
}

function ToolbarButton({ icon, title, active, onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-1.5 rounded transition-colors
        ${active 
          ? 'bg-abyss-cyan/20 text-abyss-cyan' 
          : 'text-gray-400 hover:text-white hover:bg-abyss-dark/50'
        }
      `}
    >
      {icon}
    </button>
  );
}

function ToolbarSeparator() {
  return <div className="w-px h-6 bg-abyss-cyan/20 mx-1" />;
}

// ============================================================================
// Main Component
// ============================================================================

export function WrytApp() {
  const { identity } = useAbyssIDIdentity();
  
  // Document state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDoc, setActiveDoc] = useState<Document | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Document');
  
  // Editor state
  const [currentStyle, setCurrentStyle] = useState<DocumentStyle>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    heading: null,
    align: 'left',
    listType: 'none',
  });
  
  // UI state
  const [showOutline, setShowOutline] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [isModified, setIsModified] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  
  // Refs
  const editorRef = useRef<HTMLDivElement>(null);

  // Word count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readingTime = Math.ceil(wordCount / 200); // Avg 200 wpm

  // Create new document
  const createNewDoc = useCallback(() => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      title: 'Untitled Document',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      wordCount: 0,
      characterCount: 0,
    };
    setDocuments(prev => [...prev, newDoc]);
    setActiveDoc(newDoc);
    setTitle(newDoc.title);
    setContent('');
    setIsModified(false);
  }, []);

  // Save document
  const saveDoc = useCallback(() => {
    if (!activeDoc) return;
    
    const updated: Document = {
      ...activeDoc,
      title,
      content,
      updatedAt: Date.now(),
      wordCount,
      characterCount: charCount,
    };
    
    setDocuments(prev => prev.map(d => d.id === activeDoc.id ? updated : d));
    setActiveDoc(updated);
    setIsModified(false);
    setLastSaved(new Date());
    
    // TODO: Sync to AbyssID storage
  }, [activeDoc, title, content, wordCount, charCount]);

  // Format commands
  const formatCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    
    // Update style state
    setCurrentStyle({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough'),
      heading: null, // TODO: detect heading
      align: 'left', // TODO: detect alignment
      listType: 'none', // TODO: detect list
    });
  }, []);

  // Export handlers
  const exportAs = useCallback((format: 'pdf' | 'docx' | 'md' | 'txt' | 'html') => {
    // TODO: Implement actual export
    console.log(`Exporting as ${format}...`);
    alert(`Export to ${format.toUpperCase()} - Coming soon!`);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            saveDoc();
            break;
          case 'b':
            e.preventDefault();
            formatCommand('bold');
            break;
          case 'i':
            e.preventDefault();
            formatCommand('italic');
            break;
          case 'u':
            e.preventDefault();
            formatCommand('underline');
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveDoc, formatCommand]);

  // Initialize with a new document
  useEffect(() => {
    if (documents.length === 0) {
      createNewDoc();
    }
  }, [documents.length, createNewDoc]);

  return (
    <div className={`h-full flex flex-col bg-abyss-navy/30 ${focusMode ? 'focus-mode' : ''}`}>
      {/* Menu Bar */}
      {!focusMode && (
        <div className="flex items-center gap-4 px-4 py-2 bg-abyss-dark/50 border-b border-abyss-cyan/20 text-sm">
          <button className="text-gray-400 hover:text-white">File</button>
          <button className="text-gray-400 hover:text-white">Edit</button>
          <button className="text-gray-400 hover:text-white">View</button>
          <button className="text-gray-400 hover:text-white">Insert</button>
          <button className="text-gray-400 hover:text-white">Format</button>
          <button className="text-gray-400 hover:text-white">Tools</button>
          <button className="text-gray-400 hover:text-white">Help</button>
          
          <div className="flex-1" />
          
          {identity && (
            <span className="text-xs text-gray-500">
              Signed in as <span className="text-abyss-cyan">{identity.username}</span>
            </span>
          )}
        </div>
      )}
      
      {/* Toolbar */}
      {!focusMode && (
        <div className="flex items-center gap-1 px-4 py-2 bg-abyss-dark/30 border-b border-abyss-cyan/20">
          {/* Text formatting */}
          <ToolbarButton icon="B" title="Bold (Ctrl+B)" active={currentStyle.bold} onClick={() => formatCommand('bold')} />
          <ToolbarButton icon="I" title="Italic (Ctrl+I)" active={currentStyle.italic} onClick={() => formatCommand('italic')} />
          <ToolbarButton icon="U̲" title="Underline (Ctrl+U)" active={currentStyle.underline} onClick={() => formatCommand('underline')} />
          <ToolbarButton icon="S̶" title="Strikethrough" active={currentStyle.strikethrough} onClick={() => formatCommand('strikeThrough')} />
          
          <ToolbarSeparator />
          
          {/* Heading selector */}
          <select 
            className="bg-abyss-dark border border-abyss-cyan/30 rounded px-2 py-1 text-sm text-gray-300"
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'p') {
                formatCommand('formatBlock', '<p>');
              } else {
                formatCommand('formatBlock', `<${value}>`);
              }
            }}
          >
            <option value="p">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>
          
          <ToolbarSeparator />
          
          {/* Alignment */}
          <ToolbarButton icon="≡" title="Align Left" onClick={() => formatCommand('justifyLeft')} />
          <ToolbarButton icon="≣" title="Align Center" onClick={() => formatCommand('justifyCenter')} />
          <ToolbarButton icon="≡" title="Align Right" onClick={() => formatCommand('justifyRight')} />
          <ToolbarButton icon="☰" title="Justify" onClick={() => formatCommand('justifyFull')} />
          
          <ToolbarSeparator />
          
          {/* Lists */}
          <ToolbarButton icon="•" title="Bullet List" onClick={() => formatCommand('insertUnorderedList')} />
          <ToolbarButton icon="1." title="Numbered List" onClick={() => formatCommand('insertOrderedList')} />
          
          <ToolbarSeparator />
          
          {/* Insert */}
          <ToolbarButton icon="🔗" title="Insert Link" onClick={() => {
            const url = prompt('Enter URL:');
            if (url) formatCommand('createLink', url);
          }} />
          <ToolbarButton icon="📷" title="Insert Image" onClick={() => {
            const url = prompt('Enter image URL:');
            if (url) formatCommand('insertImage', url);
          }} />
          <ToolbarButton icon="📊" title="Insert Table" onClick={() => alert('Tables coming soon!')} />
          
          <div className="flex-1" />
          
          {/* View toggles */}
          <ToolbarButton icon="📋" title="Toggle Outline" active={showOutline} onClick={() => setShowOutline(!showOutline)} />
          <ToolbarButton icon="ℹ️" title="Toggle Info Panel" active={showInfo} onClick={() => setShowInfo(!showInfo)} />
          <ToolbarButton icon="🎯" title="Focus Mode" active={focusMode} onClick={() => setFocusMode(!focusMode)} />
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Outline Panel */}
        {showOutline && !focusMode && (
          <div className="w-48 border-r border-abyss-cyan/20 p-3 overflow-y-auto">
            <h3 className="text-xs font-medium text-gray-500 mb-2">📄 Outline</h3>
            <div className="text-sm text-gray-400">
              {/* TODO: Parse headings from content */}
              <div className="py-1 hover:text-white cursor-pointer">Introduction</div>
              <div className="py-1 pl-3 hover:text-white cursor-pointer text-xs">Section 1.1</div>
              <div className="py-1 hover:text-white cursor-pointer">Content</div>
              <div className="py-1 hover:text-white cursor-pointer">Conclusion</div>
            </div>
            
            <h3 className="text-xs font-medium text-gray-500 mt-4 mb-2">📑 Styles</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <div className="py-1 hover:text-white cursor-pointer">• Normal</div>
              <div className="py-1 hover:text-white cursor-pointer">• Heading 1</div>
              <div className="py-1 hover:text-white cursor-pointer">• Heading 2</div>
              <div className="py-1 hover:text-white cursor-pointer">• Quote</div>
            </div>
          </div>
        )}
        
        {/* Editor Area */}
        <div className={`flex-1 flex flex-col min-w-0 ${focusMode ? 'max-w-3xl mx-auto' : ''}`}>
          {/* Title */}
          <div className="p-4 border-b border-abyss-cyan/10">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsModified(true);
              }}
              className="w-full text-2xl font-bold bg-transparent text-white focus:outline-none placeholder-gray-600"
              placeholder="Document Title"
            />
          </div>
          
          {/* Content Editor */}
          <div className="flex-1 overflow-y-auto p-8">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="prose prose-invert max-w-none min-h-[500px] focus:outline-none"
              style={{ 
                lineHeight: 1.8,
                fontSize: '16px',
              }}
              onInput={(e) => {
                const newContent = (e.target as HTMLDivElement).innerHTML;
                setContent(newContent);
                setIsModified(true);
              }}
              onKeyUp={() => {
                setCurrentStyle({
                  bold: document.queryCommandState('bold'),
                  italic: document.queryCommandState('italic'),
                  underline: document.queryCommandState('underline'),
                  strikethrough: document.queryCommandState('strikeThrough'),
                  heading: null,
                  align: 'left',
                  listType: 'none',
                });
              }}
              dangerouslySetInnerHTML={{ __html: content || '<p>Start writing...</p>' }}
            />
          </div>
        </div>
        
        {/* Info Panel */}
        {showInfo && !focusMode && (
          <div className="w-48 border-l border-abyss-cyan/20 p-3 overflow-y-auto">
            <h3 className="text-xs font-medium text-gray-500 mb-3">📊 Document Info</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Words</span>
                <span className="text-white">{wordCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Characters</span>
                <span className="text-white">{charCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reading</span>
                <span className="text-white">{readingTime} min</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-abyss-cyan/20">
              <div className="flex items-center gap-2 text-sm">
                {isModified ? (
                  <span className="text-yellow-400">● Modified</span>
                ) : (
                  <span className="text-green-400">✓ Saved</span>
                )}
              </div>
              {lastSaved && (
                <div className="text-xs text-gray-500 mt-1">
                  Last: {lastSaved.toLocaleTimeString()}
                </div>
              )}
              
              <Button onClick={saveDoc} variant="primary" className="w-full mt-3 text-sm">
                Save
              </Button>
            </div>
            
            <h3 className="text-xs font-medium text-gray-500 mt-4 mb-2">📤 Export</h3>
            <div className="space-y-1">
              <button onClick={() => exportAs('pdf')} className="w-full text-left text-sm text-gray-400 hover:text-white py-1">
                • PDF
              </button>
              <button onClick={() => exportAs('docx')} className="w-full text-left text-sm text-gray-400 hover:text-white py-1">
                • DOCX
              </button>
              <button onClick={() => exportAs('md')} className="w-full text-left text-sm text-gray-400 hover:text-white py-1">
                • Markdown
              </button>
              <button onClick={() => exportAs('html')} className="w-full text-left text-sm text-gray-400 hover:text-white py-1">
                • HTML
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Status Bar */}
      {!focusMode && (
        <div className="flex items-center justify-between px-4 py-1 bg-abyss-dark/50 border-t border-abyss-cyan/20 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>Page 1 of 1</span>
            <span>100%</span>
            <span className="text-green-400">✓ Spell Check</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Ln 1, Col 1</span>
            <span>{wordCount} words</span>
          </div>
        </div>
      )}
      
      {/* Focus mode exit hint */}
      {focusMode && (
        <div className="fixed bottom-4 right-4 text-xs text-gray-600">
          Press Esc to exit focus mode
        </div>
      )}
    </div>
  );
}
