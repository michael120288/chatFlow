import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '@pages/qa-practice/QAPractice.scss';

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

  const sidebarOptions = [
    { id: 'web-inputs', label: 'Web Inputs' },
    { id: 'dynamic-table', label: 'Dynamic Table' },
    { id: 'drag-and-drop', label: 'Drag and Drop' },
    { id: 'iframe', label: 'IFrame' },
    { id: 'file-upload', label: 'File Upload' },
    { id: 'alerts-modals', label: 'Alerts & Modals' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'tooltips', label: 'Tooltips' },
    { id: 'loaders', label: 'Loaders & Spinners' },
    { id: 'accordion', label: 'Accordion' },
    { id: 'tabs', label: 'Tabs' },
    { id: 'carousel', label: 'Carousel' },
    { id: 'search-filters', label: 'Search & Filters' },
    { id: 'breadcrumbs', label: 'Breadcrumbs' },
    { id: 'context-menu', label: 'Context Menu' },
    { id: 'copy-clipboard', label: 'Copy to Clipboard' },
    { id: 'rating', label: 'Rating' },
    { id: 'wizard', label: 'Wizard' },
    { id: 'infinite-scroll', label: 'Infinite Scroll' },
    { id: 'sticky-elements', label: 'Sticky Elements' }
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
    } else if (path === '/qa-practice') {
      // Default to web-inputs if on base route
      navigate('/qa-practice/web-inputs', { replace: true });
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
    { id: 3, name: 'Carrot', category: 'vegetable', price: 1.0 },
    { id: 4, name: 'Broccoli', category: 'vegetable', price: 2.0 },
    { id: 5, name: 'Chicken', category: 'meat', price: 8.0 },
    { id: 6, name: 'Beef', category: 'meat', price: 12.0 }
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
              <div className="custom-date-picker">
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  placeholder="MM-DD-YYYY"
                  readOnly
                  onClick={toggleDatePicker}
                  className="date-input-field"
                />
                {showDatePicker && (
                  <div className="date-picker-dropdown">
                    <div className="date-picker-header">
                      <h4>Select Date</h4>
                      <button type="button" className="date-picker-close" onClick={closeDatePicker}>
                        ×
                      </button>
                    </div>
                    <div className="date-selectors">
                      <div className="date-selector-group">
                        <label htmlFor="month-select">Month:</label>
                        <select
                          id="month-select"
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
                    <button type="button" className="date-picker-done" onClick={closeDatePicker}>
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
      return (
        <div className="content-section">
          <h2>Loaders & Spinners</h2>
          <p>Practice testing different loading indicators and spinners</p>

          <div className="loaders-content">
            {/* Circular Spinners */}
            <div className="loader-section">
              <h3>Circular Spinners</h3>
              <div className="loader-grid">
                <div className="loader-item">
                  <div className="spinner spinner-border"></div>
                  <span className="loader-label">Border Spinner</span>
                </div>

                <div className="loader-item">
                  <div className="spinner spinner-dual"></div>
                  <span className="loader-label">Dual Ring</span>
                </div>

                <div className="loader-item">
                  <div className="spinner spinner-circle"></div>
                  <span className="loader-label">Circle Spinner</span>
                </div>

                <div className="loader-item">
                  <div className="spinner spinner-grow"></div>
                  <span className="loader-label">Growing Spinner</span>
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="loader-section">
              <h3>Progress Bars</h3>
              <div className="progress-container">
                <div className="progress-item">
                  <span className="progress-label">Indeterminate Progress</span>
                  <div className="progress-bar">
                    <div className="progress-fill indeterminate"></div>
                  </div>
                </div>

                <div className="progress-item">
                  <span className="progress-label">50% Progress</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '50%' }}></div>
                  </div>
                </div>

                <div className="progress-item">
                  <span className="progress-label">Striped Progress</span>
                  <div className="progress-bar">
                    <div className="progress-fill striped" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="progress-item">
                  <span className="progress-label">Animated Striped</span>
                  <div className="progress-bar">
                    <div className="progress-fill striped animated" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots Loaders */}
            <div className="loader-section">
              <h3>Dots Loaders</h3>
              <div className="loader-grid">
                <div className="loader-item">
                  <div className="dots-loader">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                  <span className="loader-label">Bouncing Dots</span>
                </div>

                <div className="loader-item">
                  <div className="dots-loader pulse">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                  <span className="loader-label">Pulsing Dots</span>
                </div>

                <div className="loader-item">
                  <div className="dots-loader wave">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                  <span className="loader-label">Wave Dots</span>
                </div>
              </div>
            </div>

            {/* Skeleton Loaders */}
            <div className="loader-section">
              <h3>Skeleton Loaders</h3>
              <div className="skeleton-container">
                <div className="skeleton-card">
                  <div className="skeleton-avatar"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>

                <div className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="loader-section">
              <h3>Different Sizes</h3>
              <div className="loader-grid sizes">
                <div className="loader-item">
                  <div className="spinner spinner-border small"></div>
                  <span className="loader-label">Small</span>
                </div>

                <div className="loader-item">
                  <div className="spinner spinner-border medium"></div>
                  <span className="loader-label">Medium</span>
                </div>

                <div className="loader-item">
                  <div className="spinner spinner-border large"></div>
                  <span className="loader-label">Large</span>
                </div>
              </div>
            </div>
          </div>
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
          <div className="sticky-demo">
            <div className="sticky-header">This header sticks to the top when scrolling</div>
            <div className="content-block">
              <p>Scroll down to see the sticky header in action.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit.</p>
              <p>Excepteur sint occaecat cupidatat non proident.</p>
              <p>Sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
            </div>
            <button
              type="button"
              className="back-to-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              ↑ Back to Top
            </button>
          </div>
        </div>
      );
    }

    return <div className="content-section">Select an option from the sidebar</div>;
  };

  return (
    <div className="qa-practice-container">
      <header className="qa-practice-header">
        <button className="home-button" onClick={() => navigate('/')} aria-label="Go to home page">
          ← Home
        </button>
        <h1>QA Practice</h1>
      </header>
      <div className="qa-practice-main">
        <aside className="qa-practice-sidebar">
          <nav className="sidebar-nav">
            {sidebarOptions.map((option) => (
              <button
                key={option.id}
                className={`sidebar-option ${selectedOption === option.id ? 'active' : ''}`}
                onClick={() => navigate(`/qa-practice/${option.id}`)}
              >
                {option.label}
              </button>
            ))}
          </nav>
        </aside>
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
