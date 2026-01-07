# WRYT - Document Creation Suite

> *Write. Create. Publish.*

A professional document creation and word processing application for the Abyss ecosystem, designed for writers, publishers, designers, and creators of all kinds.

---

## Table of Contents

1. [Overview](#overview)
2. [User Experience Flow](#user-experience-flow)
3. [Document Templates](#document-templates)
4. [Core Features](#core-features)
5. [Font Library](#font-library)
6. [Export Formats](#export-formats)
7. [UI Customization](#ui-customization)
8. [Technical Architecture](#technical-architecture)
9. [File Management](#file-management)
10. [Implementation Phases](#implementation-phases)
11. [Development Progress](#development-progress)

---

## Overview

WRYT transforms document creation into an intuitive, powerful experience. Whether you're writing a novel, designing a magazine, creating professional documentation, or building a website, WRYT provides the tools and templates to bring your vision to life.

### Key Differentiators

- **Template-First Approach**: Start with professionally designed templates optimized for each document type
- **Massive Font Library**: Extensive collection of fonts for any creative need
- **Multi-Format Export**: Export to virtually any document format
- **Customizable Environment**: Personalize every aspect of your workspace
- **AbyssID Integration**: Cloud sync, collaboration, and publishing via DRC-369
- **File Tagging**: Intelligent organization with the Abyss file system

---

## User Experience Flow

### First Launch Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                              ✍️ WRYT                                        │
│                                                                              │
│                     Welcome back, @username!                                 │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                         │ │
│  │                        Your Projects                                    │ │
│  │                                                                         │ │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │
│  │   │ 📄       │  │ 📖       │  │ 📰       │  │ ⊕        │              │ │
│  │   │ My Novel │  │ Blog     │  │ E-Zine   │  │          │              │ │
│  │   │          │  │ Posts    │  │ Issue 3  │  │   NEW    │              │ │
│  │   │ Novel    │  │ Blog     │  │ Magazine │  │ PROJECT  │              │ │
│  │   │ 45% done │  │ 12 posts │  │ Draft    │  │          │              │ │
│  │   └──────────┘  └──────────┘  └──────────┘  └──────────┘              │ │
│  │                                                                         │ │
│  │   Recent Files                                                          │ │
│  │   • Chapter_15_Draft.wryt (Novel) - 2 hours ago                        │ │
│  │   • Product_Announcement.wryt (Professional) - Yesterday               │ │
│  │   • Short_Story_Contest.wryt (Short Story) - 3 days ago                │ │
│  │                                                                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### New Project Flow

```
User clicks "+" (New Project)
          ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Select Document Style                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📝 Writing              📚 Publishing           💼 Professional            │
│  ─────────────          ───────────────         ──────────────────          │
│  □ Basic Document       □ Novel                 □ Business Letter           │
│  □ Journal/Diary        □ Short Story           □ Resume/CV                 │
│  □ Notes                □ E-Book                □ Report                    │
│                         □ Children's Book       □ Proposal                  │
│  🎨 Creative            □ Artbook               □ Invoice                   │
│  ────────────                                   □ Contract                  │
│  □ Brochure             📱 Digital                                          │
│  □ Poster               ─────────────           🔧 Technical                │
│  □ Flyer                □ Blog Post             ──────────────              │
│  □ Newsletter           □ E-Zine/Magazine       □ Documentation             │
│                         □ Website (HTML/CSS)    □ README                    │
│  🎓 Academic            □ Landing Page          □ API Docs                  │
│  ────────────                                   □ Tutorial                  │
│  □ Essay                                                                     │
│  □ Research Paper                                                            │
│  □ Thesis                                                                    │
│                                                                              │
│                    [Cancel]        [Create Project]                          │
└─────────────────────────────────────────────────────────────────────────────┘
          ↓
User selects template (e.g., "Novel")
          ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Novel Configuration                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Project Name: [My New Novel                          ]                      │
│                                                                              │
│  Format Preset:                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ 📘        │  │ 📕        │  │ 📗        │  │ 📙        │            │
│  │ Standard  │  │ Large     │  │ Pocket    │  │ Custom    │            │
│  │ 6"×9"     │  │ 8.5"×11"  │  │ 5"×8"     │  │ ...       │            │
│  │ ✓ Selected│  │           │  │           │  │           │            │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘            │
│                                                                              │
│  Page Setup:                                                                 │
│  • Margins: 1" all sides                                                     │
│  • Font: Garamond 12pt                                                       │
│  • Line spacing: 1.5                                                         │
│  • Chapter headings: Centered, Bold, 18pt                                    │
│                                                                              │
│  Include:                                                                    │
│  ☑ Title Page          ☑ Table of Contents    ☐ Dedication                 │
│  ☑ Chapter Navigation  ☐ Acknowledgments      ☐ About Author               │
│                                                                              │
│                    [Back]          [Start Writing →]                         │
└─────────────────────────────────────────────────────────────────────────────┘
          ↓
User clicks "Start Writing"
          ↓
[WRYT Editor opens with pre-configured Novel template]
```

---

## Document Templates

### Template Categories

#### 📝 Writing (Basic)

| Template | Description | Default Format | Key Features |
|----------|-------------|----------------|--------------|
| **Basic Document** | General purpose document | Letter (8.5"×11") | Simple toolbar, minimal formatting |
| **Journal/Diary** | Personal writing | A5 | Date headers, mood tags, private |
| **Notes** | Quick notes and ideas | Flexible | Tags, searchable, linked notes |

#### 📚 Publishing

| Template | Description | Default Format | Key Features |
|----------|-------------|----------------|--------------|
| **Novel** | Long-form fiction | 6"×9" | Chapters, word count goals, timeline |
| **Short Story** | Short fiction | Letter | Scene breaks, contest formats |
| **E-Book** | Digital publishing | EPUB/MOBI | Reflowable, device preview |
| **Children's Book** | Illustrated books | Square/Landscape | Image placement, large text |
| **Artbook** | Visual portfolios | Large format | Full-bleed images, galleries |

#### 📰 Digital Media

| Template | Description | Default Format | Key Features |
|----------|-------------|----------------|--------------|
| **Blog Post** | Web articles | Web-optimized | SEO tools, preview, markdown |
| **E-Zine/Magazine** | Digital magazines | Custom spreads | Multi-column, pull quotes |
| **Website** | HTML/CSS pages | Web | Live preview, code/visual toggle |
| **Landing Page** | Marketing pages | Web | Sections, call-to-action |

#### 💼 Professional

| Template | Description | Default Format | Key Features |
|----------|-------------|----------------|--------------|
| **Business Letter** | Formal letters | Letter | Letterhead, signature block |
| **Resume/CV** | Job applications | Letter/A4 | Multiple layouts, ATS-friendly |
| **Report** | Business reports | Letter | Charts, tables, sections |
| **Proposal** | Project proposals | Letter | Budget tables, timelines |
| **Invoice** | Billing documents | Letter | Calculations, line items |
| **Contract** | Legal documents | Letter | Signature fields, clauses |

#### 🎨 Creative

| Template | Description | Default Format | Key Features |
|----------|-------------|----------------|--------------|
| **Brochure** | Marketing materials | Tri-fold | Panels, fold guides |
| **Poster** | Large format | Various | High-res, print marks |
| **Flyer** | Single page ads | Letter/A4 | Bold layouts |
| **Newsletter** | Periodic updates | Letter | Multi-column, recurring |

#### 🎓 Academic

| Template | Description | Default Format | Key Features |
|----------|-------------|----------------|--------------|
| **Essay** | Academic essays | Letter | Citations, bibliography |
| **Research Paper** | Research documents | Letter | Footnotes, abstract |
| **Thesis** | Graduate work | Custom | Chapters, appendices |

#### 🔧 Technical

| Template | Description | Default Format | Key Features |
|----------|-------------|----------------|--------------|
| **Documentation** | Software docs | Web/PDF | Code blocks, versioning |
| **README** | Project readmes | Markdown | GitHub-flavored |
| **API Docs** | API reference | Web | Endpoints, examples |
| **Tutorial** | How-to guides | Web/PDF | Steps, screenshots |

---

## Core Features

### Editor Interface

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  WRYT - My Novel.wryt                                    ─  □  ✕            │
├─────────────────────────────────────────────────────────────────────────────┤
│  File   Edit   View   Insert   Format   Tools   Window   Help               │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─ Toolbar (Customizable/Modular) ───────────────────────────────────────┐ │
│  │ [B] [I] [U] [S] │ Font ▾ │ Size ▾ │ ¶ │ ≡ ≡ ≡ ≡ │ 🎨 │ 📎 │ 💬 │ ⚙️ │ │
│  │ [Styles ▾] │ [Spacing ▾] │ [Lists ▾] │ [Tables ▾] │ [Media ▾] │ ... │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
├──────────────┬──────────────────────────────────────────┬──────────────────┤
│  📑 Navigator │                                          │  📊 Document     │
│  ────────────│           CHAPTER ONE                    │  ────────────────│
│              │           ══════════                     │                  │
│  ▼ Front     │                                          │  Words: 45,231   │
│    Title     │  The night was darker than any Sarah    │  Target: 80,000  │
│    Copyright │  had ever experienced. Rain pelted      │  ▓▓▓▓▓▓░░░░ 57%  │
│              │  against the windows of the old         │                  │
│  ▼ Part I    │  mansion as she crept through the      │  Pages: 142      │
│    Ch 1 ◀   │  hallway, her flashlight cutting       │  Est. Read: 3h   │
│    Ch 2      │  through the darkness like a beacon    │                  │
│    Ch 3      │  of hope in a sea of shadow.           │  📅 Session      │
│              │                                          │  Today: 1,234    │
│  ▼ Part II   │  She paused at the door to the         │  Week: 8,521     │
│    Ch 4      │  library, heart pounding. Somewhere    │                  │
│    Ch 5      │  in that room lay the answer to the   │  💾 Auto-saved   │
│              │  mystery that had haunted her family   │  2 seconds ago   │
│  ▼ Back      │  for three generations.                │                  │
│    Notes     │                                          │  📤 Export       │
│    Biblio    │  "You can do this," she whispered     │  ────────────────│
│              │  to herself, reaching for the handle.  │  EPUB  PDF  DOCX │
│              │                                          │  HTML  MD   TXT  │
├──────────────┴──────────────────────────────────────────┴──────────────────┤
│  Ch 1, Page 23  │  Ln 456, Col 12  │  1,234 words this session  │  🌙 Dark │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Feature List

#### Text Editing
- **Rich Text Formatting**: Bold, italic, underline, strikethrough, subscript, superscript
- **Paragraph Styles**: Headings (H1-H6), body, quote, code, custom styles
- **Lists**: Bulleted, numbered, checklists, multi-level
- **Alignment**: Left, center, right, justify
- **Spacing**: Line height, paragraph spacing, character spacing
- **Indentation**: First line, hanging, block indent
- **Columns**: Multi-column layouts
- **Drop Caps**: Decorative initial letters

#### Tables
- Insert/delete rows and columns
- Merge/split cells
- Cell styling (borders, backgrounds)
- Auto-fit content
- Import from CSV/Excel

#### Media
- **Images**: Insert, crop, resize, effects, captions
- **Shapes**: Lines, arrows, rectangles, circles, custom
- **Charts**: Bar, line, pie, scatter (data-driven)
- **Videos**: Embed for web exports
- **Audio**: Embed for e-book exports

#### Navigation
- **Document Outline**: Auto-generated from headings
- **Bookmarks**: Quick navigation points
- **Cross-References**: Link to sections, figures, tables
- **Index**: Auto-generated with page numbers
- **Table of Contents**: Customizable, auto-updating

#### Collaboration (Premium)
- **Comments**: Inline comments, replies, resolution
- **Track Changes**: See who changed what
- **Version History**: Browse and restore previous versions
- **Real-time Editing**: Multiple users simultaneously

#### Writing Tools
- **Word Count**: Document, selection, session, goals
- **Spell Check**: Multi-language with custom dictionary
- **Grammar Check**: AI-powered suggestions
- **Thesaurus**: Synonym suggestions
- **Find & Replace**: Regex support
- **Read Aloud**: Text-to-speech preview
- **Focus Mode**: Distraction-free writing
- **Typewriter Mode**: Keep current line centered

---

## Font Library

### Font Directory Structure

```
assets/fonts/
├── serif/
│   ├── garamond/
│   ├── times-new-roman/
│   ├── georgia/
│   ├── palatino/
│   ├── baskerville/
│   ├── bodoni/
│   └── ... (50+ serif fonts)
├── sans-serif/
│   ├── arial/
│   ├── helvetica/
│   ├── open-sans/
│   ├── roboto/
│   ├── montserrat/
│   ├── lato/
│   └── ... (50+ sans-serif fonts)
├── monospace/
│   ├── courier/
│   ├── consolas/
│   ├── fira-code/
│   ├── jetbrains-mono/
│   └── ... (20+ monospace fonts)
├── display/
│   ├── impact/
│   ├── playfair-display/
│   ├── lobster/
│   └── ... (30+ display fonts)
├── handwriting/
│   ├── dancing-script/
│   ├── pacifico/
│   └── ... (20+ handwriting fonts)
└── custom/
    └── (user-uploaded fonts)
```

### Font Placement Location

**Place your font files in:**
```
apps/abyssos-portal/public/fonts/
```

Or for the desktop app:
```
apps/abyss-explorer-desktop/resources/fonts/
```

**Supported formats:**
- `.ttf` (TrueType)
- `.otf` (OpenType)
- `.woff` (Web Open Font Format)
- `.woff2` (Web Open Font Format 2)

### Font Categories for UI

```
┌─────────────────────────────────────────────────────────────────┐
│  Select Font                                          🔍 Search │
├─────────────────────────────────────────────────────────────────┤
│  ★ Favorites (3)                                                │
│    Garamond • Open Sans • Fira Code                             │
├─────────────────────────────────────────────────────────────────┤
│  ⏱ Recent                                                       │
│    Georgia • Roboto • Montserrat • Times New Roman              │
├─────────────────────────────────────────────────────────────────┤
│  📁 Categories                                                   │
│  ├─ Serif (52)                                                  │
│  ├─ Sans Serif (48)                                             │
│  ├─ Monospace (22)                                              │
│  ├─ Display (35)                                                │
│  ├─ Handwriting (18)                                            │
│  └─ Custom (5)                                                  │
├─────────────────────────────────────────────────────────────────┤
│  Preview: The quick brown fox jumps over the lazy dog           │
│           0123456789 !@#$%^&*()                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Export Formats

### Supported Export Formats

| Format | Extension | Use Case | Features |
|--------|-----------|----------|----------|
| **PDF** | `.pdf` | Print, sharing | Page layout preserved, fonts embedded |
| **Word** | `.docx` | Editing, collaboration | Full formatting, track changes |
| **OpenDocument** | `.odt` | Open source editing | LibreOffice compatible |
| **Rich Text** | `.rtf` | Basic formatting | Universal compatibility |
| **Plain Text** | `.txt` | Raw content | No formatting |
| **Markdown** | `.md` | Technical writing | GitHub, documentation |
| **HTML** | `.html` | Web publishing | Inline styles or linked CSS |
| **HTML + CSS** | `.html/.css` | Web development | Separate stylesheet |
| **EPUB** | `.epub` | E-readers | Reflowable, metadata |
| **MOBI** | `.mobi` | Kindle | Amazon format |
| **LaTeX** | `.tex` | Academic | Typesetting |
| **JSON** | `.json` | Data export | Structured content |
| **WRYT Native** | `.wryt` | Full project | All features, metadata |

### Export Dialog

```
┌─────────────────────────────────────────────────────────────────┐
│                        Export Document                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Format: [PDF ▾]                                                 │
│                                                                  │
│  ┌─ PDF Options ─────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Page Size:    [6" × 9" (Novel) ▾]                        │  │
│  │  Orientation:  ○ Portrait  ○ Landscape                    │  │
│  │  Quality:      [Print Quality (300 DPI) ▾]                │  │
│  │                                                            │  │
│  │  ☑ Embed fonts                                             │  │
│  │  ☑ Include table of contents                               │  │
│  │  ☐ Include comments                                        │  │
│  │  ☑ Compress images                                         │  │
│  │  ☐ Password protect                                        │  │
│  │                                                            │  │
│  │  Pages:  ○ All  ○ Current  ○ Range: [    ] - [    ]       │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Save to:  [📁 My Documents/WRYT Exports/]              [Browse] │
│  Filename: [My_Novel_Final.pdf                               ]   │
│                                                                  │
│  ☑ Tag as "exported" in Abyss Files                             │
│  ☑ Add to recent exports                                         │
│                                                                  │
│                    [Cancel]              [Export]                │
└─────────────────────────────────────────────────────────────────┘
```

---

## UI Customization

### Theme System

```
┌─────────────────────────────────────────────────────────────────┐
│                     Appearance Settings                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Theme:                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ ████████ │  │ ░░░░░░░░ │  │ ████████ │  │ 🎨       │        │
│  │ ████████ │  │ ░░░░░░░░ │  │ ▓▓▓▓▓▓▓▓ │  │          │        │
│  │  Dark    │  │  Light   │  │  Sepia   │  │  Custom  │        │
│  │    ✓     │  │          │  │          │  │          │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  Accent Color:                                                   │
│  [🔵] [🟢] [🟣] [🟡] [🔴] [⬛] [Custom...]                       │
│                                                                  │
│  Editor Background:                                              │
│  [Default ▾]  or  [Custom Color: #___]                          │
│                                                                  │
│  Paper Texture:                                                  │
│  ○ None  ○ Subtle  ○ Parchment  ○ Grid  ○ Lined                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Toolbar Customization

```
┌─────────────────────────────────────────────────────────────────┐
│                    Customize Toolbar                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Current Toolbar:                                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ [B] [I] [U] │ [Font▾] [Size▾] │ [≡] [≡] │ [🎨] │ [💾]    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Drag items to add/remove/reorder                                │
│                                                                  │
│  Available Items:                    Current Items:              │
│  ┌─────────────────────┐            ┌─────────────────────┐     │
│  │ ☐ Strikethrough     │   [→]      │ ☑ Bold              │     │
│  │ ☐ Subscript         │            │ ☑ Italic            │     │
│  │ ☐ Superscript       │   [←]      │ ☑ Underline         │     │
│  │ ☐ Highlight         │            │ ── Separator ──     │     │
│  │ ☐ Text Color        │   [↑]      │ ☑ Font Family       │     │
│  │ ☐ Clear Formatting  │            │ ☑ Font Size         │     │
│  │ ☐ Heading Styles    │   [↓]      │ ── Separator ──     │     │
│  │ ☐ Bullet List       │            │ ☑ Align Left        │     │
│  │ ☐ Number List       │            │ ☑ Align Center      │     │
│  │ ...                 │            │ ...                 │     │
│  └─────────────────────┘            └─────────────────────┘     │
│                                                                  │
│  Toolbar Position:  ○ Top  ○ Bottom  ○ Left  ○ Right            │
│  Toolbar Size:      ○ Compact  ○ Standard  ○ Large              │
│                                                                  │
│              [Reset to Default]    [Save]    [Cancel]            │
└─────────────────────────────────────────────────────────────────┘
```

### Layout Presets

```
┌─────────────────────────────────────────────────────────────────┐
│                      Workspace Layout                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ Writing ────┐  ┌─ Editing ───┐  ┌─ Reviewing ─┐             │
│  │ ┌──────────┐ │  │ ┌───┬────┐  │  │ ┌───┬────┐  │             │
│  │ │          │ │  │ │   │    │  │  │ │   │    │  │             │
│  │ │ Editor   │ │  │ │Nav│Edit│  │  │ │Nav│Edit│  │             │
│  │ │ Only     │ │  │ │   │    │  │  │ │   │----│  │             │
│  │ │          │ │  │ │   │    │  │  │ │   │Cmnt│  │             │
│  │ └──────────┘ │  │ └───┴────┘  │  │ └───┴────┘  │             │
│  └──────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│  ┌─ Publishing ─┐  ┌─ Web Dev ───┐  ┌─ Custom ────┐             │
│  │ ┌───┬────┐   │  │ ┌────┬────┐ │  │ ┌──────────┐│             │
│  │ │   │    │   │  │ │Code│View│ │  │ │ Design   ││             │
│  │ │Nav│Edit│   │  │ │    │    │ │  │ │ Your Own ││             │
│  │ │   │----│   │  │ │    │    │ │  │ │ Layout   ││             │
│  │ │   │Prev│   │  │ └────┴────┘ │  │ └──────────┘│             │
│  │ └───┴────┘   │  └─────────────┘  └─────────────┘             │
│  └──────────────┘                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### Component Structure

```
src/components/desktop/apps/
├── WrytApp.tsx                    # Main application wrapper
├── wryt/
│   ├── WrytEditor.tsx             # Core editor component
│   ├── WrytToolbar.tsx            # Customizable toolbar
│   ├── WrytNavigator.tsx          # Document outline/navigator
│   ├── WrytProjectManager.tsx     # Project list and management
│   ├── WrytTemplateSelector.tsx   # Template selection modal
│   ├── WrytExportDialog.tsx       # Export options dialog
│   ├── WrytSettingsPanel.tsx      # Settings and customization
│   ├── WrytFontPicker.tsx         # Font selection UI
│   ├── WrytPreview.tsx            # Live preview (for web)
│   ├── hooks/
│   │   ├── useWrytDocument.ts     # Document state management
│   │   ├── useWrytFonts.ts        # Font loading and management
│   │   ├── useWrytExport.ts       # Export functionality
│   │   └── useWrytAutoSave.ts     # Auto-save logic
│   ├── utils/
│   │   ├── formatters.ts          # Text formatting utilities
│   │   ├── exporters/
│   │   │   ├── pdfExporter.ts
│   │   │   ├── docxExporter.ts
│   │   │   ├── htmlExporter.ts
│   │   │   ├── markdownExporter.ts
│   │   │   └── epubExporter.ts
│   │   └── templates/
│   │       ├── templateConfigs.ts
│   │       └── templateStyles.ts
│   └── types/
│       └── wryt.types.ts          # TypeScript definitions
```

### State Management

```typescript
interface WrytState {
  // Projects
  projects: WrytProject[];
  activeProjectId: string | null;
  
  // Document
  document: WrytDocument | null;
  selection: Selection | null;
  history: DocumentHistory;
  
  // UI
  theme: 'dark' | 'light' | 'sepia' | 'custom';
  customTheme: CustomTheme | null;
  toolbarConfig: ToolbarConfig;
  layout: LayoutPreset;
  panels: {
    navigator: boolean;
    info: boolean;
    comments: boolean;
    preview: boolean;
  };
  
  // Settings
  fonts: FontConfig;
  autoSave: boolean;
  autoSaveInterval: number;
  spellCheck: boolean;
  grammarCheck: boolean;
}

interface WrytProject {
  id: string;
  name: string;
  template: TemplateType;
  files: WrytFile[];
  settings: ProjectSettings;
  createdAt: number;
  updatedAt: number;
  wordCount: number;
  progress: number; // 0-100%
}

interface WrytDocument {
  id: string;
  projectId: string;
  title: string;
  content: EditorContent; // TipTap/ProseMirror format
  metadata: DocumentMetadata;
  tags: string[];
}
```

### Editor Technology

**Recommended: TipTap (ProseMirror-based)**

```typescript
// TipTap configuration for WRYT
const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    FontFamily,
    FontSize,
    Color,
    Highlight,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Table.configure({ resizable: true }),
    Image,
    Link,
    Placeholder.configure({ placeholder: 'Start writing...' }),
    CharacterCount,
    Typography,
    Dropcursor,
    CodeBlockLowlight.configure({ lowlight }),
  ],
});
```

---

## File Management

### File Tagging System

When documents are saved or exported, they are tagged in the Abyss file system:

```typescript
interface WrytFileTag {
  type: 'textual';           // Primary tag for all WRYT files
  subtype: TemplateType;     // novel, blog, report, etc.
  format: ExportFormat;      // wryt, pdf, docx, etc.
  project: string;           // Project ID
  wordCount: number;
  exported: boolean;
  lastModified: number;
}
```

### File Organization

```
Abyss Files/
├── WRYT/
│   ├── Projects/
│   │   ├── My Novel/
│   │   │   ├── manuscript.wryt
│   │   │   ├── notes.wryt
│   │   │   └── research/
│   │   └── Blog Posts/
│   │       └── ...
│   └── Exports/
│       ├── My_Novel_Final.pdf
│       ├── Blog_Post_January.html
│       └── Resume_2026.docx
```

---

## Implementation Phases

### Phase 1: Foundation (2 weeks)
- [ ] Rename AbyssDocsApp to WrytApp
- [ ] Create project manager component
- [ ] Implement template selector UI
- [ ] Basic TipTap editor integration
- [ ] Simple toolbar with essential formatting
- [ ] Document state management with Zustand
- [ ] Auto-save functionality

### Phase 2: Templates (2 weeks)
- [ ] Create template configuration system
- [ ] Implement 5 core templates (Basic, Novel, Blog, Report, Resume)
- [ ] Template-specific formatting presets
- [ ] Page size and margin configurations
- [ ] Chapter/section navigation

### Phase 3: Rich Editing (2 weeks)
- [ ] Full formatting toolbar
- [ ] Tables support
- [ ] Image insertion and handling
- [ ] Lists (bullet, numbered, checklist)
- [ ] Styles system (headings, quotes, etc.)
- [ ] Find and replace

### Phase 4: Fonts & Themes (1 week)
- [ ] Font loading system
- [ ] Font picker UI
- [ ] Theme system (dark/light/sepia/custom)
- [ ] Toolbar customization
- [ ] Layout presets

### Phase 5: Export (2 weeks)
- [ ] PDF export (using jsPDF or similar)
- [ ] DOCX export (using docx.js)
- [ ] HTML/CSS export
- [ ] Markdown export
- [ ] EPUB export (basic)
- [ ] Export dialog with options

### Phase 6: Advanced Features (2 weeks)
- [ ] Word count goals and tracking
- [ ] Spell check integration
- [ ] Comments system
- [ ] Version history
- [ ] File tagging integration

### Phase 7: Polish & Templates (1 week)
- [ ] Add remaining templates
- [ ] UI polish and animations
- [ ] Performance optimization
- [ ] Documentation
- [ ] Testing

**Total Estimated Time: 12 weeks**

---

## Development Progress

### Current Status: 🔴 Not Started

| Phase | Status | Progress | Notes |
|-------|--------|----------|-------|
| Phase 1: Foundation | 🔴 Not Started | 0% | - |
| Phase 2: Templates | 🔴 Not Started | 0% | - |
| Phase 3: Rich Editing | 🔴 Not Started | 0% | - |
| Phase 4: Fonts & Themes | 🔴 Not Started | 0% | - |
| Phase 5: Export | 🔴 Not Started | 0% | - |
| Phase 6: Advanced Features | 🔴 Not Started | 0% | - |
| Phase 7: Polish & Templates | 🔴 Not Started | 0% | - |

### Legend
- 🔴 Not Started
- 🟡 In Progress
- 🟢 Completed
- 🔵 Testing
- ⚪ On Hold

---

## Related Documentation

- [Abyss Desktop Suite](./ABYSS_DESKTOP_SUITE.md) - Multi-app system overview
- [CRAFT IDE](./CRAFT.md) - Code editor documentation
- [NEON Media Player](./NEON.md) - Media player documentation
- [Abyss Explorer](./ABYSS_EXPLORER.md) - Browser documentation

---

*WRYT - Where words become reality.*
