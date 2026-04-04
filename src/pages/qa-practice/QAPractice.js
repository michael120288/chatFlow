import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorBoundary from '@components/error-boundary/ErrorBoundary';
import '@pages/qa-practice/QAPractice.scss';

// Helper: mounts a real Shadow DOM inside a host div
const ShadowDOMWidget = ({ onInput }) => {
  const hostRef = useRef(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.shadowRoot) return;
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        :host { color: rgba(255,255,255,0.88); }
        .sw-wrap { padding: 16px; border: 2px dashed #667eea; border-radius: 8px; background: rgba(102,126,234,0.12); }
        button { padding: 8px 16px; background: #667eea; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px; }
        input { padding: 8px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; width: 220px; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.88); }
        input::placeholder { color: rgba(255,255,255,0.35); }
        .result { margin-top: 10px; color: #6ee7b7; font-weight: 600; min-height: 20px; }
      </style>
      <div class="sw-wrap">
        <p>👋 This content lives inside a Shadow DOM.</p>
        <button data-testid="shadow-btn">Click me</button>
        <input type="text" data-testid="shadow-input" placeholder="Type here (shadow DOM)…" />
        <div class="result" data-testid="shadow-result"></div>
      </div>
    `;
    shadow.querySelector('button').addEventListener('click', () => {
      shadow.querySelector('[data-testid="shadow-result"]').textContent = 'Shadow button clicked ✓';
    });
    shadow.querySelector('input').addEventListener('input', (e) => {
      shadow.querySelector('[data-testid="shadow-result"]').textContent = `Typed: ${e.target.value}`;
      onInput(e.target.value);
    });
  }, [onInput]);
  return <div ref={hostRef} data-testid="shadow-host" id="shadow-host" />;
};

ShadowDOMWidget.propTypes = {
  onInput: PropTypes.func.isRequired
};

const QAPractice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState('web-inputs');
  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateComponents, setDateComponents] = useState({
    day: '',
    month: '',
    year: ''
  });
  const [formData, setFormData] = useState({
    textInput: '',
    email: '',
    password: '',
    number: '',
    date: '',
    textarea: '',
    checkbox: false,
    radio: '',
    select: '',
    range: 50
  });
  const [tableData, setTableData] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Developer' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Manager' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Designer' },
    { id: 7, name: 'Eve Davis', email: 'eve@example.com', role: 'Developer' },
    { id: 8, name: 'Frank Miller', email: 'frank@example.com', role: 'Manager' },
    { id: 9, name: 'Grace Lee', email: 'grace@example.com', role: 'Designer' },
    { id: 10, name: 'Henry Clark', email: 'henry@example.com', role: 'Developer' }
  ]);
  const [editingCell, setEditingCell] = useState(null);
  const [newRow, setNewRow] = useState({ name: '', email: '', role: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Drag and drop state
  const [dragItems, setDragItems] = useState([
    { id: 1, content: 'Item 1', category: 'available' },
    { id: 2, content: 'Item 2', category: 'available' },
    { id: 3, content: 'Item 3', category: 'available' },
    { id: 4, content: 'Item 4', category: 'available' },
    { id: 5, content: 'Item 5', category: 'available' }
  ]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverCategory, setDragOverCategory] = useState(null);

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Alerts and modals state
  const [alerts, setAlerts] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Tooltips state
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Accordion state
  const [singleAccordion, setSingleAccordion] = useState(null);
  const [multipleAccordion, setMultipleAccordion] = useState([]);

  // Tabs state
  const [activeTab, setActiveTab] = useState('tab1');

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Context Menu state
  const [contextMenu, setContextMenu] = useState(null);

  // Copy to Clipboard state
  const [copiedText, setCopiedText] = useState(null);

  // Rating state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);

  // Infinite Scroll state
  const [scrollItems, setScrollItems] = useState(Array.from({ length: 20 }, (_, i) => i + 1));
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // LocalStorage/SessionStorage state
  const [localStorageKey, setLocalStorageKey] = useState('');
  const [localStorageValue, setLocalStorageValue] = useState('');
  const [sessionStorageKey, setSessionStorageKey] = useState('');
  const [sessionStorageValue, setSessionStorageValue] = useState('');
  const [storageData, setStorageData] = useState({ local: {}, session: {} });

  // Cookie Management state
  const [cookieName, setCookieName] = useState('');
  const [cookieValue, setCookieValue] = useState('');
  const [cookies, setCookies] = useState([]);

  // API Testing state
  const [apiUrl, setApiUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Form Validation state
  const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [validationForm, setValidationForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '',
    website: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Authentication state
  const [authUser, setAuthUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Download Files state
  const [downloadType, setDownloadType] = useState('text');

  // Browser Notifications state
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  const [notificationLog, setNotificationLog] = useState([]);
  const [notifTipsOpen, setNotifTipsOpen] = useState(false);

  // Loaders state
  const [loaderSpinner, setLoaderSpinner] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(false);
  const [loaderProgressVal, setLoaderProgressVal] = useState(0);
  const [loaderSkeleton, setLoaderSkeleton] = useState(false);
  const [loaderOverlay, setLoaderOverlay] = useState(false);

  // Keyboard Navigation state
  const [keyboardLog, setKeyboardLog] = useState([]);
  const [shortcutPressed, setShortcutPressed] = useState('');

  // Auto-complete state
  const [autocompleteQuery, setAutocompleteQuery] = useState('');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Multi-select state
  const [multiSelectOptions] = useState(['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']);
  const [selectedMultiOptions, setSelectedMultiOptions] = useState([]);

  // Date/Time Picker state
  const [selectedDate, setSelectedDate] = useState({ month: '', day: '', year: '' });
  const [dateCalendarOpen, setDateCalendarOpen] = useState(false);
  const [dateViewMonth, setDateViewMonth] = useState(new Date().getMonth() + 1);
  const [dateViewYear, setDateViewYear] = useState(new Date().getFullYear());
  const [selectedTime, setSelectedTime] = useState({ hour: '', minute: '' });
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState({ month: '', day: '', year: '', hour: '', minute: '' });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarViewMonth, setCalendarViewMonth] = useState(new Date().getMonth() + 1);
  const [calendarViewYear, setCalendarViewYear] = useState(new Date().getFullYear());

  // Dark Mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Nested Dropdowns state
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Error Boundary state
  const [shouldThrowError, setShouldThrowError] = useState(false);

  // Disabled/Readonly state
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [isInputReadonly, setIsInputReadonly] = useState(false);

  // Progress Indicators state
  const [progressValue, setProgressValue] = useState(0);
  const [stepProgress, setStepProgress] = useState(1);

  // Virtual Scroll state
  const [virtualItems] = useState(Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`));
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });

  // WebSocket state
  const [wsMessages, setWsMessages] = useState([]);
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [wsMessage, setWsMessage] = useState('');

  // Credit Card state
  const [cardForm, setCardForm] = useState({ cardNumber: '', expiry: '', cvv: '', cardholderName: '', zip: '' });
  const [cardErrors, setCardErrors] = useState({});
  const [paymentStep, setPaymentStep] = useState('form');
  const [cvvVisible, setCvvVisible] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  // Shadow DOM state
  const [shadowClicked, setShadowClicked] = useState(false);
  const [shadowInputVal, setShadowInputVal] = useState('');

  // Multi-tab state
  const [popupLog, setPopupLog] = useState([]);

  // Viewport state
  const [viewportSize, setViewportSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const onResize = () => setViewportSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Rich Text Editor state
  const [rteHtml, setRteHtml] = useState('');
  const rteRef = useRef(null);

  // IFrame state
  const [selectedIframe, setSelectedIframe] = useState('custom1');
  const iframeOptions = [
    {
      id: 'custom1',
      label: 'Custom Page 1 - Welcome',
      content: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                text-align: center;
                padding: 20px;
              }
              .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
              }
              h1 { font-size: 3rem; margin: 0 0 20px 0; }
              p { font-size: 1.2rem; line-height: 1.6; }
              button {
                margin-top: 20px;
                padding: 15px 30px;
                font-size: 1rem;
                background: white;
                color: #667eea;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                transition: transform 0.2s;
              }
              button:hover { transform: scale(1.05); }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome to IFrame Testing!</h1>
              <p>This is a custom embedded page for QA practice.</p>
              <p>You can interact with elements inside this iframe.</p>
              <button onclick="alert('Button clicked inside iframe!')">Click Me</button>
            </div>
          </body>
        </html>
      `
    },
    {
      id: 'custom2',
      label: 'Custom Page 2 - Form',
      content: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background: #f5f5f5;
                padding: 40px;
                margin: 0;
              }
              .form-container {
                max-width: 500px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              }
              h2 { color: #667eea; margin-top: 0; }
              .form-group {
                margin-bottom: 20px;
              }
              label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #333;
              }
              input, textarea {
                width: 100%;
                padding: 10px;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 1rem;
                box-sizing: border-box;
              }
              input:focus, textarea:focus {
                outline: none;
                border-color: #667eea;
              }
              button {
                width: 100%;
                padding: 12px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
              }
              button:hover {
                background: #5568d3;
              }
              .result {
                margin-top: 20px;
                padding: 15px;
                background: #f0f0f0;
                border-radius: 6px;
                display: none;
              }
            </style>
          </head>
          <body>
            <div class="form-container">
              <h2>Contact Form (IFrame)</h2>
              <form onsubmit="event.preventDefault(); document.getElementById('result').style.display='block'; document.getElementById('resultText').textContent='Form submitted: ' + document.getElementById('nameInput').value;">
                <div class="form-group">
                  <label for="nameInput">Name:</label>
                  <input type="text" id="nameInput" placeholder="Enter your name" required>
                </div>
                <div class="form-group">
                  <label for="emailInput">Email:</label>
                  <input type="email" id="emailInput" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                  <label for="messageInput">Message:</label>
                  <textarea id="messageInput" rows="4" placeholder="Enter your message" required></textarea>
                </div>
                <button type="submit">Submit Form</button>
              </form>
              <div id="result" class="result">
                <strong id="resultText"></strong>
              </div>
            </div>
          </body>
        </html>
      `
    },
    {
      id: 'custom3',
      label: 'Custom Page 3 - Interactive',
      content: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background: #1a1a2e;
                color: white;
                padding: 40px;
                margin: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
              }
              h2 { color: #00d4ff; }
              .counter {
                text-align: center;
                padding: 40px;
                background: rgba(0, 212, 255, 0.1);
                border-radius: 12px;
                margin: 20px 0;
              }
              .count {
                font-size: 4rem;
                font-weight: bold;
                color: #00d4ff;
                margin: 20px 0;
              }
              .buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin-top: 20px;
              }
              button {
                padding: 12px 24px;
                font-size: 1rem;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                transition: transform 0.2s;
              }
              .btn-inc {
                background: #00d4ff;
                color: #1a1a2e;
              }
              .btn-dec {
                background: #ff006e;
                color: white;
              }
              .btn-reset {
                background: #8338ec;
                color: white;
              }
              button:hover {
                transform: scale(1.05);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Interactive Counter (IFrame)</h2>
              <div class="counter">
                <div>Current Count:</div>
                <div class="count" id="count">0</div>
                <div class="buttons">
                  <button class="btn-dec" onclick="decrement()">- Decrease</button>
                  <button class="btn-reset" onclick="reset()">Reset</button>
                  <button class="btn-inc" onclick="increment()">+ Increase</button>
                </div>
              </div>
            </div>
            <script>
              let count = 0;
              function increment() {
                count++;
                document.getElementById('count').textContent = count;
              }
              function decrement() {
                count--;
                document.getElementById('count').textContent = count;
              }
              function reset() {
                count = 0;
                document.getElementById('count').textContent = count;
              }
            </script>
          </body>
        </html>
      `
    }
  ];

  // Close context menu on click
  useEffect(() => {
    if (contextMenu) {
      document.addEventListener('click', handleCloseContextMenu);
      return () => document.removeEventListener('click', handleCloseContextMenu);
    }
  }, [contextMenu]);

  // Sync selectedOption with URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('web-inputs')) {
      setSelectedOption('web-inputs');
    } else if (path.includes('dynamic-table')) {
      setSelectedOption('dynamic-table');
    } else if (path.includes('drag-and-drop')) {
      setSelectedOption('drag-and-drop');
    } else if (path.includes('iframe')) {
      setSelectedOption('iframe');
    } else if (path.includes('file-upload')) {
      setSelectedOption('file-upload');
    } else if (path.includes('alerts-modals')) {
      setSelectedOption('alerts-modals');
    } else if (path.includes('navigation')) {
      setSelectedOption('navigation');
    } else if (path.includes('tooltips')) {
      setSelectedOption('tooltips');
    } else if (path.includes('loaders')) {
      setSelectedOption('loaders');
    } else if (path.includes('accordion')) {
      setSelectedOption('accordion');
    } else if (path.includes('tabs')) {
      setSelectedOption('tabs');
    } else if (path.includes('carousel')) {
      setSelectedOption('carousel');
    } else if (path.includes('search-filters')) {
      setSelectedOption('search-filters');
    } else if (path.includes('breadcrumbs')) {
      setSelectedOption('breadcrumbs');
    } else if (path.includes('context-menu')) {
      setSelectedOption('context-menu');
    } else if (path.includes('copy-clipboard')) {
      setSelectedOption('copy-clipboard');
    } else if (path.includes('rating')) {
      setSelectedOption('rating');
    } else if (path.includes('wizard')) {
      setSelectedOption('wizard');
    } else if (path.includes('infinite-scroll')) {
      setSelectedOption('infinite-scroll');
    } else if (path.includes('sticky-elements')) {
      setSelectedOption('sticky-elements');
    } else if (path.includes('local-storage')) {
      setSelectedOption('local-storage');
    } else if (path.includes('cookies')) {
      setSelectedOption('cookies');
    } else if (path.includes('api-testing')) {
      setSelectedOption('api-testing');
    } else if (path.includes('form-validation')) {
      setSelectedOption('form-validation');
    } else if (path.includes('authentication')) {
      setSelectedOption('authentication');
    } else if (path.includes('download-files')) {
      setSelectedOption('download-files');
    } else if (path.includes('notifications')) {
      setSelectedOption('notifications');
    } else if (path.includes('keyboard-nav')) {
      setSelectedOption('keyboard-nav');
    } else if (path.includes('autocomplete')) {
      setSelectedOption('autocomplete');
    } else if (path.includes('multi-select')) {
      setSelectedOption('multi-select');
    } else if (path.includes('date-time-picker')) {
      setSelectedOption('date-time-picker');
    } else if (path.includes('dark-mode')) {
      setSelectedOption('dark-mode');
    } else if (path.includes('nested-dropdowns')) {
      setSelectedOption('nested-dropdowns');
    } else if (path.includes('error-boundary')) {
      setSelectedOption('error-boundary');
    } else if (path.includes('disabled-readonly')) {
      setSelectedOption('disabled-readonly');
    } else if (path.includes('progress')) {
      setSelectedOption('progress');
    } else if (path.includes('virtual-scroll')) {
      setSelectedOption('virtual-scroll');
    } else if (path.includes('websocket')) {
      setSelectedOption('websocket');
    } else if (path.includes('credit-card')) {
      setSelectedOption('credit-card');
    } else if (path.includes('shadow-dom')) {
      setSelectedOption('shadow-dom');
    } else if (path.includes('multi-tab')) {
      setSelectedOption('multi-tab');
    } else if (path.includes('viewport')) {
      setSelectedOption('viewport');
    } else if (path.includes('rich-text-editor')) {
      setSelectedOption('rich-text-editor');
    }
  }, [location.pathname, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmittedData(formData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  const handleDateComponentChange = (field, value) => {
    const newDateComponents = { ...dateComponents, [field]: value };
    setDateComponents(newDateComponents);

    // Update the date field in formData if all components are filled
    if (newDateComponents.day && newDateComponents.month && newDateComponents.year) {
      const formattedDate = `${String(newDateComponents.month).padStart(2, '0')}-${String(
        newDateComponents.day
      ).padStart(2, '0')}-${newDateComponents.year}`;
      setFormData((prev) => ({ ...prev, date: formattedDate }));
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  // Generate arrays for selectors
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleReset = () => {
    setFormData({
      textInput: '',
      email: '',
      password: '',
      number: '',
      date: '',
      textarea: '',
      checkbox: false,
      radio: '',
      select: '',
      range: 50
    });
  };

  // Table handlers
  const handleAddRow = () => {
    if (newRow.name && newRow.email && newRow.role) {
      const newId = Math.max(...tableData.map((row) => row.id), 0) + 1;
      const updatedTableData = [...tableData, { id: newId, ...newRow }];
      setTableData(updatedTableData);
      setNewRow({ name: '', email: '', role: '' });
      // Navigate to the last page to show the newly added row
      const newTotalPages = Math.ceil(updatedTableData.length / itemsPerPage);
      setCurrentPage(newTotalPages);
    }
  };

  const handleDeleteRow = (id) => {
    const updatedTableData = tableData.filter((row) => row.id !== id);
    setTableData(updatedTableData);

    // If current page is now empty, go to previous page
    const newTotalPages = Math.ceil(updatedTableData.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleCellEdit = (id, field, value) => {
    setTableData(tableData.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
    setEditingCell(null);
  };

  const handleNewRowChange = (field, value) => {
    setNewRow({ ...newRow, [field]: value });
  };

  // Pagination calculations
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };

  const handleDragOver = (e, category) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCategory(category);
  };

  const handleDragLeave = () => {
    setDragOverCategory(null);
  };

  const handleDrop = (e, targetCategory) => {
    e.preventDefault();
    if (draggedItem && draggedItem.category !== targetCategory) {
      setDragItems(
        dragItems.map((item) => (item.id === draggedItem.id ? { ...item, category: targetCategory } : item))
      );
    }
    setDraggedItem(null);
    setDragOverCategory(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverCategory(null);
  };

  const resetDragItems = () => {
    setDragItems(dragItems.map((item) => ({ ...item, category: 'available' })));
  };

  // File upload handlers
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const newFiles = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleFileDragOver = (e) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleFileDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const removeFile = (id) => {
    const fileToRemove = uploadedFiles.find((f) => f.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
  };

  const clearAllFiles = () => {
    uploadedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setUploadedFiles([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Alerts and modals handlers
  const showAlert = (type, message) => {
    const newAlert = {
      id: Date.now(),
      type,
      message
    };
    setAlerts([...alerts, newAlert]);
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
      removeAlert(newAlert.id);
    }, 5000);
  };

  const removeAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const openAlertModal = (modalType) => {
    setActiveModal(modalType);
    setConfirmationResult(null);
  };

  const closeAlertModal = () => {
    setActiveModal(null);
    setConfirmationResult(null);
  };

  const handleConfirmation = (confirmed) => {
    setConfirmationResult(confirmed ? 'Confirmed' : 'Cancelled');
    setTimeout(() => {
      closeAlertModal();
    }, 1500);
  };

  // Navigation handlers
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openInNewWindow = (url) => {
    window.open(url, '_blank', 'width=800,height=600,left=100,top=100');
  };

  const openInSameWindow = (url) => {
    window.location.href = url;
  };

  // Accordion handlers
  const toggleSingleAccordion = (id) => {
    setSingleAccordion(singleAccordion === id ? null : id);
  };

  const toggleMultipleAccordion = (id) => {
    setMultipleAccordion(
      multipleAccordion.includes(id) ? multipleAccordion.filter((item) => item !== id) : [...multipleAccordion, id]
    );
  };

  // Carousel handlers
  const carouselSlides = [
    {
      title: 'Welcome to QA Testing',
      description: 'This is the first slide of the carousel. Test navigation using arrows or dots below.'
    },
    {
      title: 'Interactive Carousel',
      description: 'Click the arrow buttons to navigate between slides or use the dot indicators.'
    },
    {
      title: 'Responsive Design',
      description: 'This carousel is fully responsive and works on all screen sizes and devices.'
    },
    {
      title: 'Auto-play Ready',
      description: 'The carousel can be extended with auto-play functionality for automated testing.'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  // Search & Filters handlers
  const sampleData = [
    { id: 1, name: 'Apple', category: 'fruit', price: 2.5 },
    { id: 2, name: 'Banana', category: 'fruit', price: 1.5 },
    { id: 3, name: 'Mango', category: 'fruit', price: 3.0 },
    { id: 4, name: 'Strawberry', category: 'fruit', price: 4.5 },
    { id: 5, name: 'Blueberry', category: 'fruit', price: 5.0 },
    { id: 6, name: 'Grape', category: 'fruit', price: 3.5 },
    { id: 7, name: 'Watermelon', category: 'fruit', price: 6.0 },
    { id: 8, name: 'Pineapple', category: 'fruit', price: 4.0 },
    { id: 9, name: 'Peach', category: 'fruit', price: 2.8 },
    { id: 10, name: 'Pear', category: 'fruit', price: 2.2 },
    { id: 11, name: 'Cherry', category: 'fruit', price: 6.5 },
    { id: 12, name: 'Kiwi', category: 'fruit', price: 3.2 },
    { id: 13, name: 'Lemon', category: 'fruit', price: 1.8 },
    { id: 14, name: 'Orange', category: 'fruit', price: 2.0 },
    { id: 15, name: 'Raspberry', category: 'fruit', price: 5.5 },
    { id: 16, name: 'Carrot', category: 'vegetable', price: 1.0 },
    { id: 17, name: 'Broccoli', category: 'vegetable', price: 2.0 },
    { id: 18, name: 'Spinach', category: 'vegetable', price: 2.5 },
    { id: 19, name: 'Tomato', category: 'vegetable', price: 1.8 },
    { id: 20, name: 'Cucumber', category: 'vegetable', price: 1.2 },
    { id: 21, name: 'Bell Pepper', category: 'vegetable', price: 2.3 },
    { id: 22, name: 'Zucchini', category: 'vegetable', price: 1.5 },
    { id: 23, name: 'Eggplant', category: 'vegetable', price: 2.0 },
    { id: 24, name: 'Celery', category: 'vegetable', price: 1.3 },
    { id: 25, name: 'Onion', category: 'vegetable', price: 0.9 },
    { id: 26, name: 'Garlic', category: 'vegetable', price: 1.1 },
    { id: 27, name: 'Potato', category: 'vegetable', price: 1.0 },
    { id: 28, name: 'Sweet Potato', category: 'vegetable', price: 1.6 },
    { id: 29, name: 'Lettuce', category: 'vegetable', price: 1.4 },
    { id: 30, name: 'Kale', category: 'vegetable', price: 2.2 },
    { id: 31, name: 'Chicken', category: 'meat', price: 8.0 },
    { id: 32, name: 'Beef', category: 'meat', price: 12.0 },
    { id: 33, name: 'Pork', category: 'meat', price: 9.5 },
    { id: 34, name: 'Lamb', category: 'meat', price: 14.0 },
    { id: 35, name: 'Turkey', category: 'meat', price: 10.0 },
    { id: 36, name: 'Salmon', category: 'meat', price: 15.0 },
    { id: 37, name: 'Tuna', category: 'meat', price: 11.0 },
    { id: 38, name: 'Shrimp', category: 'meat', price: 13.5 },
    { id: 39, name: 'Duck', category: 'meat', price: 16.0 },
    { id: 40, name: 'Bacon', category: 'meat', price: 7.5 },
    { id: 41, name: 'Milk', category: 'dairy', price: 2.5 },
    { id: 42, name: 'Cheese', category: 'dairy', price: 5.0 },
    { id: 43, name: 'Butter', category: 'dairy', price: 4.0 },
    { id: 44, name: 'Yogurt', category: 'dairy', price: 3.5 },
    { id: 45, name: 'Cream', category: 'dairy', price: 3.0 },
    { id: 46, name: 'Ice Cream', category: 'dairy', price: 6.0 },
    { id: 47, name: 'Sour Cream', category: 'dairy', price: 2.8 },
    { id: 48, name: 'Cottage Cheese', category: 'dairy', price: 4.5 },
    { id: 49, name: 'Mozzarella', category: 'dairy', price: 5.5 },
    { id: 50, name: 'Cheddar', category: 'dairy', price: 6.0 }
  ];

  const filteredData = sampleData
    .filter((item) => filterCategory === 'all' || item.category === filterCategory)
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  // Context Menu handlers
  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Copy to Clipboard handler
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Infinite Scroll handler
  const loadMoreItems = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      const newItems = Array.from({ length: 10 }, (_, i) => scrollItems.length + i + 1);
      setScrollItems([...scrollItems, ...newItems]);
      setIsLoadingMore(false);
    }, 1000);
  };

  const renderContent = () => {
    if (selectedOption === 'web-inputs') {
      return (
        <div className="content-section">
          <h2>Web Inputs</h2>
          <p>Practice testing various web input fields</p>

          <form onSubmit={handleSubmit} className="qa-form">
            <div className="form-group">
              <label htmlFor="textInput">Text Input:</label>
              <input
                type="text"
                id="textInput"
                name="textInput"
                value={formData.textInput}
                onChange={handleInputChange}
                placeholder="Enter text here"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="number">Number:</label>
              <input
                type="number"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="Enter a number"
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <div
                className={`custom-date-picker${showDatePicker ? ' custom-date-picker--open' : ''}`}
                data-testid="web-date-picker"
              >
                <input
                  type="text"
                  id="date"
                  name="date"
                  data-testid="web-date-input"
                  value={formData.date}
                  placeholder="MM-DD-YYYY"
                  readOnly
                  onClick={toggleDatePicker}
                  className="date-input-field"
                />
                {showDatePicker && (
                  <div className="date-picker-dropdown" data-testid="web-date-picker-dropdown">
                    <div className="date-picker-header">
                      <h4>Select Date</h4>
                      <button
                        type="button"
                        className="date-picker-close"
                        data-testid="web-date-picker-close"
                        onClick={closeDatePicker}
                      >
                        ×
                      </button>
                    </div>
                    <div className="date-selectors">
                      <div className="date-selector-group">
                        <label htmlFor="month-select">Month:</label>
                        <select
                          id="month-select"
                          name="month-select"
                          data-testid="web-month-select"
                          value={dateComponents.month}
                          onChange={(e) => handleDateComponentChange('month', e.target.value)}
                        >
                          <option value="">Month</option>
                          {months.map((month) => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="date-selector-group">
                        <label htmlFor="day-select">Day:</label>
                        <select
                          id="day-select"
                          name="day-select"
                          data-testid="web-day-select"
                          value={dateComponents.day}
                          onChange={(e) => handleDateComponentChange('day', e.target.value)}
                        >
                          <option value="">Day</option>
                          {days.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="date-selector-group">
                        <label htmlFor="year-select">Year:</label>
                        <select
                          id="year-select"
                          name="year-select"
                          data-testid="web-year-select"
                          value={dateComponents.year}
                          onChange={(e) => handleDateComponentChange('year', e.target.value)}
                        >
                          <option value="">Year</option>
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="date-picker-done"
                      data-testid="web-date-picker-done"
                      onClick={closeDatePicker}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="textarea">Textarea:</label>
              <textarea
                id="textarea"
                name="textarea"
                value={formData.textarea}
                onChange={handleInputChange}
                placeholder="Enter multiple lines of text"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="select">Select Dropdown:</label>
              <select id="select" name="select" value={formData.select} onChange={handleInputChange}>
                <option value="">Choose an option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>

            <div className="form-group">
              <label>Radio Buttons:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="radio"
                    value="radio1"
                    checked={formData.radio === 'radio1'}
                    onChange={handleInputChange}
                  />
                  Radio 1
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="radio"
                    value="radio2"
                    checked={formData.radio === 'radio2'}
                    onChange={handleInputChange}
                  />
                  Radio 2
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="radio"
                    value="radio3"
                    checked={formData.radio === 'radio3'}
                    onChange={handleInputChange}
                  />
                  Radio 3
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" name="checkbox" checked={formData.checkbox} onChange={handleInputChange} /> I
                agree to the terms and conditions
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="range">Range: {formData.range}</label>
              <input
                type="range"
                id="range"
                name="range"
                value={formData.range}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                Submit
              </button>
              <button type="button" className="reset-button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (selectedOption === 'dynamic-table') {
      return (
        <div className="content-section">
          <h2>Dynamic Table</h2>
          <p>Practice testing dynamic table operations</p>

          <div className="table-container">
            <table className="dynamic-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>
                      {editingCell?.id === row.id && editingCell?.field === 'name' ? (
                        <input
                          type="text"
                          defaultValue={row.name}
                          onBlur={(e) => handleCellEdit(row.id, 'name', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCellEdit(row.id, 'name', e.target.value);
                          }}
                          autoFocus
                        />
                      ) : (
                        <span onClick={() => setEditingCell({ id: row.id, field: 'name' })}>{row.name}</span>
                      )}
                    </td>
                    <td>
                      {editingCell?.id === row.id && editingCell?.field === 'email' ? (
                        <input
                          type="email"
                          defaultValue={row.email}
                          onBlur={(e) => handleCellEdit(row.id, 'email', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCellEdit(row.id, 'email', e.target.value);
                          }}
                          autoFocus
                        />
                      ) : (
                        <span onClick={() => setEditingCell({ id: row.id, field: 'email' })}>{row.email}</span>
                      )}
                    </td>
                    <td>
                      {editingCell?.id === row.id && editingCell?.field === 'role' ? (
                        <input
                          type="text"
                          defaultValue={row.role}
                          onBlur={(e) => handleCellEdit(row.id, 'role', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCellEdit(row.id, 'role', e.target.value);
                          }}
                          autoFocus
                        />
                      ) : (
                        <span onClick={() => setEditingCell({ id: row.id, field: 'role' })}>{row.role}</span>
                      )}
                    </td>
                    <td>
                      <button type="button" className="delete-row-button" onClick={() => handleDeleteRow(row.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination-controls">
              <button
                type="button"
                className="pagination-button"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`pagination-page ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="pagination-button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

            <div className="table-info">
              <p>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, tableData.length)} of {tableData.length}{' '}
                entries
              </p>
            </div>

            <div className="add-row-section">
              <h3>Add New Row</h3>
              <div className="add-row-form">
                <input
                  type="text"
                  placeholder="Name"
                  value={newRow.name}
                  onChange={(e) => handleNewRowChange('name', e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newRow.email}
                  onChange={(e) => handleNewRowChange('email', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={newRow.role}
                  onChange={(e) => handleNewRowChange('role', e.target.value)}
                />
                <button type="button" className="add-row-button" onClick={handleAddRow}>
                  Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedOption === 'drag-and-drop') {
      const availableItems = dragItems.filter((item) => item.category === 'available');
      const selectedItems = dragItems.filter((item) => item.category === 'selected');
      const completedItems = dragItems.filter((item) => item.category === 'completed');

      return (
        <div className="content-section">
          <h2>Drag and Drop</h2>
          <p>Practice testing drag and drop interactions</p>

          <div className="drag-drop-container">
            <div className="drag-drop-section">
              <h3>Available Items</h3>
              <div
                className={`drop-zone ${dragOverCategory === 'available' ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, 'available')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'available')}
              >
                {availableItems.length === 0 ? (
                  <div className="empty-zone">Drop items here</div>
                ) : (
                  availableItems.map((item) => (
                    <div
                      key={item.id}
                      className={`drag-item ${draggedItem?.id === item.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                    >
                      {item.content}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="drag-drop-section">
              <h3>Selected Items</h3>
              <div
                className={`drop-zone ${dragOverCategory === 'selected' ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, 'selected')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'selected')}
              >
                {selectedItems.length === 0 ? (
                  <div className="empty-zone">Drop items here</div>
                ) : (
                  selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className={`drag-item ${draggedItem?.id === item.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                    >
                      {item.content}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="drag-drop-section">
              <h3>Completed Items</h3>
              <div
                className={`drop-zone ${dragOverCategory === 'completed' ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, 'completed')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'completed')}
              >
                {completedItems.length === 0 ? (
                  <div className="empty-zone">Drop items here</div>
                ) : (
                  completedItems.map((item) => (
                    <div
                      key={item.id}
                      className={`drag-item ${draggedItem?.id === item.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                    >
                      {item.content}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="drag-drop-actions">
            <button type="button" className="reset-button" onClick={resetDragItems}>
              Reset All Items
            </button>
          </div>
        </div>
      );
    }

    if (selectedOption === 'iframe') {
      const currentIframe = iframeOptions.find((option) => option.id === selectedIframe);

      return (
        <div className="content-section">
          <div className="content-section-nav">
            <button
              type="button"
              className="back-to-practice-btn"
              data-testid="iframe-back-btn"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          </div>
          <h2>IFrame</h2>
          <p>Practice testing iframe interactions and switching between different iframe sources</p>

          <div className="iframe-controls">
            <label htmlFor="iframe-select">Select IFrame Content:</label>
            <select
              id="iframe-select"
              value={selectedIframe}
              onChange={(e) => setSelectedIframe(e.target.value)}
              className="iframe-selector"
            >
              {iframeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="iframe-container">
            <div className="iframe-info">
              <p>
                <strong>Current Content:</strong> {currentIframe?.label}
              </p>
              <p>
                <strong>Type:</strong> <span className="iframe-url">Custom HTML Content</span>
              </p>
            </div>
            <div className="iframe-wrapper">
              <iframe
                srcDoc={currentIframe?.content}
                title={currentIframe?.label}
                className="qa-iframe"
                sandbox="allow-scripts allow-forms allow-modals"
              />
            </div>
          </div>
        </div>
      );
    }

    if (selectedOption === 'file-upload') {
      return (
        <div className="content-section">
          <h2>File Upload</h2>
          <p>Practice testing file upload functionality with drag and drop support</p>

          <div className="file-upload-container">
            <div className="upload-methods">
              <div className="upload-method">
                <h3>Single File Upload</h3>
                <input type="file" id="single-file-input" onChange={handleFileSelect} style={{ display: 'none' }} />
                <label htmlFor="single-file-input" className="file-upload-button">
                  Choose File
                </label>
              </div>

              <div className="upload-method">
                <h3>Multiple Files Upload</h3>
                <input
                  type="file"
                  id="multiple-files-input"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <label htmlFor="multiple-files-input" className="file-upload-button">
                  Choose Multiple Files
                </label>
              </div>
            </div>

            <div className="drag-drop-upload">
              <h3>Drag & Drop Upload</h3>
              <div
                className={`drop-zone-upload ${isDraggingFile ? 'dragging' : ''}`}
                onDragOver={handleFileDragOver}
                onDragLeave={handleFileDragLeave}
                onDrop={handleFileDrop}
              >
                <div className="drop-zone-content">
                  <svg
                    className="upload-icon"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="drop-text">Drag and drop files here</p>
                  <p className="drop-subtext">or click to browse</p>
                </div>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="uploaded-files-section">
                <div className="section-header">
                  <h3>Uploaded Files ({uploadedFiles.length})</h3>
                  <button type="button" className="clear-all-button" onClick={clearAllFiles}>
                    Clear All
                  </button>
                </div>
                <div className="files-list">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="file-item">
                      {file.preview && (
                        <div className="file-preview">
                          <img src={file.preview} alt={file.name} />
                        </div>
                      )}
                      {!file.preview && (
                        <div className="file-icon">
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                            <polyline points="13 2 13 9 20 9" />
                          </svg>
                        </div>
                      )}
                      <div className="file-details">
                        <p className="file-name">{file.name}</p>
                        <p className="file-info">
                          {file.type || 'Unknown type'} • {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button type="button" className="remove-file-button" onClick={() => removeFile(file.id)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (selectedOption === 'alerts-modals') {
      return (
        <div className="content-section">
          <h2>Alerts & Modals</h2>
          <p>Practice testing alerts and modal dialogs</p>

          {/* Alerts Container */}
          <div className="alerts-container">
            {alerts.map((alert) => (
              <div key={alert.id} className={`alert alert-${alert.type}`}>
                <span className="alert-message">{alert.message}</span>
                <button type="button" className="alert-close" onClick={() => removeAlert(alert.id)}>
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="alerts-modals-content">
            {/* Alert Triggers */}
            <div className="section-group">
              <h3>Alerts</h3>
              <div className="button-grid">
                <button
                  type="button"
                  className="trigger-button success"
                  onClick={() => showAlert('success', 'Success! Operation completed successfully.')}
                >
                  Show Success Alert
                </button>
                <button
                  type="button"
                  className="trigger-button error"
                  onClick={() => showAlert('error', 'Error! Something went wrong.')}
                >
                  Show Error Alert
                </button>
                <button
                  type="button"
                  className="trigger-button warning"
                  onClick={() => showAlert('warning', 'Warning! Please proceed with caution.')}
                >
                  Show Warning Alert
                </button>
                <button
                  type="button"
                  className="trigger-button info"
                  onClick={() => showAlert('info', 'Info! Here is some useful information.')}
                >
                  Show Info Alert
                </button>
              </div>
            </div>

            {/* Modal Triggers */}
            <div className="section-group">
              <h3>Modals</h3>
              <div className="button-grid">
                <button type="button" className="trigger-button modal" onClick={() => openAlertModal('simple')}>
                  Open Simple Modal
                </button>
                <button type="button" className="trigger-button modal" onClick={() => openAlertModal('form')}>
                  Open Form Modal
                </button>
                <button type="button" className="trigger-button modal" onClick={() => openAlertModal('confirmation')}>
                  Open Confirmation Modal
                </button>
              </div>
            </div>
          </div>

          {/* Modals */}
          {activeModal === 'simple' && (
            <div className="modal-overlay" onClick={closeAlertModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Simple Modal</h3>
                  <button type="button" className="modal-close" onClick={closeAlertModal}>
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <p>This is a simple modal dialog for testing purposes.</p>
                  <p>You can interact with elements inside this modal.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="modal-button" onClick={closeAlertModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeModal === 'form' && (
            <div className="modal-overlay" onClick={closeAlertModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Form Modal</h3>
                  <button type="button" className="modal-close" onClick={closeAlertModal}>
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      showAlert('success', 'Form submitted successfully!');
                      closeAlertModal();
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="modal-name">Name:</label>
                      <input type="text" id="modal-name" placeholder="Enter your name" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="modal-email">Email:</label>
                      <input type="email" id="modal-email" placeholder="Enter your email" required />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="modal-button secondary" onClick={closeAlertModal}>
                        Cancel
                      </button>
                      <button type="submit" className="modal-button">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeModal === 'confirmation' && (
            <div className="modal-overlay" onClick={closeAlertModal}>
              <div className="modal-content confirmation" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Confirm Action</h3>
                  <button type="button" className="modal-close" onClick={closeAlertModal}>
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  {!confirmationResult ? (
                    <p>Are you sure you want to proceed with this action?</p>
                  ) : (
                    <div className="confirmation-result">
                      <p className={confirmationResult === 'Confirmed' ? 'success-text' : 'error-text'}>
                        {confirmationResult}!
                      </p>
                    </div>
                  )}
                </div>
                {!confirmationResult && (
                  <div className="modal-footer">
                    <button type="button" className="modal-button secondary" onClick={() => handleConfirmation(false)}>
                      Cancel
                    </button>
                    <button type="button" className="modal-button danger" onClick={() => handleConfirmation(true)}>
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedOption === 'navigation') {
      return (
        <div className="content-section">
          <h2>Navigation & Links</h2>
          <p>Practice testing different types of navigation and link behaviors</p>

          <div className="navigation-content">
            {/* HTML Links */}
            <div className="nav-section">
              <h3>HTML Links</h3>
              <div className="nav-items">
                <div className="nav-item">
                  <a href="/" className="nav-link">
                    Same Page Link (Home)
                  </a>
                  <span className="nav-description">Opens in the same window/tab</span>
                </div>

                <div className="nav-item">
                  <a href="/qa-practice/web-inputs" target="_blank" rel="noopener noreferrer" className="nav-link">
                    New Tab Link (Web Inputs)
                  </a>
                  <span className="nav-description">Opens in a new tab with target=&quot;_blank&quot;</span>
                </div>

                <div className="nav-item">
                  <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="nav-link external">
                    External Link (Example.com)
                  </a>
                  <span className="nav-description">Opens external site in new tab</span>
                </div>

                <div className="nav-item">
                  <a href="#top" className="nav-link">
                    Anchor Link (#top)
                  </a>
                  <span className="nav-description">Scrolls to top of page</span>
                </div>
              </div>
            </div>

            {/* JavaScript Navigation */}
            <div className="nav-section">
              <h3>JavaScript Navigation</h3>
              <div className="nav-items">
                <div className="nav-item">
                  <button
                    type="button"
                    className="nav-button"
                    onClick={() => openInNewTab('/qa-practice/dynamic-table')}
                  >
                    Open in New Tab (Dynamic Table)
                  </button>
                  <span className="nav-description">Uses window.open() with _blank</span>
                </div>

                <div className="nav-item">
                  <button
                    type="button"
                    className="nav-button"
                    onClick={() => openInNewWindow('/qa-practice/drag-and-drop')}
                  >
                    Open in New Window (Drag & Drop)
                  </button>
                  <span className="nav-description">Opens with specific dimensions (800x600)</span>
                </div>

                <div className="nav-item">
                  <button type="button" className="nav-button" onClick={() => navigate('/qa-practice/iframe')}>
                    Navigate with React Router (IFrame)
                  </button>
                  <span className="nav-description">Uses React Router navigation</span>
                </div>

                <div className="nav-item">
                  <button type="button" className="nav-button" onClick={() => openInSameWindow('/')}>
                    Redirect Same Window (Home)
                  </button>
                  <span className="nav-description">Uses window.location.href</span>
                </div>
              </div>
            </div>

            {/* Special Links */}
            <div className="nav-section">
              <h3>Special Navigation</h3>
              <div className="nav-items">
                <div className="nav-item">
                  <button type="button" className="nav-button" onClick={() => window.history.back()}>
                    Go Back
                  </button>
                  <span className="nav-description">Browser back button</span>
                </div>

                <div className="nav-item">
                  <button type="button" className="nav-button" onClick={() => window.history.forward()}>
                    Go Forward
                  </button>
                  <span className="nav-description">Browser forward button</span>
                </div>

                <div className="nav-item">
                  <button type="button" className="nav-button" onClick={() => window.location.reload()}>
                    Reload Page
                  </button>
                  <span className="nav-description">Refreshes the current page</span>
                </div>

                <div className="nav-item">
                  <button
                    type="button"
                    className="nav-button"
                    onClick={() => {
                      const newWindow = window.open('', '_blank', 'width=600,height=400');
                      newWindow.document.write('<h1>Blank Page</h1><p>This is a dynamically created page.</p>');
                    }}
                  >
                    Open Blank Page
                  </button>
                  <span className="nav-description">Creates and opens a blank page with content</span>
                </div>
              </div>
            </div>

            {/* Multiple Tabs/Windows */}
            <div className="nav-section">
              <h3>Multiple Tabs/Windows</h3>
              <div className="nav-items">
                <div className="nav-item">
                  <button
                    type="button"
                    className="nav-button-primary"
                    onClick={() => {
                      openInNewTab('/qa-practice/web-inputs');
                      openInNewTab('/qa-practice/dynamic-table');
                      openInNewTab('/qa-practice/drag-and-drop');
                    }}
                  >
                    Open 3 Tabs at Once
                  </button>
                  <span className="nav-description">Opens multiple tabs simultaneously</span>
                </div>

                <div className="nav-item">
                  <button
                    type="button"
                    className="nav-button-primary"
                    onClick={() => {
                      openInNewWindow('/qa-practice/iframe');
                      openInNewWindow('/qa-practice/file-upload');
                    }}
                  >
                    Open 2 Windows at Once
                  </button>
                  <span className="nav-description">Opens multiple windows with specific dimensions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedOption === 'tooltips') {
      return (
        <div className="content-section">
          <h2>Tooltips</h2>
          <p>Practice testing different tooltip behaviors and positions</p>

          <div className="tooltips-content">
            {/* Hover Tooltips */}
            <div className="tooltip-section">
              <h3>Hover Tooltips</h3>
              <div className="tooltip-grid">
                <div className="tooltip-wrapper">
                  <button type="button" className="tooltip-trigger">
                    Top Tooltip
                  </button>
                  <span className="tooltip tooltip-top">This is a top tooltip</span>
                </div>

                <div className="tooltip-wrapper">
                  <button type="button" className="tooltip-trigger">
                    Bottom Tooltip
                  </button>
                  <span className="tooltip tooltip-bottom">This is a bottom tooltip</span>
                </div>

                <div className="tooltip-wrapper">
                  <button type="button" className="tooltip-trigger">
                    Left Tooltip
                  </button>
                  <span className="tooltip tooltip-left">This is a left tooltip</span>
                </div>

                <div className="tooltip-wrapper">
                  <button type="button" className="tooltip-trigger">
                    Right Tooltip
                  </button>
                  <span className="tooltip tooltip-right">This is a right tooltip</span>
                </div>
              </div>
            </div>

            {/* Click Tooltips */}
            <div className="tooltip-section">
              <h3>Click Tooltips</h3>
              <div className="tooltip-grid">
                <div className="tooltip-wrapper click-tooltip">
                  <button
                    type="button"
                    className="tooltip-trigger"
                    onClick={() => setActiveTooltip(activeTooltip === 'click1' ? null : 'click1')}
                  >
                    Click Me
                  </button>
                  {activeTooltip === 'click1' && (
                    <span className="tooltip tooltip-bottom active">Tooltip activated by click!</span>
                  )}
                </div>

                <div className="tooltip-wrapper click-tooltip">
                  <button
                    type="button"
                    className="tooltip-trigger"
                    onClick={() => setActiveTooltip(activeTooltip === 'click2' ? null : 'click2')}
                  >
                    Toggle Tooltip
                  </button>
                  {activeTooltip === 'click2' && (
                    <span className="tooltip tooltip-top active">Click again to hide</span>
                  )}
                </div>
              </div>
            </div>

            {/* Colored Tooltips */}
            <div className="tooltip-section">
              <h3>Colored Tooltips</h3>
              <div className="tooltip-grid">
                <div className="tooltip-wrapper">
                  <button type="button" className="tooltip-trigger success">
                    Success
                  </button>
                  <span className="tooltip tooltip-top success">Operation successful!</span>
                </div>

                <div className="tooltip-wrapper">
                  <button type="button" className="tooltip-trigger error">
                    Error
                  </button>
                  <span className="tooltip tooltip-top error">Something went wrong!</span>
                </div>

                <div className="tooltip-wrapper">
                  <button type="button" className="tooltip-trigger warning">
                    Warning
                  </button>
                  <span className="tooltip tooltip-top warning">Proceed with caution!</span>
                </div>

                <div className="tooltip-wrapper">
                  <button type="button" className="tooltip-trigger info">
                    Info
                  </button>
                  <span className="tooltip tooltip-top info">Here&apos;s some helpful info</span>
                </div>
              </div>
            </div>

            {/* Icon Tooltips */}
            <div className="tooltip-section">
              <h3>Icon Tooltips</h3>
              <div className="tooltip-grid">
                <div className="tooltip-wrapper">
                  <button type="button" className="icon-button">
                    ℹ️
                  </button>
                  <span className="tooltip tooltip-right">Information Icon</span>
                </div>

                <div className="tooltip-wrapper">
                  <button type="button" className="icon-button">
                    ⚙️
                  </button>
                  <span className="tooltip tooltip-right">Settings Icon</span>
                </div>

                <div className="tooltip-wrapper">
                  <button type="button" className="icon-button">
                    ❓
                  </button>
                  <span className="tooltip tooltip-right">Help Icon</span>
                </div>

                <div className="tooltip-wrapper">
                  <button type="button" className="icon-button">
                    ⭐
                  </button>
                  <span className="tooltip tooltip-right">Favorite Icon</span>
                </div>
              </div>
            </div>

            {/* Long Text Tooltip */}
            <div className="tooltip-section">
              <h3>Long Text Tooltip</h3>
              <div className="tooltip-wrapper">
                <button type="button" className="tooltip-trigger">
                  Hover for Details
                </button>
                <span className="tooltip tooltip-bottom wide">
                  This is a tooltip with much longer text that wraps to multiple lines. It can contain detailed
                  information about the element it&apos;s attached to.
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedOption === 'loaders') {
      const triggerSpinner = () => {
        setLoaderSpinner(true);
        setTimeout(() => setLoaderSpinner(false), 3000);
      };

      const triggerProgress = () => {
        setLoaderProgress(true);
        setLoaderProgressVal(0);
        let val = 0;
        const iv = setInterval(() => {
          val += 10;
          setLoaderProgressVal(val);
          if (val >= 100) {
            clearInterval(iv);
            setTimeout(() => {
              setLoaderProgress(false);
              setLoaderProgressVal(0);
            }, 400);
          }
        }, 200);
      };

      const triggerSkeleton = () => {
        setLoaderSkeleton(true);
        setTimeout(() => setLoaderSkeleton(false), 3000);
      };

      const triggerOverlay = () => {
        setLoaderOverlay(true);
        setTimeout(() => setLoaderOverlay(false), 3000);
      };

      return (
        <div className="content-section">
          <h2>Loaders &amp; Spinners</h2>
          <p>
            Click each trigger button to start a loader. The loader appears, then disappears automatically — practice
            waiting for it to show up and waiting for it to be gone.
          </p>

          <div className="loaders-content">
            {/* 1 — Spinner */}
            <div className="loader-scenario" data-testid="spinner-scenario">
              <div className="loader-scenario-header">
                <div>
                  <h3>Spinner</h3>
                  <p className="loader-scenario-desc">
                    Appears for 3 s then disappears. Practice{' '}
                    <code>waitFor(() =&gt; expect(spinner).toBeVisible())</code> and{' '}
                    <code>waitFor(() =&gt; expect(spinner).not.toBeInTheDocument())</code>.
                  </p>
                </div>
                <button
                  type="button"
                  className="loader-trigger-btn"
                  data-testid="start-spinner-btn"
                  onClick={triggerSpinner}
                  disabled={loaderSpinner}
                >
                  {loaderSpinner ? 'Loading…' : 'Start spinner'}
                </button>
              </div>
              {loaderSpinner && (
                <div className="loader-display" data-testid="spinner-display">
                  <div className="spinner spinner-border" data-testid="spinner" role="status" aria-label="Loading" />
                </div>
              )}
              <div
                className="loader-status"
                data-testid="spinner-status"
                data-loading={loaderSpinner ? 'true' : 'false'}
              >
                {loaderSpinner ? '⏳ Loading…' : '✓ Idle'}
              </div>
            </div>

            {/* 2 — Progress bar */}
            <div className="loader-scenario" data-testid="progress-scenario">
              <div className="loader-scenario-header">
                <div>
                  <h3>Progress Bar</h3>
                  <p className="loader-scenario-desc">
                    Counts 0 → 100% over ~2 s. Assert the <code>aria-valuenow</code> attribute or check the status text.
                  </p>
                </div>
                <button
                  type="button"
                  className="loader-trigger-btn"
                  data-testid="start-progress-btn"
                  onClick={triggerProgress}
                  disabled={loaderProgress}
                >
                  {loaderProgress ? 'Running…' : 'Start progress'}
                </button>
              </div>
              {loaderProgress && (
                <div className="loader-display" data-testid="progress-display">
                  <div
                    className="loader-progress-bar"
                    role="progressbar"
                    aria-label="Loading progress"
                    aria-valuenow={loaderProgressVal}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    data-testid="progress-bar"
                  >
                    <div className="loader-progress-fill" style={{ width: `${loaderProgressVal}%` }} />
                  </div>
                  <span className="loader-progress-pct" data-testid="progress-value">
                    {loaderProgressVal}%
                  </span>
                </div>
              )}
              <div
                className="loader-status"
                data-testid="progress-status"
                data-loading={loaderProgress ? 'true' : 'false'}
              >
                {loaderProgress ? `⏳ ${loaderProgressVal}%` : '✓ Idle'}
              </div>
            </div>

            {/* 3 — Skeleton */}
            <div className="loader-scenario" data-testid="skeleton-scenario">
              <div className="loader-scenario-header">
                <div>
                  <h3>Skeleton Loader</h3>
                  <p className="loader-scenario-desc">
                    Skeleton replaces real content for 3 s. Assert <code>{'data-testid="skeleton-display"'}</code> is
                    visible, then not.
                  </p>
                </div>
                <button
                  type="button"
                  className="loader-trigger-btn"
                  data-testid="start-skeleton-btn"
                  onClick={triggerSkeleton}
                  disabled={loaderSkeleton}
                >
                  {loaderSkeleton ? 'Loading…' : 'Start skeleton'}
                </button>
              </div>
              {loaderSkeleton ? (
                <div className="skeleton-container" data-testid="skeleton-display">
                  <div className="skeleton-card">
                    <div className="skeleton-avatar" />
                    <div className="skeleton-content">
                      <div className="skeleton-line" />
                      <div className="skeleton-line short" />
                    </div>
                  </div>
                  <div className="skeleton-card">
                    <div className="skeleton-image" />
                    <div className="skeleton-content">
                      <div className="skeleton-line" />
                      <div className="skeleton-line" />
                      <div className="skeleton-line short" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="loader-real-content" data-testid="skeleton-content">
                  <div className="loader-fake-card">
                    <img
                      className="loader-fake-avatar"
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%236366f1'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='18'%3EJ%3C/text%3E%3C/svg%3E"
                      alt="avatar"
                    />
                    <div>
                      <strong>Jane Smith</strong>
                      <p>Software QA Engineer</p>
                    </div>
                  </div>
                  <div className="loader-fake-card">
                    <img
                      className="loader-fake-avatar"
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%2322c55e'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='18'%3EM%3C/text%3E%3C/svg%3E"
                      alt="avatar"
                    />
                    <div>
                      <strong>Mark Rivera</strong>
                      <p>Frontend Developer</p>
                    </div>
                  </div>
                </div>
              )}
              <div
                className="loader-status"
                data-testid="skeleton-status"
                data-loading={loaderSkeleton ? 'true' : 'false'}
              >
                {loaderSkeleton ? '⏳ Loading content…' : '✓ Content loaded'}
              </div>
            </div>

            {/* 4 — Full-page overlay */}
            <div className="loader-scenario" data-testid="overlay-scenario">
              <div className="loader-scenario-header">
                <div>
                  <h3>Full-page Overlay</h3>
                  <p className="loader-scenario-desc">
                    A semi-transparent overlay covers the page for 3 s. Practice asserting an element is blocked
                    (covered) while the overlay is active.
                  </p>
                </div>
                <button
                  type="button"
                  className="loader-trigger-btn"
                  data-testid="start-overlay-btn"
                  onClick={triggerOverlay}
                  disabled={loaderOverlay}
                >
                  {loaderOverlay ? 'Loading…' : 'Start overlay'}
                </button>
              </div>
              <div
                className="loader-status"
                data-testid="overlay-status"
                data-loading={loaderOverlay ? 'true' : 'false'}
              >
                {loaderOverlay ? '⏳ Overlay active…' : '✓ Idle'}
              </div>
            </div>
          </div>

          {loaderOverlay && (
            <div className="loader-overlay" data-testid="overlay-display" aria-label="Page loading overlay">
              <div className="loader-overlay-box">
                <div className="spinner spinner-border" data-testid="overlay-spinner" />
                <span>Please wait…</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedOption === 'accordion') {
      return (
        <div className="content-section">
          <h2>Accordion</h2>
          <p>Practice testing accordion components with expandable/collapsible sections</p>

          <div className="accordion-content">
            {/* Single Accordion */}
            <div className="accordion-section">
              <h3>Single Accordion (Only One Open)</h3>
              <div className="accordion-container">
                <div className="accordion-item">
                  <button
                    type="button"
                    className={`accordion-header ${singleAccordion === 1 ? 'active' : ''}`}
                    onClick={() => toggleSingleAccordion(1)}
                  >
                    <span>Section 1: What is QA Testing?</span>
                    <span className="accordion-icon">{singleAccordion === 1 ? '−' : '+'}</span>
                  </button>
                  <div className={`accordion-body ${singleAccordion === 1 ? 'open' : ''}`}>
                    <div className="accordion-content-inner">
                      <p>
                        Quality Assurance (QA) testing is a systematic process of checking whether a product or service
                        meets specified requirements and quality standards. It involves identifying bugs, issues, and
                        defects before the product reaches end users.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <button
                    type="button"
                    className={`accordion-header ${singleAccordion === 2 ? 'active' : ''}`}
                    onClick={() => toggleSingleAccordion(2)}
                  >
                    <span>Section 2: Types of Testing</span>
                    <span className="accordion-icon">{singleAccordion === 2 ? '−' : '+'}</span>
                  </button>
                  <div className={`accordion-body ${singleAccordion === 2 ? 'open' : ''}`}>
                    <div className="accordion-content-inner">
                      <p>Common types of testing include:</p>
                      <ul>
                        <li>Unit Testing</li>
                        <li>Integration Testing</li>
                        <li>Functional Testing</li>
                        <li>Performance Testing</li>
                        <li>Security Testing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <button
                    type="button"
                    className={`accordion-header ${singleAccordion === 3 ? 'active' : ''}`}
                    onClick={() => toggleSingleAccordion(3)}
                  >
                    <span>Section 3: Best Practices</span>
                    <span className="accordion-icon">{singleAccordion === 3 ? '−' : '+'}</span>
                  </button>
                  <div className={`accordion-body ${singleAccordion === 3 ? 'open' : ''}`}>
                    <div className="accordion-content-inner">
                      <p>Follow these best practices for effective QA testing:</p>
                      <ul>
                        <li>Write clear and detailed test cases</li>
                        <li>Automate repetitive tests</li>
                        <li>Test early and often</li>
                        <li>Document all findings</li>
                        <li>Collaborate with development team</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Multiple Accordion */}
            <div className="accordion-section">
              <h3>Multiple Accordion (Multiple Can Be Open)</h3>
              <div className="accordion-container">
                <div className="accordion-item">
                  <button
                    type="button"
                    className={`accordion-header ${multipleAccordion.includes(1) ? 'active' : ''}`}
                    onClick={() => toggleMultipleAccordion(1)}
                  >
                    <span>HTML Basics</span>
                    <span className="accordion-icon">{multipleAccordion.includes(1) ? '−' : '+'}</span>
                  </button>
                  <div className={`accordion-body ${multipleAccordion.includes(1) ? 'open' : ''}`}>
                    <div className="accordion-content-inner">
                      <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages.</p>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <button
                    type="button"
                    className={`accordion-header ${multipleAccordion.includes(2) ? 'active' : ''}`}
                    onClick={() => toggleMultipleAccordion(2)}
                  >
                    <span>CSS Styling</span>
                    <span className="accordion-icon">{multipleAccordion.includes(2) ? '−' : '+'}</span>
                  </button>
                  <div className={`accordion-body ${multipleAccordion.includes(2) ? 'open' : ''}`}>
                    <div className="accordion-content-inner">
                      <p>
                        CSS (Cascading Style Sheets) is used to style and layout web pages, controlling colors, fonts,
                        spacing, and more.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <button
                    type="button"
                    className={`accordion-header ${multipleAccordion.includes(3) ? 'active' : ''}`}
                    onClick={() => toggleMultipleAccordion(3)}
                  >
                    <span>JavaScript Fundamentals</span>
                    <span className="accordion-icon">{multipleAccordion.includes(3) ? '−' : '+'}</span>
                  </button>
                  <div className={`accordion-body ${multipleAccordion.includes(3) ? 'open' : ''}`}>
                    <div className="accordion-content-inner">
                      <p>
                        JavaScript is a programming language that enables interactive web pages and dynamic content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedOption === 'tabs') {
      return (
        <div className="content-section">
          <h2>Tabs</h2>
          <p>Practice testing tab navigation and content switching</p>
          <div className="tabs-container">
            <div className="tabs-header">
              <button
                type="button"
                className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`}
                onClick={() => setActiveTab('tab1')}
              >
                Tab 1
              </button>
              <button
                type="button"
                className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`}
                onClick={() => setActiveTab('tab2')}
              >
                Tab 2
              </button>
              <button
                type="button"
                className={`tab-button ${activeTab === 'tab3' ? 'active' : ''}`}
                onClick={() => setActiveTab('tab3')}
              >
                Tab 3
              </button>
            </div>
            <div className="tabs-content">
              {activeTab === 'tab1' && (
                <div className="tab-panel">
                  <h3>Tab 1 Content</h3>
                  <p>This is the content for the first tab. You can add any content here.</p>
                </div>
              )}
              {activeTab === 'tab2' && (
                <div className="tab-panel">
                  <h3>Tab 2 Content</h3>
                  <p>This is the content for the second tab with different information.</p>
                </div>
              )}
              {activeTab === 'tab3' && (
                <div className="tab-panel">
                  <h3>Tab 3 Content</h3>
                  <p>This is the content for the third tab. Tabs are great for organizing content!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (selectedOption === 'carousel') {
      return (
        <div className="content-section">
          <h2>Carousel</h2>
          <p>Practice testing carousel/slider components</p>
          <div className="carousel-content">
            <div className="carousel-container">
              <div className="carousel-slides">
                {carouselSlides.map((slide, index) => (
                  <div key={index} className={`carousel-slide ${currentSlide === index ? 'active' : ''}`}>
                    <h3>{slide.title}</h3>
                    <p>{slide.description}</p>
                  </div>
                ))}
              </div>
              <div className="carousel-controls">
                <button type="button" className="carousel-button prev" onClick={prevSlide}>
                  ‹
                </button>
                <button type="button" className="carousel-button next" onClick={nextSlide}>
                  ›
                </button>
              </div>
              <div className="carousel-dots">
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedOption === 'search-filters') {
      return (
        <div className="content-section">
          <h2>Search & Filters</h2>
          <p>Practice testing search and filter functionality</p>
          <div className="search-filters-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filters-bar">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="fruit">Fruits</option>
                <option value="vegetable">Vegetables</option>
                <option value="meat">Meat</option>
                <option value="dairy">Dairy</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                <option value="name">Sort by Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
            <div className="results-list">
              {filteredData.map((item) => (
                <div key={item.id} className="result-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-category">{item.category}</span>
                  <span className="item-price">${item.price.toFixed(2)}</span>
                </div>
              ))}
              {filteredData.length === 0 && <div className="no-results">No results found</div>}
            </div>
          </div>
        </div>
      );
    }

    if (selectedOption === 'breadcrumbs') {
      return (
        <div className="content-section">
          <h2>Breadcrumbs</h2>
          <p>Practice testing breadcrumb navigation</p>
          <div className="breadcrumbs-examples">
            <div className="breadcrumb-example">
              <h3>Simple Breadcrumb</h3>
              <nav className="breadcrumb">
                <a href="/" className="breadcrumb-item">
                  Home
                </a>
                <span className="breadcrumb-separator">›</span>
                <a href="/qa-practice" className="breadcrumb-item">
                  QA Practice
                </a>
                <span className="breadcrumb-separator">›</span>
                <span className="breadcrumb-item active">Breadcrumbs</span>
              </nav>
            </div>
            <div className="breadcrumb-example">
              <h3>With Icons</h3>
              <nav className="breadcrumb">
                <a href="/" className="breadcrumb-item">
                  🏠 Home
                </a>
                <span className="breadcrumb-separator">/</span>
                <a href="/qa-practice" className="breadcrumb-item">
                  📝 Practice
                </a>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-item active">🍞 Breadcrumbs</span>
              </nav>
            </div>
          </div>
        </div>
      );
    }

    if (selectedOption === 'context-menu') {
      return (
        <div className="content-section">
          <h2>Context Menu</h2>
          <p>Practice testing right-click context menus</p>
          <div className="context-menu-area" onContextMenu={handleContextMenu}>
            Right-click anywhere in this box to open the context menu
          </div>
          {contextMenu && (
            <div className="custom-context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
              <button type="button" className="context-menu-item" onClick={() => alert('Copy clicked')}>
                Copy
              </button>
              <button type="button" className="context-menu-item" onClick={() => alert('Paste clicked')}>
                Paste
              </button>
              <button type="button" className="context-menu-item" onClick={() => alert('Delete clicked')}>
                Delete
              </button>
            </div>
          )}
        </div>
      );
    }

    if (selectedOption === 'copy-clipboard') {
      return (
        <div className="content-section">
          <h2>Copy to Clipboard</h2>
          <p>Practice testing copy to clipboard functionality</p>
          <div className="copy-examples">
            <div className="copy-box">
              <code className="copy-text">npm install react</code>
              <button type="button" className="copy-button" onClick={() => copyToClipboard('npm install react')}>
                {copiedText === 'npm install react' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="copy-box">
              <code className="copy-text">git clone https://github.com/example/repo.git</code>
              <button
                type="button"
                className="copy-button"
                onClick={() => copyToClipboard('git clone https://github.com/example/repo.git')}
              >
                {copiedText === 'git clone https://github.com/example/repo.git' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (selectedOption === 'rating') {
      return (
        <div className="content-section">
          <h2>Rating</h2>
          <p>Practice testing star rating components</p>
          <div className="rating-container">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="rating-text">
              {rating > 0 ? `You rated: ${rating} star${rating > 1 ? 's' : ''}` : 'Click to rate'}
            </p>
          </div>
        </div>
      );
    }

    if (selectedOption === 'wizard') {
      return (
        <div className="content-section">
          <h2>Multi-step Wizard</h2>
          <p>Practice testing multi-step form wizards</p>
          <div className="wizard-container">
            <div className="wizard-steps">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`wizard-step ${wizardStep >= step ? 'active' : ''}`}>
                  <div className="step-number">{step}</div>
                  <div className="step-label">Step {step}</div>
                </div>
              ))}
            </div>
            <div className="wizard-content">
              {wizardStep === 1 && (
                <div>
                  <h3>Step 1: Personal Information</h3>
                  <p>Enter your personal details here.</p>
                </div>
              )}
              {wizardStep === 2 && (
                <div>
                  <h3>Step 2: Account Settings</h3>
                  <p>Configure your account settings.</p>
                </div>
              )}
              {wizardStep === 3 && (
                <div>
                  <h3>Step 3: Review & Submit</h3>
                  <p>Review your information and submit.</p>
                </div>
              )}
            </div>
            <div className="wizard-buttons">
              <button
                type="button"
                className="wizard-button"
                onClick={() => setWizardStep(wizardStep - 1)}
                disabled={wizardStep === 1}
              >
                Previous
              </button>
              <button
                type="button"
                className="wizard-button primary"
                onClick={() => setWizardStep(wizardStep + 1)}
                disabled={wizardStep === 3}
              >
                {wizardStep === 3 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (selectedOption === 'infinite-scroll') {
      return (
        <div className="content-section">
          <h2>Infinite Scroll</h2>
          <p>Practice testing infinite scroll functionality</p>
          <div className="infinite-scroll-container">
            {scrollItems.map((item) => (
              <div key={item} className="scroll-item">
                Item {item}
              </div>
            ))}
            {isLoadingMore && <div className="loading-indicator">Loading more items...</div>}
            {!isLoadingMore && (
              <button type="button" className="load-more-button" onClick={loadMoreItems}>
                Load More
              </button>
            )}
          </div>
        </div>
      );
    }

    if (selectedOption === 'sticky-elements') {
      return (
        <div className="content-section">
          <h2>Sticky Elements</h2>
          <p>Practice testing sticky/fixed positioned elements</p>
          <div className="sticky-demo" data-testid="sticky-demo">
            <div className="sticky-header" data-testid="sticky-header">
              📌 This header sticks to the top when scrolling
            </div>
            <div className="content-block" data-testid="sticky-content">
              <p>⬇️ Scroll down to see the sticky header remain fixed at the top.</p>
              {Array.from({ length: 30 }, (_, i) => (
                <p key={i} data-testid={`sticky-paragraph-${i + 1}`}>
                  Paragraph {i + 1} — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                  ullamco laboris.
                </p>
              ))}
            </div>
            <button
              type="button"
              className="back-to-top"
              data-testid="back-to-top-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              ↑
            </button>
          </div>
        </div>
      );
    }

    // 1. LocalStorage/SessionStorage
    if (selectedOption === 'local-storage') {
      const NS = 'qa-practice:';
      const loadStorageData = () => {
        const local = {};
        const session = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith(NS)) local[key.slice(NS.length)] = localStorage.getItem(key);
        }
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key.startsWith(NS)) session[key.slice(NS.length)] = sessionStorage.getItem(key);
        }
        setStorageData({ local, session });
      };

      return (
        <div className="content-section">
          <h2>LocalStorage/SessionStorage</h2>
          <p>Practice testing browser storage APIs</p>
          <div className="storage-section">
            <h3>LocalStorage</h3>
            <div className="storage-controls">
              <input
                type="text"
                placeholder="Key"
                data-testid="ls-key-input"
                value={localStorageKey}
                onChange={(e) => setLocalStorageKey(e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                data-testid="ls-value-input"
                value={localStorageValue}
                onChange={(e) => setLocalStorageValue(e.target.value)}
              />
              <button
                type="button"
                data-testid="ls-set-btn"
                onClick={() => {
                  if (localStorageKey) {
                    localStorage.setItem(`${NS}${localStorageKey}`, localStorageValue);
                    loadStorageData();
                    setLocalStorageKey('');
                    setLocalStorageValue('');
                  }
                }}
              >
                Set Item
              </button>
              <button
                type="button"
                data-testid="ls-clear-btn"
                onClick={() => {
                  Object.keys(localStorage)
                    .filter((k) => k.startsWith(NS))
                    .forEach((k) => localStorage.removeItem(k));
                  loadStorageData();
                }}
              >
                Clear All
              </button>
            </div>
            <div className="storage-data" data-testid="ls-data">
              {Object.entries(storageData.local).length === 0 ? (
                <span className="storage-empty" data-testid="ls-empty">
                  No items yet. Add one above.
                </span>
              ) : (
                Object.entries(storageData.local).map(([key, value]) => (
                  <div key={key} className="storage-item" data-testid={`ls-item-${key}`}>
                    <strong className="storage-item-key">{key}</strong>
                    <span className="storage-item-value" data-testid={`ls-value-${key}`} title={value}>
                      {value}
                    </span>
                    <button
                      type="button"
                      data-testid={`ls-remove-${key}`}
                      onClick={() => {
                        localStorage.removeItem(`${NS}${key}`);
                        loadStorageData();
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="storage-section">
            <h3>SessionStorage</h3>
            <div className="storage-controls">
              <input
                type="text"
                placeholder="Key"
                data-testid="ss-key-input"
                value={sessionStorageKey}
                onChange={(e) => setSessionStorageKey(e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                data-testid="ss-value-input"
                value={sessionStorageValue}
                onChange={(e) => setSessionStorageValue(e.target.value)}
              />
              <button
                type="button"
                data-testid="ss-set-btn"
                onClick={() => {
                  if (sessionStorageKey) {
                    sessionStorage.setItem(`${NS}${sessionStorageKey}`, sessionStorageValue);
                    loadStorageData();
                    setSessionStorageKey('');
                    setSessionStorageValue('');
                  }
                }}
              >
                Set Item
              </button>
              <button
                type="button"
                data-testid="ss-clear-btn"
                onClick={() => {
                  Object.keys(sessionStorage)
                    .filter((k) => k.startsWith(NS))
                    .forEach((k) => sessionStorage.removeItem(k));
                  loadStorageData();
                }}
              >
                Clear All
              </button>
            </div>
            <div className="storage-data" data-testid="ss-data">
              {Object.entries(storageData.session).length === 0 ? (
                <span className="storage-empty" data-testid="ss-empty">
                  No items yet. Add one above.
                </span>
              ) : (
                Object.entries(storageData.session).map(([key, value]) => (
                  <div key={key} className="storage-item" data-testid={`ss-item-${key}`}>
                    <strong className="storage-item-key">{key}</strong>
                    <span className="storage-item-value" data-testid={`ss-value-${key}`} title={value}>
                      {value}
                    </span>
                    <button
                      type="button"
                      data-testid={`ss-remove-${key}`}
                      onClick={() => {
                        sessionStorage.removeItem(`${NS}${key}`);
                        loadStorageData();
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            type="button"
            className="storage-refresh-btn"
            data-testid="storage-refresh-btn"
            onClick={loadStorageData}
          >
            Refresh Data
          </button>
        </div>
      );
    }

    // 2. Cookie Management
    if (selectedOption === 'cookies') {
      const COOKIE_NS = 'qa-';
      const getCookies = () => {
        const cookieArray = document.cookie
          .split(';')
          .map((c) => {
            const [name, ...rest] = c.trim().split('=');
            return { name, value: rest.join('=') };
          })
          .filter((c) => c.name && c.name.startsWith(COOKIE_NS))
          .map((c) => ({ ...c, name: c.name.slice(COOKIE_NS.length) }));
        setCookies(cookieArray);
      };

      return (
        <div className="content-section">
          <h2>Cookie Management</h2>
          <p>Practice testing cookie operations — set, read, and delete cookies via the UI.</p>

          <div className="cookie-controls">
            <input
              type="text"
              placeholder="Cookie Name"
              data-testid="cookie-name-input"
              value={cookieName}
              onChange={(e) => setCookieName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Cookie Value"
              data-testid="cookie-value-input"
              value={cookieValue}
              onChange={(e) => setCookieValue(e.target.value)}
            />
            <button
              type="button"
              className="cookie-btn cookie-btn--set"
              data-testid="cookie-set-btn"
              onClick={() => {
                if (cookieName) {
                  document.cookie = `${COOKIE_NS}${cookieName}=${cookieValue}; path=/`;
                  getCookies();
                  setCookieName('');
                  setCookieValue('');
                }
              }}
            >
              Set Cookie
            </button>
            <button
              type="button"
              className="cookie-btn cookie-btn--refresh"
              data-testid="cookie-refresh-btn"
              onClick={getCookies}
            >
              ↻ Refresh
            </button>
          </div>

          <div className="cookie-list" data-testid="cookie-list">
            <h3>Current Cookies</h3>
            {cookies.length === 0 ? (
              <p className="cookie-empty" data-testid="cookie-empty">
                No cookies yet. Add one above.
              </p>
            ) : (
              cookies.map((cookie) => (
                <div key={cookie.name} className="cookie-item" data-testid={`cookie-item-${cookie.name}`}>
                  <strong className="cookie-item-name">{cookie.name}</strong>
                  <span className="cookie-item-value" data-testid={`cookie-value-${cookie.name}`}>
                    {cookie.value}
                  </span>
                  <button
                    type="button"
                    className="cookie-btn cookie-btn--delete"
                    data-testid={`cookie-delete-${cookie.name}`}
                    onClick={() => {
                      document.cookie = `${COOKIE_NS}${cookie.name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                      getCookies();
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    // 3. API Testing
    if (selectedOption === 'api-testing') {
      const handleApiCall = async () => {
        setApiLoading(true);
        setApiError(null);
        setApiResponse(null);
        try {
          const response = await fetch(apiUrl, { method: apiMethod });
          const data = await response.json();
          setApiResponse(data);
        } catch (error) {
          setApiError(error.message);
        } finally {
          setApiLoading(false);
        }
      };

      return (
        <div className="content-section">
          <h2>API Testing</h2>
          <p>Practice testing HTTP requests</p>
          <div className="api-controls">
            <select data-testid="api-method-select" value={apiMethod} onChange={(e) => setApiMethod(e.target.value)}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              data-testid="api-url-input"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="API URL"
            />
            <button
              type="button"
              className="qa-submit-btn"
              data-testid="api-send-btn"
              onClick={handleApiCall}
              disabled={apiLoading}
            >
              {apiLoading ? 'Loading...' : 'Send Request'}
            </button>
          </div>
          {apiError && <div className="api-error">Error: {apiError}</div>}
          {apiResponse && (
            <div className="api-response">
              <h3>Response:</h3>
              <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
            </div>
          )}
        </div>
      );
    }

    // 4. Form Validation
    if (selectedOption === 'form-validation') {
      const validateForm = () => {
        const errors = {};
        if (!validationForm.username || validationForm.username.length < 3) {
          errors.username = 'Username must be at least 3 characters';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validationForm.email)) {
          errors.email = 'Invalid email format';
        }
        if (!/^\d{10}$/.test(validationForm.phone)) {
          errors.phone = 'Phone must be 10 digits';
        }
        if (validationForm.password.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        }
        if (validationForm.password !== validationForm.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
        if (validationForm.age && (validationForm.age < 18 || validationForm.age > 100)) {
          errors.age = 'Age must be between 18 and 100';
        }
        if (validationForm.website && !/^https?:\/\/.+/.test(validationForm.website)) {
          errors.website = 'Invalid URL format';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
      };

      return (
        <div className="content-section">
          <h2>Form Validation</h2>
          <p>Practice testing complex validation scenarios</p>
          {formSubmitSuccess && (
            <div className="fv-success" data-testid="form-success-msg">
              Form submitted successfully!
            </div>
          )}
          <form
            className="qa-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (validateForm()) {
                setFormSubmitSuccess(true);
                setTimeout(() => setFormSubmitSuccess(false), 3000);
              }
            }}
          >
            <div className="form-group">
              <label htmlFor="fv-username">Username (min 3 chars):</label>
              <input
                id="fv-username"
                type="text"
                data-testid="fv-username"
                value={validationForm.username}
                onChange={(e) => setValidationForm({ ...validationForm, username: e.target.value })}
              />
              {validationErrors.username && (
                <span className="error" data-testid="fv-username-error">
                  {validationErrors.username}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="fv-email">Email:</label>
              <input
                id="fv-email"
                type="email"
                data-testid="fv-email"
                value={validationForm.email}
                onChange={(e) => setValidationForm({ ...validationForm, email: e.target.value })}
              />
              {validationErrors.email && (
                <span className="error" data-testid="fv-email-error">
                  {validationErrors.email}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="fv-phone">Phone (10 digits):</label>
              <input
                id="fv-phone"
                type="tel"
                data-testid="fv-phone"
                value={validationForm.phone}
                onChange={(e) => setValidationForm({ ...validationForm, phone: e.target.value })}
              />
              {validationErrors.phone && (
                <span className="error" data-testid="fv-phone-error">
                  {validationErrors.phone}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="fv-password">Password (min 8 chars):</label>
              <input
                id="fv-password"
                type="password"
                data-testid="fv-password"
                value={validationForm.password}
                onChange={(e) => setValidationForm({ ...validationForm, password: e.target.value })}
              />
              {validationErrors.password && (
                <span className="error" data-testid="fv-password-error">
                  {validationErrors.password}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="fv-confirm-password">Confirm Password:</label>
              <input
                id="fv-confirm-password"
                type="password"
                data-testid="fv-confirm-password"
                value={validationForm.confirmPassword}
                onChange={(e) => setValidationForm({ ...validationForm, confirmPassword: e.target.value })}
              />
              {validationErrors.confirmPassword && (
                <span className="error" data-testid="fv-confirm-password-error">
                  {validationErrors.confirmPassword}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="fv-age">Age (18-100):</label>
              <input
                id="fv-age"
                type="number"
                data-testid="fv-age"
                value={validationForm.age}
                onChange={(e) => setValidationForm({ ...validationForm, age: e.target.value })}
              />
              {validationErrors.age && (
                <span className="error" data-testid="fv-age-error">
                  {validationErrors.age}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="fv-website">Website:</label>
              <input
                id="fv-website"
                type="url"
                data-testid="fv-website"
                value={validationForm.website}
                onChange={(e) => setValidationForm({ ...validationForm, website: e.target.value })}
              />
              {validationErrors.website && (
                <span className="error" data-testid="fv-website-error">
                  {validationErrors.website}
                </span>
              )}
            </div>
            <button type="submit" className="qa-submit-btn" data-testid="fv-submit">
              Validate Form
            </button>
          </form>
        </div>
      );
    }

    // 5. Authentication
    if (selectedOption === 'authentication') {
      const handleLogin = (e) => {
        e.preventDefault();
        if (loginForm.username === 'admin' && loginForm.password === 'password123') {
          setAuthUser({ username: loginForm.username, role: 'admin' });
          setLoginForm({ username: '', password: '' });
          setLoginError('');
        } else {
          setLoginError('Invalid credentials. Try admin / password123');
        }
      };

      const handleLogout = () => {
        setAuthUser(null);
        setLoginError('');
      };

      return (
        <div className="content-section">
          <h2>Authentication Flow</h2>
          <p>Practice testing login/logout functionality</p>
          {!authUser ? (
            <form onSubmit={handleLogin} className="login-form" data-testid="login-form">
              <h3>Login</h3>
              <p className="hint">Hint: username: admin, password: password123</p>
              {loginError && (
                <div className="auth-error" data-testid="login-error">
                  {loginError}
                </div>
              )}
              <input
                type="text"
                placeholder="Username"
                data-testid="login-username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                data-testid="login-password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <button type="submit" className="qa-submit-btn" data-testid="login-submit">
                Login
              </button>
            </form>
          ) : (
            <div className="authenticated-content" data-testid="authenticated-content">
              <h3 data-testid="welcome-msg">Welcome, {authUser.username}!</h3>
              <p data-testid="auth-role">Role: {authUser.role}</p>
              <button type="button" className="auth-logout-btn" data-testid="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      );
    }

    // 6. Download Files
    if (selectedOption === 'download-files') {
      const downloadFile = () => {
        let content, filename, mimeType;
        if (downloadType === 'text') {
          content = 'This is a test file for QA automation testing.';
          filename = 'test.txt';
          mimeType = 'text/plain';
        } else if (downloadType === 'json') {
          content = JSON.stringify({ message: 'Test JSON file', timestamp: new Date() }, null, 2);
          filename = 'test.json';
          mimeType = 'application/json';
        } else if (downloadType === 'csv') {
          content = 'Name,Email,Role\nJohn Doe,john@example.com,Developer\nJane Smith,jane@example.com,Designer';
          filename = 'test.csv';
          mimeType = 'text/csv';
        }
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      };

      return (
        <div className="content-section">
          <h2>Download Files</h2>
          <p>Practice testing file download functionality</p>
          <div className="download-controls">
            <select
              data-testid="download-type-select"
              value={downloadType}
              onChange={(e) => setDownloadType(e.target.value)}
            >
              <option value="text">Text File (.txt)</option>
              <option value="json">JSON File (.json)</option>
              <option value="csv">CSV File (.csv)</option>
            </select>
            <button type="button" className="qa-submit-btn" data-testid="download-btn" onClick={downloadFile}>
              Download File
            </button>
          </div>
        </div>
      );
    }

    // 7. Browser Notifications
    if (selectedOption === 'notifications') {
      const requestPermission = async () => {
        if (typeof Notification === 'undefined') return;
        try {
          const permission = await Notification.requestPermission();
          setNotificationPermission(permission);
          setNotificationLog((prev) => [`${new Date().toLocaleTimeString()} — Permission ${permission}`, ...prev]);
        } catch {
          setNotificationPermission('unsupported');
        }
      };

      const showNotification = () => {
        if (notificationPermission !== 'granted') return;
        // eslint-disable-next-line no-new
        new Notification('QA Test Notification', {
          body: 'This is a test notification for automation testing',
          icon: '/favicon.ico'
        });
        setNotificationLog((prev) => [
          `${new Date().toLocaleTimeString()} — Notification sent: "QA Test Notification"`,
          ...prev
        ]);
      };

      const permissionColor =
        notificationPermission === 'granted' ? '#22c55e' : notificationPermission === 'denied' ? '#ef4444' : '#f59e0b';

      return (
        <div className="content-section">
          <h2>Browser Notifications</h2>
          <p>Practice testing the browser Notification API — request permission, fire notifications, assert the log.</p>

          <div className={`notif-explainer${notifTipsOpen ? ' notif-explainer--open' : ''}`}>
            <button
              type="button"
              className="notif-explainer-toggle"
              onClick={() => setNotifTipsOpen((o) => !o)}
              aria-expanded={notifTipsOpen}
            >
              <span>Testing tips &amp; code snippets</span>
              <span className="notif-explainer-chevron">{notifTipsOpen ? '▲' : '▼'}</span>
            </button>

            {notifTipsOpen && (
              <div className="notif-explainer-body">
                <h3 className="notif-explainer-title">How the page works</h3>
                <ol className="notif-steps">
                  <li>
                    <strong>Page loads</strong> — badge shows current permission: <code>default</code> (not asked yet),{' '}
                    <code>granted</code>, or <code>denied</code>.
                  </li>
                  <li>
                    <strong>Request Permission</strong> — visible only when <code>default</code>. Triggers the
                    browser&apos;s native pop-up. Badge updates after the user responds.
                  </li>
                  <li>
                    <strong>Send Notification</strong> — visible only when <code>granted</code>. Fires a real OS desktop
                    notification and appends a log entry below.
                  </li>
                  <li>
                    <strong>Event log</strong> — records every action. Assert with{' '}
                    <code>{'data-testid="notification-log-entry-0"'}</code>.
                  </li>
                </ol>

                <h3 className="notif-explainer-title">The testing challenge</h3>
                <p className="notif-explainer-note">
                  You <strong>cannot click</strong> the browser&apos;s native permission pop-up with Playwright or
                  Cypress — it lives outside the page DOM. Each tool has its own way to bypass it (see below).
                </p>

                <h3 className="notif-explainer-title">Playwright snippets</h3>

                <div className="notif-code-block">
                  <div className="notif-code-label">Scenario 1 — pre-grant permission (skip the prompt)</div>
                  <pre className="notif-code">{`// Grant permission before navigating so the prompt never appears
const context = await browser.newContext({
  permissions: ['notifications'],
});
const page = await context.newPage();
await page.goto('/qa-practice/notifications');

// Badge should show 'granted' immediately
await expect(
  page.getByTestId('notification-permission')
).toHaveText('granted');

// 'Send Notification' button should be visible
await expect(page.getByTestId('show-notification-btn')).toBeVisible();

// Click it and assert the log entry
await page.getByTestId('show-notification-btn').click();
await expect(
  page.getByTestId('notification-log-entry-0')
).toContainText('Notification sent');`}</pre>
                </div>

                <div className="notif-code-block">
                  <div className="notif-code-label">Scenario 2 — deny permission, assert warning</div>
                  <pre className="notif-code">{`// No permissions granted → after requesting, browser sets 'denied'
const context = await browser.newContext({ permissions: [] });
const page = await context.newPage();
await page.goto('/qa-practice/notifications');

// Badge shows 'denied'
await expect(
  page.getByTestId('notification-permission')
).toHaveText('denied');

// Warning message is visible, Send button is gone
await expect(page.getByTestId('notification-denied')).toBeVisible();
await expect(page.getByTestId('show-notification-btn')).not.toBeVisible();`}</pre>
                </div>

                <div className="notif-code-block">
                  <div className="notif-code-label">Scenario 3 — default state, click Request Permission</div>
                  <pre className="notif-code">{`// Fresh context → permission is 'default'
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('/qa-practice/notifications');

await expect(
  page.getByTestId('notification-permission')
).toHaveText('default');

// Grant permission then click — badge updates
await context.grantPermissions(['notifications']);
await page.getByTestId('request-permission-btn').click();

await expect(
  page.getByTestId('notification-permission')
).toHaveText('granted');`}</pre>
                </div>

                <div className="notif-code-block">
                  <div className="notif-code-label">Scenario 4 — clear log</div>
                  <pre className="notif-code">{`await page.getByTestId('show-notification-btn').click();
await expect(page.getByTestId('notification-log-entry-0')).toBeVisible();

await page.getByTestId('clear-notification-log-btn').click();
await expect(page.getByTestId('notification-log-entry-0')).not.toBeVisible();`}</pre>
                </div>

                <div className="notif-divider" />
                <h3 className="notif-explainer-title">Cypress snippets</h3>
                <p className="notif-explainer-note">
                  Cypress uses <code>onBeforeLoad</code> to stub <code>window.Notification</code> before the page loads
                  — replacing the real browser API with a fake one you control.
                </p>

                <div className="notif-code-block">
                  <div className="notif-code-label">Scenario 1 — stub as granted, send notification</div>
                  <pre className="notif-code">{`cy.visit('/qa-practice/notifications', {
  onBeforeLoad(win) {
    Object.defineProperty(win.Notification, 'permission', {
      get: () => 'granted',
    });
    cy.stub(win, 'Notification').as('Notification');
  },
});

cy.getByTestId('notification-permission').should('have.text', 'granted');
cy.getByTestId('show-notification-btn').should('be.visible').click();

cy.get('@Notification').should('have.been.calledWith', 'QA Test Notification');
cy.getByTestId('notification-log-entry-0')
  .should('contain.text', 'Notification sent');`}</pre>
                </div>

                <div className="notif-code-block">
                  <div className="notif-code-label">Scenario 2 — stub as denied, assert warning</div>
                  <pre className="notif-code">{`cy.visit('/qa-practice/notifications', {
  onBeforeLoad(win) {
    Object.defineProperty(win.Notification, 'permission', {
      get: () => 'denied',
    });
  },
});

cy.getByTestId('notification-permission').should('have.text', 'denied');
cy.getByTestId('notification-denied').should('be.visible');
cy.getByTestId('show-notification-btn').should('not.exist');`}</pre>
                </div>

                <div className="notif-code-block">
                  <div className="notif-code-label">Scenario 3 — stub requestPermission, click Request button</div>
                  <pre className="notif-code">{`cy.visit('/qa-practice/notifications', {
  onBeforeLoad(win) {
    cy.stub(win.Notification, 'requestPermission').resolves('granted');
  },
});

cy.getByTestId('notification-permission').should('have.text', 'default');
cy.getByTestId('request-permission-btn').click();

cy.getByTestId('notification-permission').should('have.text', 'granted');
cy.getByTestId('notification-log-entry-0')
  .should('contain.text', 'Permission granted');`}</pre>
                </div>

                <div className="notif-code-block">
                  <div className="notif-code-label">Scenario 4 — clear log</div>
                  <pre className="notif-code">{`cy.getByTestId('notification-log-entry-0').should('exist');
cy.getByTestId('clear-notification-log-btn').click();
cy.getByTestId('notification-log-entry-0').should('not.exist');`}</pre>
                </div>

                <div className="notif-code-block">
                  <div className="notif-code-label">cypress/support/commands.js — custom getByTestId</div>
                  <pre className="notif-code">{`Cypress.Commands.add('getByTestId', (testId) =>
  cy.get(\`[data-testid="\${testId}"]\`)
);`}</pre>
                </div>
              </div>
            )}
          </div>

          <div className="notification-controls">
            <div className="notification-status" data-testid="notification-status">
              <span className="notif-label">Permission status:</span>
              <span
                className="notif-badge"
                data-testid="notification-permission"
                style={{ background: permissionColor }}
              >
                {notificationPermission}
              </span>
            </div>

            {notificationPermission === 'unsupported' && (
              <p className="notif-warning" data-testid="notification-unsupported">
                The Notification API is not supported or blocked in this browser/context.
              </p>
            )}

            {notificationPermission === 'default' && (
              <button
                type="button"
                className="notif-btn notif-btn--request"
                data-testid="request-permission-btn"
                onClick={requestPermission}
              >
                Request Permission
              </button>
            )}

            {notificationPermission === 'granted' && (
              <button
                type="button"
                className="notif-btn notif-btn--show"
                data-testid="show-notification-btn"
                onClick={showNotification}
              >
                Send Notification
              </button>
            )}

            {notificationPermission === 'denied' && (
              <p className="notif-warning" data-testid="notification-denied">
                Permission denied — reset it in your browser settings and refresh.
              </p>
            )}

            <div className="notif-log-section">
              <div className="notif-log-header">
                <h3>Event log</h3>
                {notificationLog.length > 0 && (
                  <button
                    type="button"
                    className="notif-clear-btn"
                    data-testid="clear-notification-log-btn"
                    onClick={() => setNotificationLog([])}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="notif-log" data-testid="notification-log">
                {notificationLog.length === 0 ? (
                  <span className="notif-log-empty">No events yet.</span>
                ) : (
                  <ul className="notif-log-list">
                    {notificationLog.map((entry, i) => (
                      <li key={i} data-testid={`notification-log-entry-${i}`} className="notif-log-entry">
                        {entry}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 8. Keyboard Navigation
    if (selectedOption === 'keyboard-nav') {
      const handleKeyDown = (e) => {
        const log = `${e.key} (${e.code})`;
        setKeyboardLog((prev) => [log, ...prev.slice(0, 9)]);

        // Check for shortcuts
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
          setShortcutPressed('Ctrl+S - Save');
        } else if (e.ctrlKey && e.key === 'c') {
          setShortcutPressed('Ctrl+C - Copy');
        } else if (e.ctrlKey && e.key === 'v') {
          setShortcutPressed('Ctrl+V - Paste');
        }
      };

      return (
        <div className="content-section" onKeyDown={handleKeyDown} tabIndex={0}>
          <h2>Keyboard Navigation</h2>
          <p>Practice testing keyboard shortcuts and navigation</p>
          <div className="keyboard-demo">
            <p>Focus this section and press any key. Try Ctrl+S, Ctrl+C, Ctrl+V</p>
            {shortcutPressed && <div className="shortcut-indicator">{shortcutPressed}</div>}
            <div className="keyboard-log">
              <h3>Key Log:</h3>
              {keyboardLog.map((key, index) => (
                <div key={index} className="log-item">
                  {key}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // 9. Auto-complete
    if (selectedOption === 'autocomplete') {
      const suggestions = [
        // Languages
        'JavaScript',
        'Java',
        'Python',
        'Ruby',
        'PHP',
        'C++',
        'C#',
        'C',
        'Go',
        'Rust',
        'Swift',
        'Kotlin',
        'TypeScript',
        'Scala',
        'Elixir',
        'Haskell',
        'Lua',
        'Perl',
        'R',
        'Dart',
        'Clojure',
        'F#',
        'Julia',
        'COBOL',
        'Fortran',
        'Assembly',
        'Bash',
        'PowerShell',
        'Groovy',
        'Erlang',
        'Nim',
        'Zig',
        'Crystal',
        'Solidity',
        // Frontend frameworks & libraries
        'React',
        'Angular',
        'Vue',
        'Svelte',
        'Next.js',
        'Nuxt.js',
        'Remix',
        'Astro',
        'Ember.js',
        'Backbone.js',
        'Alpine.js',
        'Lit',
        'Preact',
        'Solid.js',
        'Qwik',
        // Backend frameworks
        'Node.js',
        'Express.js',
        'Django',
        'Flask',
        'FastAPI',
        'Spring Boot',
        'Laravel',
        'Ruby on Rails',
        'NestJS',
        'Hapi.js',
        'Koa.js',
        'Fiber',
        'Gin',
        'Phoenix',
        'Actix',
        'ASP.NET',
        // Databases
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'Redis',
        'SQLite',
        'Cassandra',
        'DynamoDB',
        'Elasticsearch',
        'MariaDB',
        'CockroachDB',
        'Neo4j',
        'InfluxDB',
        'Supabase',
        'PlanetScale',
        // Testing tools
        'Jest',
        'Cypress',
        'Playwright',
        'Selenium',
        'Mocha',
        'Chai',
        'Jasmine',
        'Vitest',
        'Puppeteer',
        'TestCafe',
        'Karma',
        'AVA',
        // DevOps & cloud
        'Docker',
        'Kubernetes',
        'Terraform',
        'Ansible',
        'Jenkins',
        'GitHub Actions',
        'GitLab CI',
        'CircleCI',
        'AWS',
        'Azure',
        'Google Cloud',
        'Heroku',
        'Vercel',
        'Netlify',
        'Cloudflare',
        // Tools & misc
        'GraphQL',
        'REST',
        'WebSockets',
        'gRPC',
        'Webpack',
        'Vite',
        'Rollup',
        'Parcel',
        'Babel',
        'ESLint',
        'Prettier',
        'Git',
        'Linux',
        'Nginx',
        'Apache',
        'RabbitMQ',
        'Kafka',
        'Prometheus',
        'Grafana'
      ];

      const handleAutocompleteChange = (value) => {
        setAutocompleteQuery(value);
        if (value) {
          const filtered = suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()));
          setAutocompleteSuggestions(filtered);
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      };

      return (
        <div className="content-section">
          <h2>Auto-complete/Type-ahead</h2>
          <p>Practice testing auto-complete functionality</p>
          <div className="autocomplete-container">
            <input
              type="text"
              value={autocompleteQuery}
              onChange={(e) => handleAutocompleteChange(e.target.value)}
              onFocus={() => autocompleteQuery && setShowSuggestions(true)}
              placeholder="Type a programming language..."
            />
            {showSuggestions && autocompleteSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {autocompleteSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setAutocompleteQuery(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    }

    // 10. Multi-select
    if (selectedOption === 'multi-select') {
      const toggleOption = (option) => {
        if (selectedMultiOptions.includes(option)) {
          setSelectedMultiOptions(selectedMultiOptions.filter((o) => o !== option));
        } else {
          setSelectedMultiOptions([...selectedMultiOptions, option]);
        }
      };

      return (
        <div className="content-section">
          <h2>Multi-select</h2>
          <p>Practice testing multiple selection scenarios</p>
          <div className="multi-select-container">
            <div className="options-list">
              {multiSelectOptions.map((option) => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedMultiOptions.includes(option)}
                    onChange={() => toggleOption(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
            <div className="selected-items">
              <h3>Selected Items:</h3>
              {selectedMultiOptions.length === 0 ? (
                <p>No items selected</p>
              ) : (
                <ul>
                  {selectedMultiOptions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 11. Date/Time Picker
    if (selectedOption === 'date-time-picker') {
      return (
        <div className="content-section">
          <h2>Date/Time Picker</h2>
          <p>Practice testing date and time inputs</p>
          <div className="datetime-picker">
            <div className={`picker-group picker-group--date${dateCalendarOpen ? ' picker-group--open' : ''}`}>
              <label>Date:</label>
              <div className="custom-datetime-picker" data-testid="date-picker">
                <button
                  type="button"
                  className="dt-display-btn"
                  data-testid="date-display-btn"
                  onClick={() => {
                    setDateCalendarOpen((o) => !o);
                    setTimePickerOpen(false);
                    setCalendarOpen(false);
                  }}
                >
                  {selectedDate.year && selectedDate.month && selectedDate.day
                    ? `${selectedDate.month}/${selectedDate.day}/${selectedDate.year}`
                    : 'Select date...'}
                  <span className="dt-calendar-icon">📅</span>
                </button>
                {dateCalendarOpen && (
                  <div className="calendar-popup" data-testid="date-calendar-popup">
                    <div className="calendar-header">
                      <button
                        type="button"
                        className="cal-nav-btn"
                        data-testid="date-prev-month"
                        onClick={() => {
                          if (dateViewMonth === 1) {
                            setDateViewMonth(12);
                            setDateViewYear((y) => y - 1);
                          } else {
                            setDateViewMonth((m) => m - 1);
                          }
                        }}
                      >
                        ‹
                      </button>
                      <span className="cal-month-year" data-testid="date-month-year-label">
                        {months.find((m) => m.value === dateViewMonth)?.label} {dateViewYear}
                      </span>
                      <button
                        type="button"
                        className="cal-nav-btn"
                        data-testid="date-next-month"
                        onClick={() => {
                          if (dateViewMonth === 12) {
                            setDateViewMonth(1);
                            setDateViewYear((y) => y + 1);
                          } else {
                            setDateViewMonth((m) => m + 1);
                          }
                        }}
                      >
                        ›
                      </button>
                    </div>
                    <div className="calendar-weekdays">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                        <span key={d} className="weekday-label">
                          {d}
                        </span>
                      ))}
                    </div>
                    <div className="calendar-grid" data-testid="date-calendar-grid">
                      {(() => {
                        const firstDay = new Date(dateViewYear, dateViewMonth - 1, 1).getDay();
                        const daysInMonth = new Date(dateViewYear, dateViewMonth, 0).getDate();
                        const cells = [];
                        for (let i = 0; i < firstDay; i++) {
                          cells.push(<span key={`empty-${i}`} className="cal-empty" />);
                        }
                        for (let d = 1; d <= daysInMonth; d++) {
                          const isSelected =
                            Number(selectedDate.day) === d &&
                            Number(selectedDate.month) === dateViewMonth &&
                            Number(selectedDate.year) === dateViewYear;
                          cells.push(
                            <button
                              key={d}
                              type="button"
                              className={`cal-day${isSelected ? ' selected' : ''}`}
                              data-testid={`date-day-${d}`}
                              onClick={() => {
                                setSelectedDate({
                                  day: String(d),
                                  month: String(dateViewMonth),
                                  year: String(dateViewYear)
                                });
                                setDateCalendarOpen(false);
                              }}
                            >
                              {d}
                            </button>
                          );
                        }
                        return cells;
                      })()}
                    </div>
                    <div className="calendar-footer">
                      <button
                        type="button"
                        className="cal-done-btn"
                        data-testid="date-done-btn"
                        onClick={() => setDateCalendarOpen(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {selectedDate.month && selectedDate.day && selectedDate.year && (
                <p data-testid="selected-date-display">
                  Selected Date: {selectedDate.month}/{selectedDate.day}/{selectedDate.year}
                </p>
              )}
            </div>
            <div className={`picker-group picker-group--time${timePickerOpen ? ' picker-group--open' : ''}`}>
              <label>Time:</label>
              <div className="custom-datetime-picker" data-testid="time-picker">
                <button
                  type="button"
                  className="dt-display-btn"
                  data-testid="time-display-btn"
                  onClick={() => {
                    setTimePickerOpen((o) => !o);
                    setDateCalendarOpen(false);
                    setCalendarOpen(false);
                  }}
                >
                  {selectedTime.hour !== '' && selectedTime.minute !== ''
                    ? `${selectedTime.hour}:${selectedTime.minute}`
                    : 'Select time...'}
                  <span className="dt-calendar-icon">🕐</span>
                </button>
                {timePickerOpen && (
                  <div className="calendar-popup time-only-popup" data-testid="time-picker-popup">
                    <div className="time-picker-grid" data-testid="time-picker-grid">
                      <div className="time-column" data-testid="time-hours-column">
                        <span className="time-column-label">Hour</span>
                        <div className="time-scroll" data-testid="time-hours-scroll">
                          {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map((h) => (
                            <button
                              key={h}
                              type="button"
                              className={`time-cell${selectedTime.hour === h ? ' selected' : ''}`}
                              data-testid={`time-hour-${h}`}
                              onClick={() => setSelectedTime((prev) => ({ ...prev, hour: h }))}
                            >
                              {h}
                            </button>
                          ))}
                        </div>
                      </div>
                      <span className="time-col-colon">:</span>
                      <div className="time-column" data-testid="time-minutes-column">
                        <span className="time-column-label">Min</span>
                        <div className="time-scroll" data-testid="time-minutes-scroll">
                          {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((m) => (
                            <button
                              key={m}
                              type="button"
                              className={`time-cell${selectedTime.minute === m ? ' selected' : ''}`}
                              data-testid={`time-minute-${m}`}
                              onClick={() => setSelectedTime((prev) => ({ ...prev, minute: m }))}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="calendar-footer">
                      <button
                        type="button"
                        className="cal-done-btn"
                        data-testid="time-done-btn"
                        onClick={() => setTimePickerOpen(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {selectedTime.hour !== '' && selectedTime.minute !== '' && (
                <p data-testid="selected-time-display">
                  Selected Time: {selectedTime.hour}:{selectedTime.minute}
                </p>
              )}
            </div>
            <div className={`picker-group picker-group--datetime${calendarOpen ? ' picker-group--open' : ''}`}>
              <label>DateTime Local:</label>
              <div className="custom-datetime-picker" data-testid="datetime-local-picker">
                <button
                  type="button"
                  className="dt-display-btn"
                  data-testid="dt-display-btn"
                  onClick={() => {
                    setCalendarOpen((o) => !o);
                    setDateCalendarOpen(false);
                    setTimePickerOpen(false);
                  }}
                >
                  {selectedDateTime.year && selectedDateTime.month && selectedDateTime.day
                    ? `${selectedDateTime.month}/${selectedDateTime.day}/${selectedDateTime.year} ${
                        selectedDateTime.hour || '00'
                      }:${selectedDateTime.minute || '00'}`
                    : 'Select date & time...'}
                  <span className="dt-calendar-icon">📆</span>
                </button>
                {calendarOpen && (
                  <div className="calendar-popup" data-testid="calendar-popup">
                    <div className="calendar-header">
                      <button
                        type="button"
                        className="cal-nav-btn"
                        data-testid="dt-prev-month"
                        onClick={() => {
                          if (calendarViewMonth === 1) {
                            setCalendarViewMonth(12);
                            setCalendarViewYear((y) => y - 1);
                          } else {
                            setCalendarViewMonth((m) => m - 1);
                          }
                        }}
                      >
                        ‹
                      </button>
                      <span className="cal-month-year" data-testid="dt-month-year-label">
                        {months.find((m) => m.value === calendarViewMonth)?.label} {calendarViewYear}
                      </span>
                      <button
                        type="button"
                        className="cal-nav-btn"
                        data-testid="dt-next-month"
                        onClick={() => {
                          if (calendarViewMonth === 12) {
                            setCalendarViewMonth(1);
                            setCalendarViewYear((y) => y + 1);
                          } else {
                            setCalendarViewMonth((m) => m + 1);
                          }
                        }}
                      >
                        ›
                      </button>
                    </div>
                    <div className="calendar-weekdays">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                        <span key={d} className="weekday-label">
                          {d}
                        </span>
                      ))}
                    </div>
                    <div className="calendar-grid" data-testid="calendar-grid">
                      {(() => {
                        const firstDay = new Date(calendarViewYear, calendarViewMonth - 1, 1).getDay();
                        const daysInMonth = new Date(calendarViewYear, calendarViewMonth, 0).getDate();
                        const cells = [];
                        for (let i = 0; i < firstDay; i++) {
                          cells.push(<span key={`empty-${i}`} className="cal-empty" />);
                        }
                        for (let d = 1; d <= daysInMonth; d++) {
                          const isSelected =
                            Number(selectedDateTime.day) === d &&
                            Number(selectedDateTime.month) === calendarViewMonth &&
                            Number(selectedDateTime.year) === calendarViewYear;
                          cells.push(
                            <button
                              key={d}
                              type="button"
                              className={`cal-day${isSelected ? ' selected' : ''}`}
                              data-testid={`dt-day-${d}`}
                              onClick={() =>
                                setSelectedDateTime((prev) => ({
                                  ...prev,
                                  day: String(d),
                                  month: String(calendarViewMonth),
                                  year: String(calendarViewYear)
                                }))
                              }
                            >
                              {d}
                            </button>
                          );
                        }
                        return cells;
                      })()}
                    </div>
                    <div className="calendar-time" data-testid="calendar-time">
                      <span className="time-label">Time:</span>
                      <input
                        id="dt-hour-input"
                        name="dt-hour"
                        type="number"
                        min="0"
                        max="23"
                        placeholder="HH"
                        data-testid="dt-hour-input"
                        className="time-input"
                        value={selectedDateTime.hour}
                        onChange={(e) =>
                          setSelectedDateTime((prev) => ({
                            ...prev,
                            hour: String(e.target.value).padStart(2, '0')
                          }))
                        }
                      />
                      <span className="time-colon">:</span>
                      <input
                        id="dt-minute-input"
                        name="dt-minute"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="MM"
                        data-testid="dt-minute-input"
                        className="time-input"
                        value={selectedDateTime.minute}
                        onChange={(e) =>
                          setSelectedDateTime((prev) => ({
                            ...prev,
                            minute: String(e.target.value).padStart(2, '0')
                          }))
                        }
                      />
                    </div>
                    <div className="calendar-footer">
                      <button
                        type="button"
                        className="cal-done-btn"
                        data-testid="dt-done-btn"
                        onClick={() => setCalendarOpen(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {selectedDateTime.month &&
                selectedDateTime.day &&
                selectedDateTime.year &&
                selectedDateTime.hour &&
                selectedDateTime.minute && (
                  <p data-testid="selected-datetime-display">
                    Selected DateTime: {selectedDateTime.month}/{selectedDateTime.day}/{selectedDateTime.year}{' '}
                    {selectedDateTime.hour}:{selectedDateTime.minute}
                  </p>
                )}
            </div>
          </div>
        </div>
      );
    }

    // 12. Dark Mode
    if (selectedOption === 'dark-mode') {
      return (
        <div className={`content-section ${isDarkMode ? 'dark-mode' : ''}`}>
          <h2>Dark Mode Toggle</h2>
          <p>Practice testing theme switching</p>
          <div className="theme-controls">
            <button type="button" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
            </button>
            <div className="theme-demo">
              <h3>Sample Content</h3>
              <p>This content changes based on the theme.</p>
              <button type="button">Sample Button</button>
            </div>
          </div>
        </div>
      );
    }

    // 13. Nested Dropdowns
    if (selectedOption === 'nested-dropdowns') {
      const countries = {
        USA: {
          states: {
            California: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
            Texas: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
            'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
            Florida: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
            Illinois: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford']
          }
        },
        Canada: {
          states: {
            Ontario: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'],
            Quebec: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil'],
            'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond'],
            Alberta: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Fort McMurray']
          }
        },
        'United Kingdom': {
          states: {
            England: ['London', 'Birmingham', 'Manchester', 'Liverpool', 'Leeds'],
            Scotland: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness'],
            Wales: ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry'],
            'Northern Ireland': ['Belfast', 'Derry', 'Lisburn', 'Newry', 'Armagh']
          }
        },
        Australia: {
          states: {
            'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Maitland'],
            Victoria: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Frankston'],
            Queensland: ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns'],
            'Western Australia': ['Perth', 'Fremantle', 'Mandurah', 'Bunbury', 'Albany']
          }
        },
        Germany: {
          states: {
            Bavaria: ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg', 'Ingolstadt'],
            'North Rhine-Westphalia': ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg'],
            'Baden-Württemberg': ['Stuttgart', 'Mannheim', 'Karlsruhe', 'Freiburg', 'Heidelberg'],
            Berlin: ['Berlin Mitte', 'Charlottenburg', 'Kreuzberg', 'Prenzlauer Berg', 'Neukölln']
          }
        },
        Japan: {
          states: {
            Tokyo: ['Shinjuku', 'Shibuya', 'Minato', 'Chiyoda', 'Setagaya'],
            Osaka: ['Osaka City', 'Sakai', 'Higashiosaka', 'Toyonaka', 'Suita'],
            Kyoto: ['Kyoto City', 'Uji', 'Kameoka', 'Joyo', 'Nagaokakyo'],
            Hokkaido: ['Sapporo', 'Asahikawa', 'Hakodate', 'Kushiro', 'Obihiro']
          }
        }
      };

      const states = selectedCountry ? Object.keys(countries[selectedCountry]?.states || {}) : [];
      const cities = selectedCountry && selectedState ? countries[selectedCountry]?.states[selectedState] || [] : [];

      return (
        <div className="content-section">
          <h2>Nested Dropdowns</h2>
          <p>Practice testing cascading select boxes</p>
          <div className="nested-dropdowns">
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedState('');
                setSelectedCity('');
              }}
            >
              <option value="">Select Country</option>
              {Object.keys(countries).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity('');
              }}
              disabled={!selectedCountry}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState}>
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {selectedCity && (
              <p className="selection-result">
                Selected: {selectedCity}, {selectedState}, {selectedCountry}
              </p>
            )}
          </div>
        </div>
      );
    }

    // 14. Error Boundaries
    if (selectedOption === 'error-boundary') {
      const ThrowError = () => {
        if (shouldThrowError) {
          throw new Error('This is a test error!');
        }
        return (
          <p className="eb-idle-msg" data-testid="error-boundary-idle">
            The component is healthy. Click &ldquo;Throw Error&rdquo; to crash it.
          </p>
        );
      };

      const fallback = (
        <div className="eb-fallback" data-testid="error-boundary-fallback">
          <span className="eb-fallback-icon">⚠️</span>
          <p className="eb-fallback-msg">Something went wrong inside this component.</p>
          <button
            type="button"
            className="eb-reset-btn"
            data-testid="error-boundary-reset-btn"
            onClick={() => setShouldThrowError(false)}
          >
            Reset component
          </button>
        </div>
      );

      return (
        <div className="content-section">
          <h2>Error Boundary</h2>
          <p>
            Trigger a React error inside a child component and assert the fallback UI. The <code>ErrorBoundary</code>{' '}
            catches the throw and renders a recovery screen.
          </p>

          <div className="eb-demo" data-testid="error-boundary-demo">
            <div className="eb-controls">
              <button
                type="button"
                className={`eb-trigger-btn${shouldThrowError ? ' eb-trigger-btn--reset' : ''}`}
                data-testid="error-boundary-trigger-btn"
                onClick={() => setShouldThrowError((v) => !v)}
              >
                {shouldThrowError ? 'Reset' : 'Throw Error'}
              </button>
              <span className="eb-status" data-testid="error-boundary-status" data-errored={shouldThrowError}>
                {shouldThrowError ? '💥 Error thrown' : '✓ Healthy'}
              </span>
            </div>

            <div className="eb-component" data-testid="error-boundary-component">
              <ErrorBoundary key={shouldThrowError ? 'error' : 'ok'} fallback={fallback}>
                <ThrowError />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      );
    }

    // 15. Disabled/Readonly States
    if (selectedOption === 'disabled-readonly') {
      return (
        <div className="content-section">
          <h2>Disabled / Read-only States</h2>
          <p>Toggle the state of inputs and buttons — then assert they cannot be edited or clicked.</p>

          <div className="state-controls">
            <button
              type="button"
              className={`state-toggle-btn${isInputDisabled ? ' state-toggle-btn--active' : ''}`}
              data-testid="toggle-disabled-btn"
              onClick={() => setIsInputDisabled((v) => !v)}
            >
              {isInputDisabled ? 'Enable inputs' : 'Disable inputs'}
            </button>
            <button
              type="button"
              className={`state-toggle-btn${isInputReadonly ? ' state-toggle-btn--active' : ''}`}
              data-testid="toggle-readonly-btn"
              onClick={() => setIsInputReadonly((v) => !v)}
            >
              {isInputReadonly ? 'Remove readonly' : 'Make readonly'}
            </button>
          </div>

          <div className="state-examples">
            <div className="state-row">
              <label className="state-label" htmlFor="disabled-input">
                Disabled input
              </label>
              <input
                id="disabled-input"
                type="text"
                className="state-input"
                data-testid="disabled-input"
                disabled={isInputDisabled}
                defaultValue="Cannot be edited when disabled"
              />
              <span className="state-badge" data-testid="disabled-badge">
                {isInputDisabled ? 'disabled' : 'enabled'}
              </span>
            </div>

            <div className="state-row">
              <label className="state-label" htmlFor="readonly-input">
                Read-only input
              </label>
              <input
                id="readonly-input"
                type="text"
                className="state-input"
                data-testid="readonly-input"
                readOnly={isInputReadonly}
                defaultValue="Cannot be edited when readonly"
              />
              <span className="state-badge" data-testid="readonly-badge">
                {isInputReadonly ? 'readonly' : 'editable'}
              </span>
            </div>

            <div className="state-row">
              <label className="state-label">Disabled button</label>
              <button
                type="button"
                className="state-action-btn"
                data-testid="disabled-action-btn"
                disabled={isInputDisabled}
              >
                Click me
              </button>
              <span className="state-badge" data-testid="btn-disabled-badge">
                {isInputDisabled ? 'disabled' : 'enabled'}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // 16. Progress Indicators
    if (selectedOption === 'progress') {
      return (
        <div className="content-section">
          <h2>Progress Indicators</h2>
          <p>Practice testing progress bars and step indicators</p>
          <div className="progress-section">
            <h3>Progress Bar</h3>
            <progress data-testid="progress-bar" value={progressValue} max="100" />
            <p data-testid="progress-value">{progressValue}%</p>
            <div className="progress-btn-row">
              <button
                type="button"
                className="progress-ctrl-btn"
                data-testid="progress-increment-btn"
                onClick={() => setProgressValue(Math.min(100, progressValue + 10))}
              >
                +10%
              </button>
              <button
                type="button"
                className="progress-ctrl-btn"
                data-testid="progress-decrement-btn"
                onClick={() => setProgressValue(Math.max(0, progressValue - 10))}
              >
                -10%
              </button>
              <button
                type="button"
                className="progress-ctrl-btn progress-ctrl-btn--reset"
                data-testid="progress-reset-btn"
                onClick={() => setProgressValue(0)}
              >
                Reset
              </button>
            </div>
          </div>
          <div className="progress-section">
            <h3>Step Indicator</h3>
            <div className="steps" data-testid="steps-container">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  data-testid={`step-${step}`}
                  className={`step${stepProgress >= step ? ' completed' : ''}`}
                  data-completed={stepProgress >= step}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="progress-btn-row">
              <button
                type="button"
                className="progress-ctrl-btn"
                data-testid="step-next-btn"
                onClick={() => setStepProgress(Math.min(4, stepProgress + 1))}
              >
                Next Step
              </button>
              <button
                type="button"
                className="progress-ctrl-btn"
                data-testid="step-prev-btn"
                onClick={() => setStepProgress(Math.max(1, stepProgress - 1))}
              >
                Previous Step
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 17. Virtual Scroll
    if (selectedOption === 'virtual-scroll') {
      const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        const itemHeight = 50;
        const start = Math.floor(scrollTop / itemHeight);
        const end = start + 50;
        setVisibleRange({ start, end });
      };

      return (
        <div className="content-section">
          <h2>Virtual Scroll</h2>
          <p>Practice testing large lists with virtual scrolling</p>
          <div className="virtual-scroll-container" data-testid="virtual-scroll-container" onScroll={handleScroll}>
            <div className="virtual-scroll-inner" style={{ height: `${virtualItems.length * 50}px` }}>
              {virtualItems.slice(visibleRange.start, visibleRange.end).map((item, index) => (
                <div
                  key={index}
                  className="virtual-row"
                  data-testid="virtual-row"
                  style={{ top: `${(visibleRange.start + index) * 50}px` }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <p data-testid="virtual-scroll-info">
            Showing items {visibleRange.start + 1} to {visibleRange.end} of {virtualItems.length}
          </p>
        </div>
      );
    }

    // 18. WebSocket
    if (selectedOption === 'websocket') {
      const connectWebSocket = () => {
        setWsStatus('connecting');
        // Simulating WebSocket connection
        setTimeout(() => {
          setWsStatus('connected');
          setWsMessages([{ type: 'system', text: 'Connected to WebSocket' }]);
        }, 1000);
      };

      const sendMessage = () => {
        if (wsStatus === 'connected' && wsMessage) {
          setWsMessages([...wsMessages, { type: 'sent', text: wsMessage }]);
          // Simulate receiving a response
          setTimeout(() => {
            setWsMessages((prev) => [...prev, { type: 'received', text: `Echo: ${wsMessage}` }]);
          }, 500);
          setWsMessage('');
        }
      };

      const disconnect = () => {
        setWsStatus('disconnected');
        setWsMessages([...wsMessages, { type: 'system', text: 'Disconnected from WebSocket' }]);
      };

      return (
        <div className="content-section">
          <h2>WebSocket/Real-time</h2>
          <p>Practice testing WebSocket connections (simulated)</p>
          <div className="websocket-controls">
            <p>
              Status:{' '}
              <strong data-testid="ws-status" data-status={wsStatus}>
                {wsStatus}
              </strong>
            </p>
            {wsStatus === 'disconnected' && (
              <button
                type="button"
                className="ws-btn ws-btn--connect"
                data-testid="ws-connect-btn"
                onClick={connectWebSocket}
              >
                Connect
              </button>
            )}
            {wsStatus === 'connecting' && <p data-testid="ws-connecting-msg">Connecting...</p>}
            {wsStatus === 'connected' && (
              <>
                <button
                  type="button"
                  className="ws-btn ws-btn--disconnect"
                  data-testid="ws-disconnect-btn"
                  onClick={disconnect}
                >
                  Disconnect
                </button>
                <div className="message-input">
                  <input
                    type="text"
                    className="ws-msg-input"
                    data-testid="ws-message-input"
                    value={wsMessage}
                    onChange={(e) => setWsMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                  />
                  <button type="button" className="ws-btn ws-btn--send" data-testid="ws-send-btn" onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="websocket-messages" data-testid="ws-messages">
            {wsMessages.map((msg, index) => (
              <div key={index} className={`ws-message ws-message--${msg.type}`} data-testid={`ws-msg-${msg.type}`}>
                {msg.text}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 19. Credit Card Payment
    if (selectedOption === 'credit-card') {
      const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(.{4})/g, '$1 ').trim();
      };

      const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return digits;
      };

      const getCardType = (number) => {
        const d = number.replace(/\s/g, '');
        if (/^4/.test(d)) return 'Visa';
        if (/^5[1-5]/.test(d)) return 'Mastercard';
        if (/^3[47]/.test(d)) return 'Amex';
        return '';
      };

      const handleCardInput = (e) => {
        const { name, value } = e.target;
        let formatted = value;
        if (name === 'cardNumber') formatted = formatCardNumber(value);
        if (name === 'expiry') formatted = formatExpiry(value);
        if (name === 'cvv') formatted = value.replace(/\D/g, '').slice(0, 4);
        if (name === 'zip') formatted = value.replace(/\D/g, '').slice(0, 10);
        setCardForm((prev) => ({ ...prev, [name]: formatted }));
        setCardErrors((prev) => ({ ...prev, [name]: '' }));
      };

      const validateCard = () => {
        const errs = {};
        const raw = cardForm.cardNumber.replace(/\s/g, '');
        if (!raw) errs.cardNumber = 'Card number is required.';
        else if (raw.length < 13) errs.cardNumber = 'Card number must be at least 13 digits.';
        if (!cardForm.expiry) {
          errs.expiry = 'Expiry date is required.';
        } else {
          const [mm, yy] = cardForm.expiry.split('/');
          const now = new Date();
          const expYear = 2000 + parseInt(yy || '0', 10);
          const expMonth = parseInt(mm || '0', 10);
          if (expMonth < 1 || expMonth > 12) errs.expiry = 'Invalid month.';
          else if (expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < now.getMonth() + 1))
            errs.expiry = 'Card has expired.';
        }
        if (!cardForm.cvv) errs.cvv = 'CVV is required.';
        else if (cardForm.cvv.length < 3) errs.cvv = 'CVV must be 3–4 digits.';
        if (!cardForm.cardholderName.trim()) errs.cardholderName = 'Cardholder name is required.';
        if (!cardForm.zip) errs.zip = 'ZIP / postal code is required.';
        return errs;
      };

      const submitPayment = (e) => {
        e.preventDefault();
        const errs = validateCard();
        if (Object.keys(errs).length > 0) {
          setCardErrors(errs);
          return;
        }
        const raw = cardForm.cardNumber.replace(/\s/g, '');
        const last4 = raw.slice(-4);
        const cardTypeName = getCardType(cardForm.cardNumber);
        const now = new Date();
        setPaymentStep('redirecting');
        setTimeout(() => setPaymentStep('processing'), 1200);
        setTimeout(() => {
          if (raw === '4000000000000002') {
            setTransactionData({ outcome: 'declined', reason: 'Your card was declined by the issuing bank.' });
          } else if (raw === '4000000000000069') {
            setTransactionData({ outcome: 'expired', reason: 'The card expiry date does not match our records.' });
          } else {
            setTransactionData({
              outcome: 'success',
              transactionId: 'TXN-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
              orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
              amount: '$49.99',
              currency: 'USD',
              cardType: cardTypeName || 'Card',
              last4,
              cardholderName: cardForm.cardholderName,
              date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
              time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              billingZip: cardForm.zip,
              status: 'Approved'
            });
          }
          setPaymentStep('result');
        }, 3200);
      };

      const resetCard = () => {
        setCardForm({ cardNumber: '', expiry: '', cvv: '', cardholderName: '', zip: '' });
        setCardErrors({});
        setPaymentStep('form');
        setTransactionData(null);
        setCvvVisible(false);
      };

      const cardType = getCardType(cardForm.cardNumber);

      // ── Step: redirecting ──────────────────────────────────────────────────
      if (paymentStep === 'redirecting') {
        return (
          <div className="payment-page payment-page--redirecting" data-testid="payment-redirecting">
            <div className="payment-page-inner">
              <div className="payment-brand">🔒 Secure Payment Gateway</div>
              <div className="payment-page-spinner" />
              <p className="payment-page-msg" data-testid="redirecting-message">
                Redirecting to secure payment processor…
              </p>
              <p className="payment-page-sub">Please do not close this window.</p>
            </div>
          </div>
        );
      }

      // ── Step: processing ──────────────────────────────────────────────────
      if (paymentStep === 'processing') {
        return (
          <div className="payment-page payment-page--processing" data-testid="payment-processing-page">
            <div className="payment-page-inner">
              <div className="payment-brand">🔒 Secure Payment Gateway</div>
              <div className="payment-page-spinner payment-page-spinner--green" />
              <p className="payment-page-msg" data-testid="processing-message">
                Processing your payment…
              </p>
              <div className="processing-steps">
                <div className="processing-step processing-step--done" data-testid="step-validating">
                  ✓ Validating card details
                </div>
                <div className="processing-step processing-step--active" data-testid="step-authorising">
                  <span className="step-dot" /> Authorising with bank
                </div>
                <div className="processing-step processing-step--pending" data-testid="step-confirming">
                  Confirming transaction
                </div>
              </div>
            </div>
          </div>
        );
      }

      // ── Step: result ──────────────────────────────────────────────────────
      if (paymentStep === 'result' && transactionData) {
        if (transactionData.outcome !== 'success') {
          return (
            <div className="payment-page payment-page--result" data-testid="payment-result-page">
              <div className="payment-result payment-result--failed">
                <div className="payment-result-icon" data-testid="result-icon">
                  ❌
                </div>
                <h2 className="payment-result-title" data-testid="result-title">
                  Payment {transactionData.outcome === 'expired' ? 'Failed' : 'Declined'}
                </h2>
                <p className="payment-result-reason" data-testid="result-reason">
                  {transactionData.reason}
                </p>
                <div className="payment-result-actions">
                  <button className="cc-pay-btn" onClick={resetCard} data-testid="try-again-button">
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="payment-page payment-page--result" data-testid="payment-result-page">
            <div className="payment-result payment-result--success">
              <div className="payment-result-icon" data-testid="result-icon">
                ✅
              </div>
              <h2 className="payment-result-title" data-testid="result-title">
                Payment Successful
              </h2>
              <p className="payment-result-subtitle">
                Thank you, {transactionData.cardholderName}. Your order is confirmed.
              </p>

              <div className="receipt" data-testid="receipt">
                <div className="receipt-header">
                  <span className="receipt-label">Receipt</span>
                  <span className="receipt-status" data-testid="receipt-status">
                    {transactionData.status}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Transaction ID</span>
                  <span className="receipt-val" data-testid="transaction-id">
                    {transactionData.transactionId}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Order ID</span>
                  <span className="receipt-val" data-testid="order-id">
                    {transactionData.orderId}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Amount Charged</span>
                  <span className="receipt-val receipt-val--amount" data-testid="amount">
                    {transactionData.amount} {transactionData.currency}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Payment Method</span>
                  <span className="receipt-val" data-testid="payment-method">
                    {transactionData.cardType} ending in {transactionData.last4}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Cardholder</span>
                  <span className="receipt-val" data-testid="receipt-cardholder">
                    {transactionData.cardholderName}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Billing ZIP</span>
                  <span className="receipt-val" data-testid="receipt-zip">
                    {transactionData.billingZip}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Date</span>
                  <span className="receipt-val" data-testid="receipt-date">
                    {transactionData.date}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-key">Time</span>
                  <span className="receipt-val" data-testid="receipt-time">
                    {transactionData.time}
                  </span>
                </div>
              </div>

              <div className="payment-result-actions">
                <button className="cc-pay-btn" onClick={resetCard} data-testid="pay-again-button">
                  Make Another Payment
                </button>
              </div>
            </div>
          </div>
        );
      }

      // ── Step: form (default) ──────────────────────────────────────────────
      return (
        <div className="content-section">
          <h2>Credit Card Payment</h2>
          <p className="section-description">
            Practice automating a realistic payment flow — fill the form, click Pay Now, and watch it redirect through a
            processing page to a receipt. Test cards: <code>4111 1111 1111 1111</code> (success),{' '}
            <code>4000 0000 0000 0002</code> (declined), <code>4000 0000 0000 0069</code> (expired).
          </p>

          <div className="credit-card-layout">
            <div className="card-preview" data-testid="card-preview">
              <div className="card-chip" />
              <div className="card-number-display" data-testid="card-number-display">
                {cardForm.cardNumber || '•••• •••• •••• ••••'}
              </div>
              <div className="card-meta">
                <div>
                  <div className="card-meta-label">Cardholder</div>
                  <div className="card-meta-value" data-testid="card-name-display">
                    {cardForm.cardholderName || 'YOUR NAME'}
                  </div>
                </div>
                <div>
                  <div className="card-meta-label">Expires</div>
                  <div className="card-meta-value" data-testid="card-expiry-display">
                    {cardForm.expiry || 'MM/YY'}
                  </div>
                </div>
                <div className="card-type-badge">{cardType}</div>
              </div>
            </div>

            <form className="qa-form cc-form" onSubmit={submitPayment} noValidate data-testid="payment-form">
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  id="cardNumber"
                  type="text"
                  name="cardNumber"
                  value={cardForm.cardNumber}
                  onChange={handleCardInput}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  data-testid="card-number-input"
                />
                {cardErrors.cardNumber && <span className="error">{cardErrors.cardNumber}</span>}
              </div>

              <div className="cc-row">
                <div className="form-group">
                  <label htmlFor="expiry">Expiry (MM/YY)</label>
                  <input
                    id="expiry"
                    type="text"
                    name="expiry"
                    value={cardForm.expiry}
                    onChange={handleCardInput}
                    placeholder="MM/YY"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    data-testid="expiry-input"
                  />
                  {cardErrors.expiry && <span className="error">{cardErrors.expiry}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">
                    CVV{' '}
                    <button
                      type="button"
                      className="cvv-toggle"
                      onClick={() => setCvvVisible((v) => !v)}
                      aria-label={cvvVisible ? 'Hide CVV' : 'Show CVV'}
                      data-testid="cvv-toggle"
                    >
                      {cvvVisible ? '🙈' : '👁'}
                    </button>
                  </label>
                  <input
                    id="cvv"
                    type={cvvVisible ? 'text' : 'password'}
                    name="cvv"
                    value={cardForm.cvv}
                    onChange={handleCardInput}
                    placeholder="123"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    data-testid="cvv-input"
                  />
                  {cardErrors.cvv && <span className="error">{cardErrors.cvv}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cardholderName">Cardholder Name</label>
                <input
                  id="cardholderName"
                  type="text"
                  name="cardholderName"
                  value={cardForm.cardholderName}
                  onChange={handleCardInput}
                  placeholder="Jane Smith"
                  autoComplete="cc-name"
                  data-testid="cardholder-name-input"
                />
                {cardErrors.cardholderName && <span className="error">{cardErrors.cardholderName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="zip">Billing ZIP / Postal Code</label>
                <input
                  id="zip"
                  type="text"
                  name="zip"
                  value={cardForm.zip}
                  onChange={handleCardInput}
                  placeholder="10001"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  data-testid="zip-input"
                />
                {cardErrors.zip && <span className="error">{cardErrors.zip}</span>}
              </div>

              <div className="cc-actions">
                <button type="submit" className="cc-pay-btn" data-testid="pay-button">
                  Pay $49.99
                </button>
                <button type="button" className="cc-reset-btn" onClick={resetCard} data-testid="reset-button">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    // ── Shadow DOM ──────────────────────────────────────────────────────────
    if (selectedOption === 'shadow-dom') {
      return (
        <div className="content-section">
          <h2>Shadow DOM</h2>
          <p className="section-description">
            Web components encapsulate their internals in a Shadow DOM. Standard selectors cannot pierce it — in
            Playwright use <code>{'locator(\'pierce/[data-testid="shadow-btn"]\')'}</code>.
          </p>

          <div className="shadow-dom-grid">
            <div className="shadow-dom-panel">
              <h3 className="shadow-dom-panel-title">Regular DOM</h3>
              <p className="shadow-dom-panel-desc">Selectable with normal CSS selectors.</p>
              <div className="shadow-box" data-testid="regular-dom-box">
                <p className="shadow-box-text">This paragraph is in the regular DOM.</p>
                <button
                  type="button"
                  data-testid="regular-btn"
                  className="shadow-dom-btn"
                  onClick={() => setShadowClicked(true)}
                >
                  Regular DOM button
                </button>
                {shadowClicked && (
                  <p className="shadow-result-msg" data-testid="regular-result">
                    ✓ Regular button clicked
                  </p>
                )}
              </div>
            </div>

            <div className="shadow-dom-panel">
              <h3 className="shadow-dom-panel-title">Shadow DOM</h3>
              <p className="shadow-dom-panel-desc">
                Button and input are invisible to <code>document.querySelector</code> — use Playwright&apos;s{' '}
                <code>pierce/</code> selector.
              </p>
              <ShadowDOMWidget onInput={(val) => setShadowInputVal(val)} />
              {shadowInputVal && (
                <p className="shadow-result-msg" data-testid="shadow-typed-mirror">
                  Mirrored: <strong>{shadowInputVal}</strong>
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ── Multi-tab / Popup ───────────────────────────────────────────────────
    if (selectedOption === 'multi-tab') {
      const logEntry = (msg) => setPopupLog((prev) => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev]);
      return (
        <div className="content-section">
          <h2>Multi-tab &amp; Popup</h2>
          <p>
            Practice handling new tabs and popup windows. In Playwright use{' '}
            <code>page.waitForEvent(&apos;popup&apos;)</code> to capture the new context before clicking.
          </p>

          <div className="multi-tab-grid">
            <div className="multi-tab-card">
              <div className="multi-tab-card-icon">↗</div>
              <h3>New Tab — anchor link</h3>
              <p>
                A plain <code>{'<a target="_blank">'}</code> — the most common case.
              </p>
              <a
                href="https://playwright.dev"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="new-tab-link"
                className="multi-tab-btn multi-tab-btn--primary"
                onClick={() => logEntry('Anchor link clicked → playwright.dev')}
              >
                Open Playwright docs
              </a>
            </div>

            <div className="multi-tab-card">
              <div className="multi-tab-card-icon">⧉</div>
              <h3>Popup window</h3>
              <p>
                Opens a 600×400 popup via <code>window.open()</code>.
              </p>
              <button
                type="button"
                data-testid="open-popup-btn"
                className="multi-tab-btn multi-tab-btn--secondary"
                onClick={() => {
                  window.open('https://playwright.dev', 'pw-popup', 'width=600,height=400');
                  logEntry('Popup window opened (600×400)');
                }}
              >
                Open popup window
              </button>
            </div>

            <div className="multi-tab-card">
              <div className="multi-tab-card-icon">□</div>
              <h3>Blank tab</h3>
              <p>
                Opens a new tab with <code>about:blank</code> — useful for navigation testing.
              </p>
              <button
                type="button"
                data-testid="open-blank-tab-btn"
                className="multi-tab-btn multi-tab-btn--ghost"
                onClick={() => {
                  window.open('about:blank', '_blank');
                  logEntry('Blank tab opened via window.open()');
                }}
              >
                Open blank tab
              </button>
            </div>
          </div>

          <div className="multi-tab-log-section">
            <div className="multi-tab-log-header">
              <h3>Action log</h3>
              {popupLog.length > 0 && (
                <button type="button" className="multi-tab-clear-btn" onClick={() => setPopupLog([])}>
                  Clear
                </button>
              )}
            </div>
            <div className="multi-tab-log" data-testid="popup-log">
              {popupLog.length === 0 ? (
                <span className="multi-tab-log-empty">No actions yet — click a button above.</span>
              ) : (
                <ul className="multi-tab-log-list">
                  {popupLog.map((entry, i) => (
                    <li key={i} data-testid={`log-entry-${i}`} className="multi-tab-log-entry">
                      {entry}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ── Viewport / Responsive ───────────────────────────────────────────────
    if (selectedOption === 'viewport') {
      const bp =
        viewportSize.w < 480
          ? 'xs-mobile'
          : viewportSize.w < 768
          ? 'mobile'
          : viewportSize.w < 1024
          ? 'tablet'
          : 'desktop';
      const bpColor = { 'xs-mobile': '#e53e3e', mobile: '#ed8936', tablet: '#3182ce', desktop: '#38a169' }[bp];

      return (
        <div className="content-section">
          <h2>Viewport &amp; Responsive</h2>
          <p className="section-description">
            Test responsive layouts at different sizes. In Playwright use{' '}
            <code>{'page.setViewportSize({ width: 375, height: 812 })'}</code> or device emulation via{' '}
            <code>devices[&apos;iPhone 14&apos;]</code>.
          </p>

          <div style={{ marginBottom: 16 }}>
            <span
              data-testid="breakpoint-badge"
              data-breakpoint={bp}
              style={{
                background: bpColor,
                color: '#fff',
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 14,
                marginRight: 12
              }}
            >
              {bp.toUpperCase()}
            </span>
            <span data-testid="viewport-info" style={{ fontFamily: 'monospace', fontSize: 13 }}>
              <span data-testid="viewport-width">{viewportSize.w}px</span>
              {' × '}
              <span data-testid="viewport-height">{viewportSize.h}px</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {[
              { label: 'XS Mobile', w: 375, h: 667, testId: 'preset-xs' },
              { label: 'Mobile', w: 430, h: 932, testId: 'preset-mobile' },
              { label: 'Tablet', w: 768, h: 1024, testId: 'preset-tablet' },
              { label: 'Desktop', w: 1440, h: 900, testId: 'preset-desktop' }
            ].map((p) => (
              <button
                key={p.label}
                data-testid={p.testId}
                className="qa-btn qa-btn--sm"
                onClick={() => setViewportSize({ w: p.w, h: p.h })}
              >
                {p.label} ({p.w}×{p.h})
              </button>
            ))}
          </div>

          <div
            data-testid="responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns:
                viewportSize.w < 480 ? '1fr' : viewportSize.w < 768 ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
              gap: 12
            }}
          >
            {['Card A', 'Card B', 'Card C', 'Card D', 'Card E', 'Card F'].map((c) => (
              <div
                key={c}
                data-testid={`card-${c.toLowerCase().replace(' ', '-')}`}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 8,
                  padding: 16,
                  textAlign: 'center'
                }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── Rich Text Editor ────────────────────────────────────────────────────
    if (selectedOption === 'rich-text-editor') {
      const execCmd = (cmd, value = null) => {
        rteRef.current && rteRef.current.focus();
        document.execCommand(cmd, false, value);
        setRteHtml(rteRef.current ? rteRef.current.innerHTML : '');
      };

      return (
        <div className="content-section">
          <h2>Rich Text Editor</h2>
          <p className="section-description">
            <code>contentEditable</code> editors (TinyMCE, Quill, ProseMirror) require special handling in Playwright.
            Practice typing, applying formatting, and asserting the HTML output.
          </p>

          <div className="rte-demo">
            <div
              data-testid="rte-toolbar"
              role="toolbar"
              aria-label="Text formatting"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 4,
                padding: '8px 12px',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '6px 6px 0 0',
                background: 'rgba(255,255,255,0.07)'
              }}
            >
              {[
                { cmd: 'bold', label: 'B', title: 'Bold', testId: 'btn-bold', style: { fontWeight: 'bold' } },
                { cmd: 'italic', label: 'I', title: 'Italic', testId: 'btn-italic', style: { fontStyle: 'italic' } },
                {
                  cmd: 'underline',
                  label: 'U',
                  title: 'Underline',
                  testId: 'btn-underline',
                  style: { textDecoration: 'underline' }
                },
                { cmd: 'strikeThrough', label: 'S̶', title: 'Strikethrough', testId: 'btn-strikethrough', style: {} }
              ].map(({ cmd, label, title, testId, style }) => (
                <button
                  key={cmd}
                  title={title}
                  data-testid={testId}
                  aria-label={title}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execCmd(cmd);
                  }}
                  style={{
                    ...style,
                    padding: '4px 10px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 4,
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.1)'
                  }}
                >
                  {label}
                </button>
              ))}
              <span style={{ margin: '0 4px', color: 'rgba(255,255,255,0.3)' }}>|</span>
              {[
                { cmd: 'formatBlock', value: 'H1', label: 'H1', testId: 'btn-h1' },
                { cmd: 'formatBlock', value: 'H2', label: 'H2', testId: 'btn-h2' },
                { cmd: 'formatBlock', value: 'P', label: 'P', testId: 'btn-paragraph' }
              ].map(({ cmd, value, label, testId }) => (
                <button
                  key={value}
                  data-testid={testId}
                  aria-label={label}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execCmd(cmd, value);
                  }}
                  style={{
                    padding: '4px 10px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 4,
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.1)'
                  }}
                >
                  {label}
                </button>
              ))}
              <span style={{ margin: '0 4px', color: 'rgba(255,255,255,0.3)' }}>|</span>
              <button
                data-testid="btn-clear"
                aria-label="Clear"
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (rteRef.current) {
                    rteRef.current.innerHTML = '';
                    setRteHtml('');
                  }
                }}
                style={{
                  padding: '4px 10px',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  cursor: 'pointer',
                  background: '#fff'
                }}
              >
                Clear
              </button>
            </div>

            <div
              ref={rteRef}
              contentEditable="true"
              suppressContentEditableWarning
              data-testid="rte-editor"
              aria-label="Rich text editor"
              role="textbox"
              aria-multiline="true"
              onInput={() => setRteHtml(rteRef.current ? rteRef.current.innerHTML : '')}
              style={{
                minHeight: 160,
                border: '1px solid rgba(255,255,255,0.15)',
                borderTop: 'none',
                borderRadius: '0 0 6px 6px',
                padding: 16,
                outline: 'none',
                fontSize: 15,
                lineHeight: 1.6
              }}
            />

            <p style={{ margin: '16px 0 4px', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Raw HTML output:</p>
            <pre
              data-testid="rte-html-output"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                padding: 12,
                fontSize: 12,
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                minHeight: 40
              }}
            >
              {rteHtml || <span style={{ color: 'rgba(255,255,255,0.35)' }}>(empty — type something above)</span>}
            </pre>
          </div>
        </div>
      );
    }

    return <div className="content-section">Select an option from the sidebar</div>;
  };

  return (
    <div id="top" className="qa-practice-container">
      <header className="qa-practice-header">
        <button className="home-button" onClick={() => navigate('/qa-practice')} aria-label="Go to QA Practice">
          ← Back
        </button>
        <h1>QA Practice</h1>
      </header>
      <div className="qa-practice-main">
        <div className="qa-practice-content">{renderContent()}</div>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          onKeyDown={handleModalKeyDown}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submitted Data</h2>
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="data-item">
                <span className="data-label">Text Input:</span>
                <span className="data-value">{submittedData?.textInput || '(empty)'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Email:</span>
                <span className="data-value">{submittedData?.email || '(empty)'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Password:</span>
                <span className="data-value">{submittedData?.password ? '••••••••' : '(empty)'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Number:</span>
                <span className="data-value">{submittedData?.number || '(empty)'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Date:</span>
                <span className="data-value">{submittedData?.date || '(empty)'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Textarea:</span>
                <span className="data-value">{submittedData?.textarea || '(empty)'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Select:</span>
                <span className="data-value">{submittedData?.select || '(empty)'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Radio:</span>
                <span className="data-value">{submittedData?.radio || '(empty)'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Checkbox:</span>
                <span className="data-value">{submittedData?.checkbox ? 'Checked' : 'Unchecked'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Range:</span>
                <span className="data-value">{submittedData?.range}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QAPractice;
