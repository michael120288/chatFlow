import { useNavigate } from 'react-router-dom';
import '@pages/qa-practice/QAPracticeLanding.scss';

const categories = [
  {
    title: 'Forms & Inputs',
    icon: '📝',
    scenarios: [
      {
        id: 'web-inputs',
        label: 'Web Inputs',
        description: 'Text, email, password, number, date, textarea, checkbox, radio, select, range.'
      },
      {
        id: 'form-validation',
        label: 'Form Validation',
        description: 'Required fields, pattern matching, real-time error messages, submit handling.'
      },
      {
        id: 'date-time-picker',
        label: 'Date / Time Picker',
        description: 'Custom date picker with day/month/year fields and calendar interaction.'
      },
      {
        id: 'autocomplete',
        label: 'Auto-complete',
        description: 'Typeahead dropdown with keyboard navigation and result selection.'
      },
      {
        id: 'multi-select',
        label: 'Multi-select',
        description: 'Select multiple items from a dropdown list with chips/tags.'
      },
      { id: 'rating', label: 'Rating', description: 'Star rating widget with hover and click interactions.' },
      {
        id: 'disabled-readonly',
        label: 'Disabled / Read-only',
        description: 'Inputs in disabled and read-only states — asserting they cannot be edited.'
      },
      {
        id: 'credit-card',
        label: 'Credit Card Payment',
        description: 'Payment form with card number formatting, expiry/CVV validation, and mock payment processing.'
      },
      {
        id: 'rich-text-editor',
        label: 'Rich Text Editor',
        description:
          'contentEditable WYSIWYG editor — type text, apply bold/italic/headings, and assert the HTML output.'
      }
    ]
  },
  {
    title: 'Tables & Lists',
    icon: '📊',
    scenarios: [
      {
        id: 'dynamic-table',
        label: 'Dynamic Table',
        description: 'Sortable, editable table with pagination, add/delete rows, and inline cell editing.'
      },
      {
        id: 'search-filters',
        label: 'Search & Filters',
        description: 'Filter a list by text query and category with real-time results.'
      },
      {
        id: 'virtual-scroll',
        label: 'Virtual Scroll',
        description: 'Large list rendered with windowing — only visible rows are in the DOM.'
      },
      {
        id: 'infinite-scroll',
        label: 'Infinite Scroll',
        description: 'Load more items automatically as you scroll to the bottom.'
      }
    ]
  },
  {
    title: 'UI Components',
    icon: '🧩',
    scenarios: [
      {
        id: 'accordion',
        label: 'Accordion',
        description: 'Single and multi-panel accordions with expand/collapse toggling.'
      },
      { id: 'tabs', label: 'Tabs', description: 'Tabbed navigation — switching panels and asserting active state.' },
      {
        id: 'carousel',
        label: 'Carousel',
        description: 'Image carousel with arrow controls, dot indicators, and auto-play.'
      },
      {
        id: 'tooltips',
        label: 'Tooltips',
        description: 'Hover and focus tooltips positioned in different directions.'
      },
      { id: 'breadcrumbs', label: 'Breadcrumbs', description: 'Multi-level breadcrumb navigation with active state.' },
      { id: 'context-menu', label: 'Context Menu', description: 'Right-click custom context menu with action items.' },
      {
        id: 'nested-dropdowns',
        label: 'Nested Dropdowns',
        description: 'Multi-level dropdown menus with hover and click sub-menus.'
      },
      {
        id: 'wizard',
        label: 'Wizard / Stepper',
        description: 'Multi-step form wizard with validation per step and back/next navigation.'
      },
      {
        id: 'progress',
        label: 'Progress Indicators',
        description: 'Progress bars, step indicators, and loading states.'
      },
      {
        id: 'dark-mode',
        label: 'Dark Mode',
        description: 'Theme toggle between light and dark mode with persisted preference.'
      }
    ]
  },
  {
    title: 'Interactions & Events',
    icon: '🖱️',
    scenarios: [
      {
        id: 'drag-and-drop',
        label: 'Drag and Drop',
        description: 'Drag items between two containers using the HTML5 drag API.'
      },
      {
        id: 'alerts-modals',
        label: 'Alerts & Modals',
        description: 'Browser alerts, confirms, prompts, and custom modal dialogs.'
      },
      {
        id: 'navigation',
        label: 'Navigation',
        description: 'Links, router navigation, new-tab opening, and history traversal.'
      },
      {
        id: 'copy-clipboard',
        label: 'Copy to Clipboard',
        description: 'Copy text to the clipboard and assert the confirmation state.'
      },
      {
        id: 'keyboard-nav',
        label: 'Keyboard Navigation',
        description: 'Tab order, arrow keys, Enter/Space activation, and focus trapping.'
      },
      {
        id: 'sticky-elements',
        label: 'Sticky Elements',
        description: 'Sticky headers and sidebars that remain fixed during scroll.'
      },
      {
        id: 'error-boundary',
        label: 'Error Boundary',
        description: 'Trigger a React error boundary and assert the fallback UI.'
      },
      {
        id: 'multi-tab',
        label: 'Multi-tab & Popup',
        description: 'Handle new tabs and popup windows — practice page.waitForEvent("popup") and switching contexts.'
      },
      {
        id: 'viewport',
        label: 'Viewport & Responsive',
        description: 'Test responsive layouts at different sizes using page.setViewportSize() and device emulation.'
      }
    ]
  },
  {
    title: 'Files & Media',
    icon: '📁',
    scenarios: [
      {
        id: 'file-upload',
        label: 'File Upload',
        description: 'Single and multiple file upload via button click and drag-and-drop.'
      },
      {
        id: 'download-files',
        label: 'Download Files',
        description: 'Trigger file downloads and verify the download prompt or response.'
      }
    ]
  },
  {
    title: 'Browser APIs & Network',
    icon: '🌐',
    scenarios: [
      {
        id: 'local-storage',
        label: 'LocalStorage / SessionStorage',
        description: 'Read, write, and clear browser storage and assert persisted values.'
      },
      { id: 'cookies', label: 'Cookies', description: 'Set, read, and delete cookies via document.cookie and the UI.' },
      {
        id: 'notifications',
        label: 'Notifications',
        description:
          'Request browser Notification API permission, trigger desktop notifications, and assert their behaviour.'
      },
      {
        id: 'websocket',
        label: 'WebSocket',
        description: 'Connect to a WebSocket server, send messages, and assert responses.'
      },
      {
        id: 'api-testing',
        label: 'API Testing',
        description: 'Intercept and mock API requests — test loading, success, and error states.'
      },
      {
        id: 'authentication',
        label: 'Authentication',
        description: 'Login/logout flow, session persistence, and protected route redirects.'
      },
      {
        id: 'iframe',
        label: 'IFrame',
        description: 'Switch into an iframe context and interact with elements inside it.'
      },
      {
        id: 'loaders',
        label: 'Loaders & Spinners',
        description: 'Wait for loading indicators to appear and disappear before asserting.'
      },
      {
        id: 'shadow-dom',
        label: 'Shadow DOM',
        description:
          'Interact with elements inside a Shadow DOM — use Playwright pierce selectors to reach encapsulated content.'
      }
    ]
  }
];

const QAPracticeLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="qal-container">
      <header className="qal-header">
        <button className="qal-home-btn" onClick={() => navigate('/')} aria-label="Go to home page">
          ← Home
        </button>
        <h1>QA Practice</h1>
      </header>
      <div className="qal-main">
        <div className="qal-content">
          <div className="qa-landing">
            <div className="qa-landing-hero">
              <h2>43 Interactive Scenarios</h2>
              <p>
                A hands-on playground for practising Playwright end-to-end testing. Each scenario gives you a real,
                interactive UI element to automate — from basic form inputs to WebSockets and virtual scroll. Pick a
                category below to get started.
              </p>
              <div className="qa-landing-stats">
                <div className="stat">
                  <span className="stat-number">43</span>
                  <span className="stat-label">Scenarios</span>
                </div>
                <div className="stat">
                  <span className="stat-number">6</span>
                  <span className="stat-label">Categories</span>
                </div>
                <div className="stat">
                  <span className="stat-number">∞</span>
                  <span className="stat-label">Practice runs</span>
                </div>
              </div>
            </div>

            <div className="qa-landing-categories">
              {categories.map((cat) => (
                <section key={cat.title} className="qa-category">
                  <h3 className="qa-category-title">
                    <span className="qa-category-icon">{cat.icon}</span>
                    {cat.title}
                  </h3>
                  <div className="qa-scenario-grid">
                    {cat.scenarios.map((s) => (
                      <button key={s.id} className="qa-scenario-card" onClick={() => navigate(`/qa-practice/${s.id}`)}>
                        <span className="qa-scenario-label">{s.label}</span>
                        <span className="qa-scenario-desc">{s.description}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAPracticeLanding;
