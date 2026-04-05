// ─────────────────────────────────────────────────────────────────────────────
// Validate signature: (matchedNodeList, containerElement, rawSelectorString)
// Use rawSelectorString for pseudo-element / interactive-state lessons where
// querySelectorAll cannot match (::before, :hover, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTERS = [
  // ── 0. HOW HTML WORKS ──────────────────────────────────────────────────────
  {
    id: 'how-html-works',
    title: 'How HTML Works',
    icon: '📄',
    lessons: [
      {
        id: 'html-elements',
        title: 'HTML Elements',
        explanation: [
          'Before learning selectors, you need to understand what you are selecting. A web page is built from <strong>HTML elements</strong>. Every element has three parts: an opening tag, some content, and a closing tag.',
          'For example: <code>&lt;p&gt;Hello world&lt;/p&gt;</code> — <code>&lt;p&gt;</code> is the opening tag, "Hello world" is the content, and <code>&lt;/p&gt;</code> is the closing tag.',
          'Elements can also have <strong>attributes</strong> inside the opening tag. Attributes add extra information: <code>&lt;a href="/about" class="nav-link"&gt;About&lt;/a&gt;</code> has two attributes — <code>href</code> (the link destination) and <code>class</code> (a label for styling).',
          'The most important attributes for CSS selectors are: <code>id</code> (a unique name for one element), <code>class</code> (a shared label for many elements), and any other attribute like <code>href</code>, <code>type</code>, <code>disabled</code>.'
        ],
        syntax: '<tagname attribute="value">content</tagname>',
        examples: [
          { selector: '<p>', meaning: 'A paragraph element — tag name is "p"' },
          { selector: '<div class="card">', meaning: 'A div with class attribute "card"' },
          { selector: '<input type="text" disabled>', meaning: 'An input with two attributes' },
          { selector: '<h1 id="title">', meaning: 'An h1 heading with a unique ID' }
        ],
        tip: 'Some elements are self-closing and have no content or closing tag: <input />, <img />, <br />.',
        html: `<div class="card">
  <h2 id="title">Product Name</h2>
  <p class="description">A great product for everyone.</p>
  <a href="/buy" class="btn">Buy Now</a>
  <input type="text" placeholder="Enter qty" />
</div>`,
        task: 'Select all elements that have a class attribute (any class).',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 3 && arr.every((el) => el.hasAttribute('class'));
        },
        hint: 'Use the attribute selector [class] to match any element that has a class attribute.',
        successMessage: '3 elements with a class attribute found!'
      },
      {
        id: 'dom-tree',
        title: 'Parent, Child & Sibling',
        explanation: [
          'HTML elements are nested inside each other, forming a tree-like structure called the <strong>DOM</strong> (Document Object Model). Understanding this tree is essential for writing selectors.',
          'When element B is directly inside element A, we say A is the <strong>parent</strong> and B is the <strong>child</strong>. If B is inside A but several levels deep (not directly), B is a <strong>descendant</strong>.',
          'Elements that share the same parent are called <strong>siblings</strong>. If they are next to each other with nothing in between, they are <strong>adjacent siblings</strong>.',
          'Example: in <code>&lt;ul&gt;&lt;li&gt;One&lt;/li&gt;&lt;li&gt;Two&lt;/li&gt;&lt;/ul&gt;</code>, the <code>&lt;ul&gt;</code> is the parent, both <code>&lt;li&gt;</code> elements are its children, and the two <code>&lt;li&gt;</code> elements are siblings of each other.'
        ],
        syntax: 'parent → children → descendants',
        examples: [
          { selector: 'Parent', meaning: 'The element directly containing another element' },
          { selector: 'Child', meaning: 'An element directly inside its parent' },
          { selector: 'Descendant', meaning: 'Any element nested inside, at any depth' },
          { selector: 'Sibling', meaning: 'Elements that share the same parent' }
        ],
        tip: 'Open DevTools (F12), hover over elements in the Elements panel, and you can see the parent-child relationships highlighted in the tree.',
        html: `<div class="page">
  <header class="site-header">
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
  <main class="content">
    <h1>Welcome</h1>
    <p>Hello from the main content area.</p>
  </main>
</div>`,
        task: 'Select the direct children of .page (the header and main).',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => el.parentElement && el.parentElement.classList.contains('page'));
        },
        hint: 'Use .page > * to select all direct children of .page',
        successMessage: '2 direct children selected — header and main!'
      }
    ]
  },

  // ── 1. THE BASICS ──────────────────────────────────────────────────────────
  {
    id: 'basics',
    title: 'The Basics',
    icon: '🎯',
    lessons: [
      {
        id: 'universal',
        title: 'The Universal Selector',
        explanation: [
          'A CSS selector is a pattern that tells the browser: "find these elements in the page." Every time you style something in CSS or grab an element in JavaScript, you use a selector.',
          'The simplest selector of all is the universal selector: a single asterisk <code>*</code>. It matches every single element on the page — paragraphs, headings, divs, spans, buttons, everything.',
          'While you rarely use <code>*</code> on its own in production code, it is a great starting point to understand what selectors do: they find elements.'
        ],
        syntax: '*',
        examples: [
          { selector: '*', meaning: 'Every element on the page' },
          { selector: 'div *', meaning: 'Every element inside any div' }
        ],
        tip: 'In DevTools you can test any selector by typing document.querySelectorAll("*") in the console.',
        html: `<div class="card">
  <h2>Welcome</h2>
  <p>This is a paragraph.</p>
  <button>Click me</button>
</div>`,
        task: 'Select every element on the page.',
        validate: (els, container) => els.length > 0 && els.length === container.querySelectorAll('*').length,
        hint: 'The universal selector is a single character.',
        successMessage: "You selected everything! That's the power of *"
      },
      {
        id: 'tag',
        title: 'Tag Selectors',
        explanation: [
          'Every HTML element has a tag name: <code>p</code> for paragraphs, <code>h1</code> for headings, <code>div</code> for containers, <code>button</code> for buttons, and so on.',
          'A tag selector (also called a type selector) simply uses the tag name to select all elements of that type. No symbols needed — just write the tag name.',
          'For example, writing <code>p</code> selects every <code>&lt;p&gt;</code> on the page. Writing <code>h2</code> selects every <code>&lt;h2&gt;</code>. This is one of the most common selectors you will use.'
        ],
        syntax: 'tagname',
        examples: [
          { selector: 'p', meaning: 'All paragraph elements' },
          { selector: 'h1', meaning: 'All h1 headings' },
          { selector: 'button', meaning: 'All button elements' },
          { selector: 'li', meaning: 'All list items' }
        ],
        tip: 'Tag selectors are case-insensitive in HTML. Both P and p work the same way.',
        html: `<article>
  <h2>Today's Menu</h2>
  <p>Fresh salads and grilled options.</p>
  <p>All meals include a drink.</p>
  <ul>
    <li>Caesar Salad</li>
    <li>Grilled Chicken</li>
    <li>Pasta Primavera</li>
  </ul>
  <button>Order Now</button>
</article>`,
        task: 'Select all the list items (<li> elements).',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 3 && arr.every((el) => el.tagName === 'LI');
        },
        hint: 'Just type the tag name — no angle brackets, no symbols.',
        successMessage: 'All 3 list items selected!'
      },
      {
        id: 'class',
        title: 'Class Selectors',
        explanation: [
          'A class is a label you can attach to any HTML element using the <code>class</code> attribute. The same class can be applied to multiple elements, and one element can have multiple classes.',
          'To select elements by their class, prefix the class name with a dot: <code>.classname</code>. So if an element has <code>class="card"</code>, you select it with <code>.card</code>.',
          'Classes are the most flexible selector in CSS. A <code>&lt;div&gt;</code>, a <code>&lt;p&gt;</code>, and a <code>&lt;button&gt;</code> can all share the same class and be selected together.',
          'You can also chain class selectors to target elements that have ALL of them: <code>.btn.primary</code> selects only elements that have both the "btn" class AND the "primary" class.'
        ],
        syntax: '.classname',
        examples: [
          { selector: '.card', meaning: 'All elements with class "card"' },
          { selector: '.active', meaning: 'All elements with class "active"' },
          { selector: '.btn.primary', meaning: 'Elements with BOTH "btn" AND "primary" classes' }
        ],
        tip: 'An element can have multiple classes: class="btn primary large". Chain selectors to target elements that have all of them: .btn.primary.large',
        html: `<div class="product-list">
  <div class="product featured">
    <span class="badge">Sale</span>
    <p class="name">Wireless Headphones</p>
    <p class="price">$49.99</p>
  </div>
  <div class="product">
    <p class="name">USB-C Cable</p>
    <p class="price">$9.99</p>
  </div>
  <div class="product featured">
    <span class="badge">New</span>
    <p class="name">Smart Watch</p>
    <p class="price">$199.99</p>
  </div>
</div>`,
        task: 'Select only the featured products.',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => el.classList.contains('featured'));
        },
        hint: 'Use a dot before the class name.',
        successMessage: '2 featured products selected!'
      },
      {
        id: 'id',
        title: 'ID Selectors',
        explanation: [
          'An ID is a unique identifier for a single element on the page, set using the <code>id</code> attribute. Unlike classes, IDs must be unique — no two elements should share the same ID on one page.',
          'To select an element by its ID, prefix the ID name with a hash symbol: <code>#idname</code>. So <code>&lt;div id="header"&gt;</code> is selected with <code>#header</code>.',
          'Because IDs are unique, an ID selector always points to one specific element. This makes them great for landmark elements like headers, footers, or main content areas.'
        ],
        syntax: '#idname',
        examples: [
          { selector: '#header', meaning: 'The element with id="header"' },
          { selector: '#submit-btn', meaning: 'The element with id="submit-btn"' },
          { selector: '#main-content', meaning: 'The element with id="main-content"' }
        ],
        tip: 'In JavaScript, document.getElementById("name") is faster than querySelector("#name"), but both work. Prefer classes for styling — save IDs for JavaScript hooks.',
        html: `<div id="page">
  <header id="site-header">
    <h1>My Blog</h1>
  </header>
  <main id="content">
    <p>Welcome to my blog.</p>
    <p>New posts every week.</p>
  </main>
  <footer id="site-footer">
    <p>© 2025 My Blog</p>
  </footer>
</div>`,
        task: 'Select the main content area (id="content").',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 1 && arr[0].id === 'content';
        },
        hint: 'Use # before the ID name.',
        successMessage: 'The main content area selected!'
      },
      {
        id: 'grouping',
        title: 'Grouping Selectors',
        explanation: [
          'Sometimes you want to select multiple different types of elements at once. Instead of writing separate selectors, you can group them together using a comma.',
          '<code>h1, h2, h3</code> selects all three heading types at once. <code>p, li</code> selects all paragraphs and all list items.',
          'This is purely a shortcut — <code>h1, p</code> is exactly the same as selecting <code>h1</code> and <code>p</code> separately and combining the results. It just saves repetition.'
        ],
        syntax: 'selector1, selector2',
        examples: [
          { selector: 'h1, h2, h3', meaning: 'All three heading levels' },
          { selector: 'p, li', meaning: 'All paragraphs and list items' },
          { selector: '.error, .warning', meaning: 'Elements with class "error" or "warning"' }
        ],
        tip: 'You can group any combination of selectors: tags, classes, IDs, or more complex ones.',
        html: `<section>
  <h2>Alerts</h2>
  <p class="error">Payment failed. Please try again.</p>
  <p class="info">Your cart has been saved.</p>
  <p class="warning">Low stock — only 2 left!</p>
  <p class="error">Invalid email address.</p>
</section>`,
        task: 'Select both error AND warning messages.',
        validate: (els) => {
          const arr = Array.from(els);
          return (
            arr.length === 3 && arr.every((el) => el.classList.contains('error') || el.classList.contains('warning'))
          );
        },
        hint: 'Use a comma to separate two class selectors.',
        successMessage: 'All 3 alert messages selected!'
      }
    ]
  },

  // ── 2. COMBINATORS ─────────────────────────────────────────────────────────
  {
    id: 'combinators',
    title: 'Combinators',
    icon: '🔗',
    lessons: [
      {
        id: 'descendant',
        title: 'Descendant Combinator',
        explanation: [
          'The descendant combinator is simply a <strong>space</strong> between two selectors. It means: "find elements that match the second selector AND are somewhere inside an element that matches the first selector."',
          'For example, <code>div p</code> selects every <code>&lt;p&gt;</code> that is anywhere inside a <code>&lt;div&gt;</code> — whether it is a direct child or nested several levels deep.',
          'This is one of the most useful selectors in practice. It lets you scope your selection to a specific section of the page without needing extra classes.'
        ],
        syntax: 'ancestor descendant',
        examples: [
          { selector: 'div p', meaning: 'All <p> elements inside any <div>' },
          { selector: '.card span', meaning: 'All <span> elements inside .card elements' },
          { selector: 'nav a', meaning: 'All links inside the navigation' }
        ],
        tip: 'The descendant combinator matches at ANY depth. For direct children only, use the child combinator (>) instead.',
        html: `<div class="sidebar">
  <h3>Categories</h3>
  <ul>
    <li><a href="#">Technology</a></li>
    <li><a href="#">Design</a></li>
  </ul>
</div>
<div class="main-content">
  <h2>Article Title</h2>
  <p>Read more <a href="#">here</a> and <a href="#">here</a>.</p>
</div>`,
        task: 'Select only the links inside the sidebar.',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => el.tagName === 'A' && el.closest('.sidebar'));
        },
        hint: 'Use a space between the container selector and the element selector.',
        successMessage: 'Only the 2 sidebar links selected!'
      },
      {
        id: 'child',
        title: 'Child Combinator',
        explanation: [
          'The child combinator <code>&gt;</code> is more strict than the descendant combinator. It selects elements that are <strong>direct children only</strong> — not grandchildren or deeper descendants.',
          'For example, <code>ul &gt; li</code> selects <code>&lt;li&gt;</code> elements that are direct children of a <code>&lt;ul&gt;</code>. If there is a nested list inside, its <code>&lt;li&gt;</code> elements are NOT selected.',
          'Use <code>&gt;</code> when you need precision — when you want to avoid accidentally selecting elements buried deeper in the structure.'
        ],
        syntax: 'parent > child',
        examples: [
          { selector: 'ul > li', meaning: 'List items that are direct children of <ul>' },
          { selector: '.menu > a', meaning: 'Links that are direct children of .menu' },
          { selector: 'div > p', meaning: '<p> elements that are direct children of a <div>' }
        ],
        tip: 'Think of > as "directly inside". The space combinator means "anywhere inside".',
        html: `<ul class="menu">
  <li>Home</li>
  <li>Products
    <ul>
      <li>Laptops</li>
      <li>Phones</li>
    </ul>
  </li>
  <li>About</li>
  <li>Contact</li>
</ul>`,
        task: 'Select only the top-level menu items (not the nested ones).',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 4 && arr.every((el) => el.parentElement.classList.contains('menu'));
        },
        hint: 'Use > to select only direct children of .menu',
        successMessage: '4 top-level items selected — nested items excluded!'
      },
      {
        id: 'adjacent',
        title: 'Adjacent Sibling Combinator',
        explanation: [
          'The adjacent sibling combinator <code>+</code> selects an element that comes <strong>immediately after</strong> another specific element, and both share the same parent.',
          '"Adjacent" means right next to — no other elements in between. <code>h2 + p</code> selects a <code>&lt;p&gt;</code> only if it comes directly after an <code>&lt;h2&gt;</code>.',
          'This is very useful for styling the first paragraph after a heading differently, or adding spacing between specific elements.'
        ],
        syntax: 'element + next-sibling',
        examples: [
          { selector: 'h2 + p', meaning: 'A <p> that comes immediately after an <h2>' },
          { selector: 'label + input', meaning: 'An input right after a label' },
          { selector: '.error + .hint', meaning: 'A .hint right after an .error element' }
        ],
        tip: 'Only the immediately next sibling is selected. To select ALL following siblings, use ~ instead.',
        html: `<article>
  <h2>Introduction</h2>
  <p>This paragraph comes right after the heading.</p>
  <p>This is the second paragraph.</p>
  <p>This is the third paragraph.</p>
  <h2>Conclusion</h2>
  <p>This paragraph follows the second heading.</p>
</article>`,
        task: 'Select only the paragraphs that come immediately after an h2.',
        validate: (els) => {
          const arr = Array.from(els);
          return (
            arr.length === 2 &&
            arr.every((el) => {
              const prev = el.previousElementSibling;
              return prev && prev.tagName === 'H2';
            })
          );
        },
        hint: 'Use + between h2 and p.',
        successMessage: '2 paragraphs selected — each one right after an h2!'
      },
      {
        id: 'sibling',
        title: 'General Sibling Combinator',
        explanation: [
          'The general sibling combinator <code>~</code> is similar to <code>+</code>, but less strict. It selects <strong>ALL elements</strong> that come after a specific element (not just the immediate next one), as long as they share the same parent.',
          '<code>h2 ~ p</code> selects every <code>&lt;p&gt;</code> that comes after an <code>&lt;h2&gt;</code> inside the same parent — whether it is the first one, the third one, or the tenth one.',
          'Think of it as "everything that follows" versus "only the next one".'
        ],
        syntax: 'element ~ siblings',
        examples: [
          { selector: 'h2 ~ p', meaning: 'All <p> elements that follow an <h2>' },
          { selector: '.active ~ li', meaning: 'All <li> elements after the .active one' }
        ],
        tip: 'Both + and ~ only look forward — they never select elements that come before the reference element.',
        html: `<section>
  <p>This paragraph comes before the heading.</p>
  <h2>Main Section</h2>
  <p>First paragraph after heading.</p>
  <p>Second paragraph after heading.</p>
  <p>Third paragraph after heading.</p>
</section>`,
        task: 'Select all paragraphs that come after the h2.',
        validate: (els) => {
          const arr = Array.from(els);
          return (
            arr.length === 3 &&
            arr.every((el) => {
              const siblings = Array.from(el.parentElement.children);
              const h2Idx = siblings.findIndex((s) => s.tagName === 'H2');
              return siblings.indexOf(el) > h2Idx;
            })
          );
        },
        hint: 'Use ~ between h2 and p.',
        successMessage: '3 paragraphs selected — all that follow the h2!'
      }
    ]
  },

  // ── 3. ATTRIBUTE SELECTORS ─────────────────────────────────────────────────
  {
    id: 'attributes',
    title: 'Attribute Selectors',
    icon: '🏷️',
    lessons: [
      {
        id: 'attr-exists',
        title: 'Selecting by Attribute',
        explanation: [
          'HTML elements can have attributes like <code>href</code>, <code>type</code>, <code>disabled</code>, <code>data-id</code>, and many more. Attribute selectors let you find elements based on these attributes.',
          'The simplest form <code>[attr]</code> selects any element that has a particular attribute — regardless of its value. <code>[disabled]</code> selects any element that has the disabled attribute.',
          'Attribute selectors are wrapped in square brackets <code>[ ]</code>.'
        ],
        syntax: '[attribute]',
        examples: [
          { selector: '[disabled]', meaning: 'Any element with a disabled attribute' },
          { selector: '[href]', meaning: 'Any element that has an href attribute' },
          { selector: '[data-id]', meaning: 'Any element with a data-id attribute' }
        ],
        tip: 'Attribute selectors work on any attribute, including custom data-* attributes.',
        html: `<form>
  <input type="text" placeholder="Your name" />
  <input type="email" placeholder="Your email" />
  <input type="text" placeholder="Phone" disabled />
  <input type="submit" value="Send" />
  <button disabled>Cancel</button>
</form>`,
        task: 'Select all disabled elements.',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => el.hasAttribute('disabled'));
        },
        hint: 'Use square brackets around the attribute name.',
        successMessage: '2 disabled elements found!'
      },
      {
        id: 'attr-value',
        title: 'Exact Attribute Value',
        explanation: [
          'You can be more specific by matching both the attribute name AND its exact value. The syntax is <code>[attr="value"]</code>.',
          'For example, <code>[type="email"]</code> selects only input fields whose type is exactly "email". The value must match completely — case-sensitive and in full.',
          'This is very useful for targeting specific form inputs, links that open in new tabs (<code>[target="_blank"]</code>), or elements with specific roles.'
        ],
        syntax: '[attribute="value"]',
        examples: [
          { selector: '[type="email"]', meaning: 'Inputs with type exactly "email"' },
          { selector: '[target="_blank"]', meaning: 'Links that open in a new tab' },
          { selector: '[role="button"]', meaning: 'Elements with role="button"' }
        ],
        tip: 'For partial matches, use *= (contains), ^= (starts with), or $= (ends with).',
        html: `<form>
  <input type="text" placeholder="First name" />
  <input type="text" placeholder="Last name" />
  <input type="email" placeholder="Email address" />
  <input type="password" placeholder="Password" />
  <input type="tel" placeholder="Phone number" />
  <input type="submit" value="Register" />
</form>`,
        task: 'Select only the text inputs (type="text").',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => el.getAttribute('type') === 'text');
        },
        hint: 'Use [attribute="value"] syntax.',
        successMessage: '2 text inputs selected!'
      },
      {
        id: 'attr-contains',
        title: 'Partial Attribute Matching',
        explanation: [
          'Sometimes you need to match an attribute value that contains, starts with, or ends with a certain string. CSS gives you three operators for this:',
          '<code>[attr*="val"]</code> — matches if the value <strong>contains</strong> "val" anywhere.',
          '<code>[attr^="val"]</code> — matches if the value <strong>starts with</strong> "val".',
          '<code>[attr$="val"]</code> — matches if the value <strong>ends with</strong> "val".'
        ],
        syntax: '[attr*="val"]  [attr^="val"]  [attr$="val"]',
        examples: [
          { selector: '[href^="https"]', meaning: 'Links starting with https' },
          { selector: '[href$=".pdf"]', meaning: 'Links ending in .pdf' },
          { selector: '[class*="btn"]', meaning: 'Elements whose class contains "btn"' }
        ],
        tip: 'Mnemonic: ^ means "starts" (like ^ in regex), $ means "ends" (like $ in regex), * means "anywhere".',
        html: `<ul class="links">
  <li><a href="https://example.com">External site</a></li>
  <li><a href="/docs/report.pdf">Download Report</a></li>
  <li><a href="/about">About us</a></li>
  <li><a href="https://docs.example.com">External docs</a></li>
  <li><a href="/docs/guide.pdf">Download Guide</a></li>
</ul>`,
        task: 'Select only the external links (those starting with https).',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => el.getAttribute('href').startsWith('https'));
        },
        hint: 'Use [href^="https"]',
        successMessage: '2 external links selected!'
      },
      {
        id: 'attr-word',
        title: 'Word in Attribute [attr~="word"]',
        explanation: [
          'The <code>[attr~="word"]</code> selector matches elements where the attribute value contains a specific <strong>whole word</strong> in a space-separated list.',
          'This is different from <code>[attr*="val"]</code>. For example, <code>[class*="btn"]</code> would match "btngroup" or "mybtn", while <code>[class~="btn"]</code> only matches when "btn" is a whole word in the class list.',
          'This is the same logic the browser uses when matching classes — <code>class="btn primary"</code> contains the word "btn" as a standalone item. It is most useful for matching multi-word attribute values like <code>rel</code>, <code>class</code>, or <code>aria-label</code>.'
        ],
        syntax: '[attr~="word"]',
        examples: [
          { selector: '[class~="btn"]', meaning: 'Elements where "btn" is one of the classes (word match)' },
          { selector: '[rel~="noopener"]', meaning: 'Links with noopener in their rel attribute' },
          { selector: '[data-tags~="featured"]', meaning: 'Elements tagged with "featured"' }
        ],
        tip: 'For class attributes specifically, .btn and [class~="btn"] are equivalent — both match "btn" as a whole word.',
        html: `<div class="products">
  <div data-tags="new featured sale">Laptop Pro — New, Featured, Sale</div>
  <div data-tags="new">USB Hub — New only</div>
  <div data-tags="featured">Headphones — Featured only</div>
  <div data-tags="sale">Mouse — Sale only</div>
</div>`,
        task: 'Select all products tagged as "featured".',
        validate: (els) => {
          const arr = Array.from(els);
          return (
            arr.length === 2 &&
            arr.every((el) => {
              const tags = (el.getAttribute('data-tags') || '').split(' ');
              return tags.includes('featured');
            })
          );
        },
        hint: 'Use [data-tags~="featured"]',
        successMessage: '2 featured products selected using word matching!'
      },
      {
        id: 'attr-lang',
        title: 'Language / Prefix Matching [attr|="val"]',
        explanation: [
          'The <code>[attr|="val"]</code> selector matches elements where the attribute value is exactly "val" OR starts with "val" followed immediately by a hyphen.',
          'It was designed for language codes: <code>[lang|="en"]</code> matches both <code>lang="en"</code> (English) and <code>lang="en-US"</code> (American English) and <code>lang="en-GB"</code> (British English).',
          'This is different from <code>[attr^="en"]</code> which would also match "engineer" or "enjoy". The <code>|=</code> operator specifically expects a hyphen separator, making it safe for matching language subtags.'
        ],
        syntax: '[attr|="val"]',
        examples: [
          { selector: '[lang|="en"]', meaning: 'Elements with lang="en" or lang="en-*"' },
          { selector: '[lang|="zh"]', meaning: 'Elements with lang="zh" or lang="zh-*"' },
          { selector: '[data-status|="ok"]', meaning: 'Elements with data-status="ok" or "ok-*"' }
        ],
        tip: '[lang|="en"] matches en, en-US, en-GB — but NOT "english". The hyphen must immediately follow the prefix.',
        html: `<div class="articles">
  <article lang="en">English article</article>
  <article lang="en-US">American English article</article>
  <article lang="en-GB">British English article</article>
  <article lang="fr">French article</article>
  <article lang="de">German article</article>
</div>`,
        task: 'Select all English articles (en, en-US, en-GB).',
        validate: (els) => {
          const arr = Array.from(els);
          return (
            arr.length === 3 &&
            arr.every((el) => {
              const lang = el.getAttribute('lang') || '';
              return lang === 'en' || lang.startsWith('en-');
            })
          );
        },
        hint: 'Use [lang|="en"]',
        successMessage: '3 English articles selected!'
      }
    ]
  },

  // ── 4. PSEUDO-CLASSES: POSITION ────────────────────────────────────────────
  {
    id: 'pseudo-position',
    title: 'Pseudo-classes: Position',
    icon: '📍',
    lessons: [
      {
        id: 'first-last',
        title: ':first-child and :last-child',
        explanation: [
          'Pseudo-classes let you select elements based on their state or position — things you cannot express with simple tag, class, or attribute selectors. They always start with a colon <code>:</code>.',
          '<code>:first-child</code> selects an element if it is the first child of its parent. <code>:last-child</code> selects it if it is the last child.',
          '<strong>Important gotcha:</strong> <code>p:first-child</code> does NOT mean "the first paragraph". It means "a paragraph that happens to be the first child of its parent." If the first child is a <code>&lt;div&gt;</code>, then <code>p:first-child</code> matches nothing.'
        ],
        syntax: ':first-child  :last-child',
        examples: [
          { selector: 'li:first-child', meaning: 'The first <li> in any list' },
          { selector: 'li:last-child', meaning: 'The last <li> in any list' },
          { selector: 'p:first-child', meaning: 'A <p> that IS the first child of its parent' }
        ],
        tip: ":first-child checks the element's position among all siblings, not its type. Use :first-of-type if you want the first element of that specific type.",
        html: `<ul class="steps">
  <li>Create an account</li>
  <li>Verify your email</li>
  <li>Set up your profile</li>
  <li>Invite your team</li>
  <li>Start your first project</li>
</ul>`,
        task: 'Select the last step in the list.',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 1 && arr[0].textContent.includes('Start your first project');
        },
        hint: 'Use li:last-child',
        successMessage: 'Last step selected!'
      },
      {
        id: 'nth-child',
        title: ':nth-child(n)',
        explanation: [
          '<code>:nth-child(n)</code> lets you select elements by their exact position. Pass a number and it picks the element at that position — counting starts at <strong>1</strong>, not 0.',
          'It also accepts a formula: <code>an+b</code>, where <code>n</code> goes through 0, 1, 2, 3… For example <code>:nth-child(3n)</code> selects every 3rd element (positions 3, 6, 9…). <code>:nth-child(2n+1)</code> selects odd positions (1, 3, 5…).',
          'Common formulas: <code>2n</code> = every even, <code>2n+1</code> = every odd, <code>3n</code> = every third, <code>n+4</code> = from the 4th onwards, <code>-n+3</code> = only the first 3.'
        ],
        syntax: ':nth-child(n)',
        examples: [
          { selector: 'li:nth-child(2)', meaning: 'The 2nd list item' },
          { selector: 'tr:nth-child(even)', meaning: 'Every even table row' },
          { selector: 'li:nth-child(3n)', meaning: 'Every 3rd item: 3, 6, 9...' },
          { selector: 'li:nth-child(n+4)', meaning: 'All items from the 4th onwards' },
          { selector: 'li:nth-child(-n+3)', meaning: 'Only the first 3 items' }
        ],
        tip: ':nth-child(1) is the same as :first-child. :nth-child(0) matches nothing.',
        html: `<ol class="ranking">
  <li>🥇 Alice — 9,850 pts</li>
  <li>🥈 Bob — 9,200 pts</li>
  <li>🥉 Carol — 8,750 pts</li>
  <li>Dave — 7,100 pts</li>
  <li>Eve — 6,600 pts</li>
  <li>Frank — 5,900 pts</li>
</ol>`,
        task: 'Select the 3rd place entry.',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 1 && arr[0].textContent.includes('Carol');
        },
        hint: 'Use li:nth-child(3)',
        successMessage: '🥉 Carol selected — 3rd place!'
      },
      {
        id: 'nth-odd-even',
        title: ':nth-child(odd) and :nth-child(even)',
        explanation: [
          'The keywords <code>odd</code> and <code>even</code> are the most common uses of <code>:nth-child</code>.',
          '<code>:nth-child(odd)</code> selects positions 1, 3, 5, 7… <code>:nth-child(even)</code> selects positions 2, 4, 6, 8…',
          'This is how you create <strong>zebra-striped tables</strong> — alternate row colors — without adding any classes to the HTML.'
        ],
        syntax: ':nth-child(odd)  :nth-child(even)',
        examples: [
          { selector: 'tr:nth-child(even)', meaning: 'Every even table row' },
          { selector: 'li:nth-child(odd)', meaning: 'Items 1, 3, 5, 7...' }
        ],
        tip: 'odd is the same as 2n+1, and even is the same as 2n.',
        html: `<table>
  <tr><td>Order #1001</td><td>$25.00</td></tr>
  <tr><td>Order #1002</td><td>$47.50</td></tr>
  <tr><td>Order #1003</td><td>$12.99</td></tr>
  <tr><td>Order #1004</td><td>$89.00</td></tr>
  <tr><td>Order #1005</td><td>$33.25</td></tr>
  <tr><td>Order #1006</td><td>$61.00</td></tr>
</table>`,
        task: 'Select all even-numbered rows.',
        validate: (els) => {
          const arr = Array.from(els);
          return (
            arr.length === 3 &&
            arr.every((el) => {
              const siblings = Array.from(el.parentElement.children);
              return (siblings.indexOf(el) + 1) % 2 === 0;
            })
          );
        },
        hint: 'Use tr:nth-child(even)',
        successMessage: '3 even rows selected — perfect for zebra striping!'
      },
      {
        id: 'nth-of-type',
        title: ':nth-of-type(n)',
        explanation: [
          '<code>:nth-of-type(n)</code> is similar to <code>:nth-child(n)</code>, but counts only elements of the <strong>same tag type</strong> when determining the position.',
          'The key difference: <code>p:nth-child(2)</code> selects a <code>&lt;p&gt;</code> only if it is the 2nd child among ALL siblings. <code>p:nth-of-type(2)</code> selects the 2nd <code>&lt;p&gt;</code>, ignoring all non-p siblings when counting.',
          'Use <code>:nth-of-type</code> when your elements are mixed with other tags and you want to count only same-type siblings.'
        ],
        syntax: 'tag:nth-of-type(n)',
        examples: [
          { selector: 'p:nth-of-type(2)', meaning: 'The 2nd <p>, counting only paragraphs' },
          { selector: 'img:nth-of-type(odd)', meaning: 'Every other image' }
        ],
        tip: 'Unlike :nth-child, :nth-of-type ignores siblings of different types when counting.',
        html: `<div class="gallery">
  <h3>Nature</h3>
  <p>Mountains and valleys.</p>
  <p>Forests and rivers.</p>
  <h3>Cities</h3>
  <p>Skylines and streets.</p>
  <p>Markets and parks.</p>
</div>`,
        task: 'Select the 2nd paragraph (counting only paragraphs, not headings).',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 1 && arr[0].textContent.includes('Forests and rivers');
        },
        hint: 'Use p:nth-of-type(2)',
        successMessage: 'The 2nd paragraph selected — counting only paragraphs!'
      },
      {
        id: 'only-child',
        title: ':only-child and :only-of-type',
        explanation: [
          '<code>:only-child</code> selects an element if it is the <strong>only child</strong> of its parent — no siblings at all.',
          '<code>:only-of-type</code> is less strict: it selects an element if it is the only element of its <strong>type</strong> among its siblings. Other types of siblings can exist.',
          'These are great for styling single-item containers differently: a list with only one item, a card with only one image, or a form group with a single input.'
        ],
        syntax: ':only-child  :only-of-type',
        examples: [
          { selector: 'li:only-child', meaning: 'A list item that is the only child of its ul/ol' },
          { selector: 'p:only-of-type', meaning: 'A paragraph that has no sibling paragraphs' },
          { selector: 'img:only-child', meaning: 'An image that is the only child of its parent' }
        ],
        tip: ':only-child is equivalent to :first-child:last-child.',
        html: `<div class="sections">
  <ul class="list-a">
    <li>Only item</li>
  </ul>
  <ul class="list-b">
    <li>Item one</li>
    <li>Item two</li>
    <li>Item three</li>
  </ul>
  <ul class="list-c">
    <li>Also only</li>
  </ul>
</div>`,
        task: 'Select list items that are the only child in their list.',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => el.parentElement.children.length === 1);
        },
        hint: 'Use li:only-child',
        successMessage: '2 solo list items selected!'
      },
      {
        id: 'nth-last',
        title: ':nth-last-child(n)',
        explanation: [
          '<code>:nth-last-child(n)</code> works exactly like <code>:nth-child(n)</code>, but counts from the <strong>end</strong> instead of the beginning.',
          '<code>li:nth-last-child(1)</code> is the same as <code>li:last-child</code>. <code>li:nth-last-child(2)</code> is the second-to-last item.',
          'This is very useful when you know you want "the last N items" without knowing the total count. <code>:nth-last-child(-n+3)</code> selects the last 3 items regardless of how many there are.'
        ],
        syntax: ':nth-last-child(n)',
        examples: [
          { selector: 'li:nth-last-child(1)', meaning: 'The last list item (same as :last-child)' },
          { selector: 'li:nth-last-child(2)', meaning: 'The second-to-last list item' },
          { selector: 'li:nth-last-child(-n+3)', meaning: 'The last 3 items' }
        ],
        tip: 'There is also :nth-last-of-type(n) which counts backwards by type, the same way :nth-of-type counts forwards.',
        html: `<ul class="timeline">
  <li>Jan — Project kickoff</li>
  <li>Feb — Design phase</li>
  <li>Mar — Development</li>
  <li>Apr — Testing</li>
  <li>May — Launch</li>
</ul>`,
        task: 'Select the last 2 items in the timeline.',
        validate: (els) => {
          const arr = Array.from(els);
          return (
            arr.length === 2 &&
            arr.every((el) => {
              const siblings = Array.from(el.parentElement.children);
              const fromEnd = siblings.length - siblings.indexOf(el);
              return fromEnd <= 2;
            })
          );
        },
        hint: 'Use li:nth-last-child(-n+2)',
        successMessage: 'The last 2 timeline items selected!'
      }
    ]
  },

  // ── 5. PSEUDO-CLASSES: FILTERS ─────────────────────────────────────────────
  {
    id: 'pseudo-filters',
    title: 'Pseudo-classes: Filters',
    icon: '🔍',
    lessons: [
      {
        id: 'not',
        title: ':not() — Exclusion',
        explanation: [
          '<code>:not()</code> is the negation pseudo-class. It selects every element that does <strong>NOT</strong> match the selector inside the parentheses.',
          '<code>li:not(.disabled)</code> selects all list items except those with the class "disabled". <code>input:not([type="submit"])</code> selects all inputs except submit buttons.',
          'This is incredibly useful when you want to style "everything except X" without adding extra classes to every other element.'
        ],
        syntax: ':not(selector)',
        examples: [
          { selector: 'li:not(.disabled)', meaning: 'List items that don\'t have class "disabled"' },
          { selector: 'input:not([type="submit"])', meaning: 'All inputs except submit buttons' },
          { selector: 'p:not(:first-child)', meaning: 'All paragraphs except the first child one' }
        ],
        tip: 'Modern CSS allows multiple arguments: :not(.foo, .bar). Older browsers only support one selector inside :not().',
        html: `<ul class="team">
  <li>Alice — Developer</li>
  <li class="inactive">Bob — On leave</li>
  <li>Carol — Designer</li>
  <li class="inactive">Dave — Transferred</li>
  <li>Eve — Manager</li>
</ul>`,
        task: 'Select only the active team members (those without class "inactive").',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 3 && arr.every((el) => !el.classList.contains('inactive'));
        },
        hint: 'Use li:not(.inactive)',
        successMessage: '3 active team members selected!'
      },
      {
        id: 'checked',
        title: ':checked',
        explanation: [
          '<code>:checked</code> matches checkboxes and radio buttons that are currently checked, and <code>&lt;option&gt;</code> elements that are selected in a <code>&lt;select&gt;</code>.',
          'This pseudo-class changes dynamically — when a user clicks a checkbox, it gains <code>:checked</code>, and when they uncheck it, <code>:checked</code> no longer applies.',
          'A very common pattern is to use <code>input:checked + label</code> to style the label of a checked checkbox, giving you a pure CSS toggle with no JavaScript.'
        ],
        syntax: ':checked',
        examples: [
          { selector: 'input:checked', meaning: 'All checked checkboxes and radio buttons' },
          { selector: '[type="checkbox"]:checked', meaning: 'Only checked checkboxes' },
          { selector: 'input:checked + label', meaning: 'Labels right after a checked input' }
        ],
        tip: ':checked is a live state. In DevTools you can force it with "Force element state" to test your styles.',
        html: `<form class="settings">
  <label><input type="checkbox" checked /> Email notifications</label>
  <label><input type="checkbox" /> SMS notifications</label>
  <label><input type="checkbox" checked /> Weekly newsletter</label>
  <label><input type="radio" name="plan" checked /> Free plan</label>
  <label><input type="radio" name="plan" /> Pro plan</label>
</form>`,
        task: 'Select all checked checkboxes (not radio buttons).',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => el.checked && el.type === 'checkbox');
        },
        hint: 'Use [type="checkbox"]:checked',
        successMessage: '2 checked checkboxes selected!'
      },
      {
        id: 'disabled',
        title: ':disabled and :enabled',
        explanation: [
          '<code>:disabled</code> matches form elements (inputs, buttons, selects, textareas) that have the <code>disabled</code> attribute set. Disabled elements cannot be interacted with by the user.',
          '<code>:enabled</code> is the opposite — it matches form elements that are NOT disabled and can be interacted with.',
          'These pseudo-classes are more semantically accurate than <code>[disabled]</code> because they also account for elements that inherit their disabled state from a parent <code>&lt;fieldset disabled&gt;</code>.'
        ],
        syntax: ':disabled  :enabled',
        examples: [
          { selector: 'input:disabled', meaning: 'All disabled input elements' },
          { selector: 'button:disabled', meaning: 'All disabled buttons' },
          { selector: 'input:enabled', meaning: 'All enabled (non-disabled) inputs' }
        ],
        tip: 'If you put disabled on a <fieldset>, all form elements inside it become disabled — and :disabled will match all of them.',
        html: `<form>
  <input type="text" placeholder="Your name" />
  <input type="email" placeholder="Email" />
  <input type="text" placeholder="Company (optional)" disabled />
  <select disabled>
    <option>Select country</option>
  </select>
  <button type="submit">Submit</button>
  <button type="button" disabled>Save Draft</button>
</form>`,
        task: 'Select all disabled form elements.',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 3 && arr.every((el) => el.disabled);
        },
        hint: 'Use :disabled',
        successMessage: '3 disabled elements selected!'
      },
      {
        id: 'empty',
        title: ':empty',
        explanation: [
          '<code>:empty</code> selects elements that have <strong>no children at all</strong> — no text content, no child elements, nothing. Even a single space prevents it from matching.',
          'This is useful for hiding placeholder containers that have no content yet, or finding empty table cells in data grids.',
          'Note: an HTML comment inside an element makes it non-empty according to the spec, though browser behaviour can vary.'
        ],
        syntax: ':empty',
        examples: [
          { selector: 'div:empty', meaning: 'Divs with no content at all' },
          { selector: 'td:empty', meaning: 'Empty table cells' },
          { selector: 'p:empty', meaning: 'Paragraph tags with no content' }
        ],
        tip: 'Even whitespace between tags makes an element non-empty in some contexts. Use HTML minification or trim whitespace carefully.',
        html: `<ul class="notifications">
  <li>New message from Alice</li>
  <li></li>
  <li>Your upload completed</li>
  <li></li>
  <li>Meeting starts in 10 minutes</li>
</ul>`,
        task: 'Select the empty list items.',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => el.innerHTML.trim() === '');
        },
        hint: 'Use li:empty',
        successMessage: '2 empty items selected!'
      },
      {
        id: 'has',
        title: ':has() — The Parent Selector',
        explanation: [
          '<code>:has()</code> is one of the most powerful CSS selectors ever added. It lets you select a <strong>parent element based on what it contains</strong>.',
          'Before <code>:has()</code>, CSS could only select elements based on their own properties or their ancestors — never based on their children. Now you can.',
          '<code>div:has(img)</code> selects any <code>&lt;div&gt;</code> that contains an <code>&lt;img&gt;</code> inside it. <code>li:has(.badge)</code> selects list items that contain a badge element inside.',
          'It works with any selector inside: <code>section:has(h2 + p)</code> selects sections where a paragraph immediately follows a heading.'
        ],
        syntax: 'parent:has(child-selector)',
        examples: [
          { selector: 'div:has(img)', meaning: 'Any div that contains an image' },
          { selector: 'li:has(a)', meaning: 'List items that contain a link' },
          { selector: 'section:has(h2)', meaning: 'Sections that have an h2 heading' },
          { selector: 'div:has(+ .warning)', meaning: 'A div immediately followed by .warning' }
        ],
        tip: 'Supported in all modern browsers since 2023. Check caniuse.com if you need to support older browsers.',
        html: `<ul class="items">
  <li>
    <span>Basic Plan</span>
  </li>
  <li>
    <span>Pro Plan</span>
    <span class="badge">Popular</span>
  </li>
  <li>
    <span>Enterprise Plan</span>
    <span class="badge">New</span>
  </li>
</ul>`,
        task: 'Select the list items that contain a badge.',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => el.querySelector('.badge'));
        },
        hint: 'Use li:has(.badge)',
        successMessage: '2 items with badges selected!'
      },
      {
        id: 'is-where',
        title: ':is() and :where()',
        explanation: [
          '<code>:is()</code> lets you group selectors without repeating common parts. Instead of writing <code>header a, nav a, footer a</code>, you can write <code>:is(header, nav, footer) a</code>.',
          '<code>:where()</code> works exactly the same way but with <strong>zero specificity</strong>. This makes it easier to override later with simpler selectors.',
          'The key difference: <code>:is(#header .nav a)</code> takes the highest specificity from its argument (100 for the ID). <code>:where(#header .nav a)</code> always contributes 0 specificity, no matter what is inside.'
        ],
        syntax: ':is(sel1, sel2)  :where(sel1, sel2)',
        examples: [
          { selector: ':is(h1, h2, h3)', meaning: 'Any h1, h2, or h3 — same as h1, h2, h3' },
          { selector: ':is(ul, ol) li', meaning: 'List items in either ul or ol' },
          { selector: ':where(.card, .panel) p', meaning: 'Paragraphs in .card or .panel (zero specificity)' }
        ],
        tip: 'Use :where() for base/reset styles that should be easy to override. Use :is() when you want the specificity of the arguments.',
        html: `<div class="page">
  <header>
    <p>Header paragraph</p>
  </header>
  <main>
    <p>Main paragraph one</p>
    <p>Main paragraph two</p>
  </main>
  <footer>
    <p>Footer paragraph</p>
  </footer>
</div>`,
        task: 'Select paragraphs inside header OR footer (not main).',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => el.closest('header') || el.closest('footer'));
        },
        hint: 'Use :is(header, footer) p',
        successMessage: '2 paragraphs selected from header and footer!'
      },
      {
        id: 'root',
        title: ':root',
        explanation: [
          '<code>:root</code> selects the root element of the document — in HTML pages, this is always the <code>&lt;html&gt;</code> element.',
          "It is almost identical to selecting <code>html</code>, but <code>:root</code> has higher specificity (it counts as a pseudo-class, so it scores 10 vs html's score of 1).",
          'The most common use of <code>:root</code> is to define <strong>CSS custom properties</strong> (also called CSS variables) that are available everywhere on the page. For example: <code>:root { --primary-color: #3b82f6; }</code>. You can then use <code>color: var(--primary-color)</code> anywhere.'
        ],
        syntax: ':root',
        examples: [
          { selector: ':root', meaning: 'The <html> element — the root of the document' },
          { selector: ':root { --color: blue }', meaning: 'Define a CSS variable globally' }
        ],
        tip: 'CSS custom properties defined on :root are accessible everywhere in the document. This is the standard pattern for design tokens and theming.',
        html: `<html lang="en">
  <body>
    <div class="page">
      <h1>About :root</h1>
      <p>:root selects the top-level html element.</p>
    </div>
  </body>
</html>`,
        task: 'Select the root element of the document.',
        validate: (els, container) => {
          const arr = Array.from(els);
          return arr.length >= 1;
        },
        hint: 'Use :root',
        successMessage: ':root selected — the html element!'
      }
    ]
  },

  // ── 6. INTERACTIVE STATES ──────────────────────────────────────────────────
  {
    id: 'interactive',
    title: 'Interactive States',
    icon: '🖱️',
    lessons: [
      {
        id: 'hover-active',
        title: ':hover and :active',
        explanation: [
          "<code>:hover</code> matches an element while the user's mouse pointer is over it. It is the most commonly used interactive pseudo-class — used for button colour changes, underlines on links, and dropdown menus.",
          '<code>:active</code> matches an element in the moment it is being activated — for a button, that is while the mouse button is held down. It gives immediate tactile feedback to the user.',
          'These pseudo-classes are time-based and cannot be matched by <code>querySelectorAll()</code> because they depend on live user interaction. The selector syntax is what you need to learn.'
        ],
        syntax: ':hover  :active',
        examples: [
          { selector: 'a:hover', meaning: 'A link while the mouse is over it' },
          { selector: 'button:hover', meaning: 'A button on mouse-over' },
          { selector: 'button:active', meaning: 'A button while being clicked' },
          { selector: '.card:hover .overlay', meaning: 'The overlay inside a card on hover' }
        ],
        tip: 'On touch devices, :hover is simulated on tap. For touch-specific interactions, consider using JavaScript events instead.',
        html: `<div class="ui-demo">
  <a href="#">Hover over this link</a>
  <button class="btn">Hover and click me</button>
  <div class="card">
    <p>Hover over the card</p>
  </div>
</div>`,
        task: 'Type the selector that would target a button while the mouse is over it.',
        validate: (els, container, raw) => raw === 'button:hover',
        hint: 'Combine the tag selector with the :hover pseudo-class.',
        successMessage: 'button:hover — correct! This applies styles when the mouse is over any button.'
      },
      {
        id: 'focus',
        title: ':focus and :focus-within',
        explanation: [
          '<code>:focus</code> matches an element that has received focus — typically by clicking it or navigating to it with the Tab key. It is most commonly used on form inputs, buttons, and links.',
          'A visible focus style is crucial for <strong>keyboard accessibility</strong>. Users who cannot use a mouse navigate by pressing Tab, and need to see which element is currently focused.',
          '<code>:focus-within</code> matches an element if it OR any descendant inside it has focus. This lets you style a whole form row when its input is focused — very useful for custom form designs.'
        ],
        syntax: ':focus  :focus-within',
        examples: [
          { selector: 'input:focus', meaning: 'An input field that is currently focused' },
          { selector: 'button:focus', meaning: 'A button that has keyboard focus' },
          { selector: '.form-row:focus-within', meaning: 'A form row when any input inside it is focused' }
        ],
        tip: 'Never remove focus styles with outline: none without providing an alternative! Use :focus-visible instead to show focus only for keyboard navigation.',
        html: `<form>
  <div class="form-row">
    <label>Name</label>
    <input type="text" placeholder="Your name" />
  </div>
  <div class="form-row">
    <label>Email</label>
    <input type="email" placeholder="Your email" />
  </div>
  <button type="submit">Send</button>
</form>`,
        task: 'Type the selector that highlights the whole form row when any input inside it is focused.',
        validate: (els, container, raw) => raw === '.form-row:focus-within',
        hint: 'Use :focus-within on the .form-row container.',
        successMessage: '.form-row:focus-within — this styles the entire row when its input is active!'
      },
      {
        id: 'focus-visible',
        title: ':focus-visible',
        explanation: [
          '<code>:focus-visible</code> is a smarter version of <code>:focus</code>. It only matches when the browser decides the focus indicator should be visible — typically for keyboard navigation, not mouse clicks.',
          'The problem with <code>:focus</code> is that it shows focus rings when you click buttons with a mouse, which many designers find visually noisy. But removing focus styles entirely breaks keyboard accessibility.',
          '<code>:focus-visible</code> solves this: it shows the focus ring when navigating by keyboard (Tab key), but not when clicking with a mouse. This is the modern recommended approach.'
        ],
        syntax: ':focus-visible',
        examples: [
          { selector: 'button:focus-visible', meaning: 'Button focused via keyboard only' },
          { selector: 'a:focus-visible', meaning: 'Link focused via keyboard only' },
          { selector: ':focus:not(:focus-visible)', meaning: 'Focus from mouse only (to hide ring)' }
        ],
        tip: 'The modern pattern: remove default outline with :focus { outline: none } and add it back with :focus-visible { outline: 2px solid blue }.',
        html: `<div class="button-group">
  <button>Button One</button>
  <button>Button Two</button>
  <a href="#">A link</a>
</div>`,
        task: 'Type the selector for buttons that are focused via keyboard navigation.',
        validate: (els, container, raw) => raw === 'button:focus-visible',
        hint: 'Combine button with :focus-visible',
        successMessage: 'button:focus-visible — the accessible way to style keyboard focus!'
      },
      {
        id: 'link-states',
        title: ':link and :visited',
        explanation: [
          'These two pseudo-classes apply specifically to <code>&lt;a&gt;</code> elements (links).',
          '<code>:link</code> matches links that have NOT been visited yet. <code>:visited</code> matches links the user has already clicked — the browser keeps track of visited URLs in its history.',
          'For privacy reasons, browsers heavily restrict what CSS you can change with <code>:visited</code>. You can only change colour-related properties (color, background-color, border-color, outline-color). No layout, no background-image, no font changes.'
        ],
        syntax: ':link  :visited',
        examples: [
          { selector: 'a:link', meaning: 'Unvisited links' },
          { selector: 'a:visited', meaning: 'Already-visited links' },
          { selector: 'nav a:link', meaning: 'Unvisited links inside the nav' }
        ],
        tip: 'The classic order for link styles is LVHA: :link, :visited, :hover, :active. This order matters because of CSS specificity and cascade.',
        html: `<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/blog">Blog</a>
  <a href="/contact">Contact</a>
</nav>`,
        task: 'Type the selector that matches all unvisited links.',
        validate: (els, container, raw) => raw === 'a:link',
        hint: 'Use the :link pseudo-class on the a element.',
        successMessage: 'a:link — targets all unvisited links on the page!'
      }
    ]
  },

  // ── 7. PSEUDO-ELEMENTS ─────────────────────────────────────────────────────
  {
    id: 'pseudo-elements',
    title: 'Pseudo-elements',
    icon: '✨',
    lessons: [
      {
        id: 'pseudo-vs-class',
        title: 'Pseudo-class vs Pseudo-element',
        explanation: [
          'So far you have learned pseudo-<strong>classes</strong> (with a single colon <code>:</code>) like <code>:hover</code>, <code>:nth-child()</code>, and <code>:not()</code>. These select existing elements based on their state or position.',
          'Pseudo-<strong>elements</strong> use a double colon <code>::</code> and are fundamentally different — they let you style or select a <strong>part of an element</strong> that is not a real HTML element in the DOM.',
          "For example, <code>::first-line</code> targets only the first line of a paragraph — not a tag you wrote, but a virtual fragment the browser creates. <code>::before</code> inserts a virtual child before the element's content.",
          'The double colon <code>::</code> is the modern standard. Single colon <code>:before</code> was the old CSS2 syntax and still works in most browsers, but <code>::before</code> is correct.'
        ],
        syntax: '::pseudo-element  (double colon)',
        examples: [
          { selector: ':hover', meaning: 'Pseudo-CLASS — selects an element by state (single colon)' },
          { selector: '::before', meaning: 'Pseudo-ELEMENT — inserts a virtual element (double colon)' },
          { selector: '::first-line', meaning: 'Pseudo-ELEMENT — targets part of an element' }
        ],
        tip: 'Memory trick: single colon (:) = filter/state for existing elements. Double colon (::) = create or target a fragment.',
        html: `<article>
  <p>This is the first paragraph. It has two lines of content to demonstrate the ::first-line selector.</p>
  <p class="special">This paragraph is special.</p>
</article>`,
        task: 'Type the correct syntax for a pseudo-element that targets text before an element.',
        validate: (els, container, raw) => raw === '::before' || raw === 'p::before',
        hint: 'Pseudo-elements use a double colon. The one that inserts content before an element is called "before".',
        successMessage: '::before — a pseudo-element, not a real DOM node!'
      },
      {
        id: 'before-after',
        title: '::before and ::after',
        explanation: [
          '<code>::before</code> and <code>::after</code> insert a virtual child element <strong>before</strong> or <strong>after</strong> an element\'s content. They require the <code>content</code> CSS property (even if it\'s empty: <code>content: ""</code>).',
          'They are not real HTML elements — they cannot be selected by JavaScript or appear in the DOM inspector under their own tag. But they are rendered on screen.',
          'Common uses: decorative icons or symbols, quotation marks around blockquotes, clearfix hacks, custom bullets, badge indicators, and UI embellishments that would otherwise require extra HTML.',
          'Since pseudo-elements are not in the DOM, <code>querySelectorAll("::before")</code> always throws an error — this is expected behaviour.'
        ],
        syntax: 'element::before  element::after',
        examples: [
          { selector: 'p::before { content: "→ " }', meaning: 'Adds an arrow before every paragraph' },
          { selector: '.price::before { content: "$" }', meaning: 'Adds $ sign before prices' },
          { selector: '.required::after { content: " *" }', meaning: 'Adds asterisk after required labels' }
        ],
        tip: 'content: "" is the minimum needed to make ::before/::after appear. You can use any string, emoji, or even attr() to pull from an attribute.',
        html: `<ul class="feature-list">
  <li>Unlimited storage</li>
  <li>24/7 support</li>
  <li>Custom domain</li>
</ul>`,
        task: 'Type the selector that inserts content after each list item.',
        validate: (els, container, raw) => raw === 'li::after',
        hint: 'Use the li element with the ::after pseudo-element.',
        successMessage: 'li::after — you can now add decorations after each list item with CSS!'
      },
      {
        id: 'placeholder-selection',
        title: '::placeholder and ::selection',
        explanation: [
          '<code>::placeholder</code> targets the placeholder text shown in an input or textarea when it is empty. You can style its colour, font, and opacity.',
          '<code>::selection</code> targets the portion of text that the user has highlighted with their mouse or keyboard. You can change the background colour and text colour of selected text.',
          'These two pseudo-elements are very practical for polishing UI details. Note: browsers often apply reduced opacity to placeholder text by default — <code>::placeholder { opacity: 1 }</code> restores full colour.'
        ],
        syntax: 'input::placeholder  ::selection',
        examples: [
          { selector: 'input::placeholder', meaning: 'The placeholder text in input fields' },
          { selector: 'textarea::placeholder', meaning: 'The placeholder text in textareas' },
          { selector: '::selection', meaning: 'Text the user has highlighted on the page' },
          { selector: 'p::selection', meaning: 'Selected text inside paragraphs' }
        ],
        tip: 'For ::placeholder, you can only style color, opacity, font properties, and a few others. Layout properties have no effect.',
        html: `<form>
  <input type="text" placeholder="Type your name here…" />
  <input type="email" placeholder="your@email.com" />
  <textarea placeholder="Write your message…"></textarea>
</form>`,
        task: 'Type the selector that targets the placeholder text in all input fields.',
        validate: (els, container, raw) => raw === 'input::placeholder',
        hint: 'Use the input element with the ::placeholder pseudo-element.',
        successMessage: 'input::placeholder — now you can style placeholder text colour and font!'
      },
      {
        id: 'first-line-letter',
        title: '::first-line and ::first-letter',
        explanation: [
          '<code>::first-line</code> targets only the first rendered line of a block element like a paragraph. When the browser wraps text, only the first visible line is styled — if the window resizes and the first line changes, the style follows automatically.',
          '<code>::first-letter</code> targets the very first character of a block element. This is used to create the classic <strong>drop cap</strong> effect seen in print design — making the first letter of an article larger and floated.',
          'Both pseudo-elements only work on block-level elements (divs, paragraphs, headings). They have no effect on inline elements.'
        ],
        syntax: 'element::first-line  element::first-letter',
        examples: [
          { selector: 'p::first-line', meaning: 'The first rendered line of a paragraph' },
          { selector: 'article p::first-letter', meaning: 'The first letter of paragraphs in an article' },
          { selector: 'h1::first-letter', meaning: 'The first letter of a heading' }
        ],
        tip: '::first-letter only allows a subset of CSS properties: font, color, background, margins, padding, borders, and float.',
        html: `<article>
  <p>Once upon a time in a land far away, there was a developer who wanted to learn CSS. They studied selectors every day and became a wizard of the stylesheet arts.</p>
  <p>The second paragraph begins here and also has a first line and a first letter.</p>
</article>`,
        task: 'Type the selector that targets only the first letter of every paragraph.',
        validate: (els, container, raw) => raw === 'p::first-letter',
        hint: 'Use p with the ::first-letter pseudo-element.',
        successMessage: 'p::first-letter — great for drop cap effects in articles!'
      }
    ]
  },

  // ── 8. REAL WORLD ──────────────────────────────────────────────────────────
  {
    id: 'real-world',
    title: 'Real World',
    icon: '🌍',
    lessons: [
      {
        id: 'combining',
        title: 'Combining Selectors',
        explanation: [
          'Real-world selectors almost never use just one technique — they combine multiple selectors to target exactly the right element.',
          'You can chain any of the selectors you have learned: <code>.nav > ul > li:not(.divider) a</code> means "links inside direct list items (that are not dividers) inside a direct ul inside .nav".',
          'Read complex selectors <strong>right to left</strong>: start with what you are selecting, then read each condition backwards: "links, that are inside list items, that are not .divider, that are direct children of ul, that is inside .nav".'
        ],
        syntax: 'Mix and match everything!',
        examples: [
          { selector: '.card:not(.disabled) .btn', meaning: 'Buttons inside non-disabled cards' },
          { selector: 'table tr:nth-child(even) td', meaning: 'Cells in even table rows' },
          { selector: 'ul > li:first-child > a', meaning: 'Links in the first list item' }
        ],
        tip: 'Avoid being too specific. .nav a is usually better than .site-header .nav ul li a — it still works when the HTML changes slightly.',
        html: `<div class="product-grid">
  <div class="product card">
    <h3>Laptop Pro</h3>
    <p class="price">$1,299</p>
    <button class="btn buy-btn">Add to Cart</button>
  </div>
  <div class="product card out-of-stock">
    <h3>Wireless Mouse</h3>
    <p class="price">$49</p>
    <button class="btn buy-btn" disabled>Out of Stock</button>
  </div>
  <div class="product card">
    <h3>USB Hub</h3>
    <p class="price">$35</p>
    <button class="btn buy-btn">Add to Cart</button>
  </div>
</div>`,
        task: 'Select the buy buttons inside cards that are NOT out of stock.',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => !el.closest('.out-of-stock'));
        },
        hint: 'Combine :not() with a descendant selector. The card has the .out-of-stock class.',
        successMessage: '2 available buy buttons selected!'
      },
      {
        id: 'specificity',
        title: 'Understanding Specificity',
        explanation: [
          'When two selectors target the same element, the browser needs to decide which one wins. The answer is <strong>specificity</strong> — a scoring system.',
          'Each part of a selector gets a score: <strong>IDs score 100</strong>, <strong>classes / attributes / pseudo-classes score 10</strong>, <strong>tags / pseudo-elements score 1</strong>. Add up the scores of all parts.',
          'Examples: <code>p</code> = 1. <code>.card</code> = 10. <code>#header</code> = 100. <code>.card p</code> = 11. <code>#header .nav a</code> = 111.',
          'The higher the specificity, the more that selector wins in conflicts. Inline styles (style="…") score 1000. <code>!important</code> overrides everything — use sparingly.'
        ],
        syntax: 'ID(100) + Class/Attr/PseudoClass(10) + Tag/PseudoElement(1)',
        examples: [
          { selector: 'p', meaning: 'Specificity: 1' },
          { selector: '.card p', meaning: 'Specificity: 11 (10 + 1)' },
          { selector: '#hero .title', meaning: 'Specificity: 110 (100 + 10)' },
          { selector: 'div.card > p.text', meaning: 'Specificity: 22 (1+10+1+10)' }
        ],
        tip: 'If you find yourself fighting specificity battles, it usually means your selectors are too nested. Keep selectors flat with clear class names.',
        html: `<div id="sidebar" class="panel">
  <h3 class="title">Related Posts</h3>
  <ul class="post-list">
    <li class="post-item">Getting Started</li>
    <li class="post-item featured">Advanced Tips</li>
    <li class="post-item">Best Practices</li>
  </ul>
</div>`,
        task: 'Select the featured post using a selector that includes both the ID and the class.',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 1 && arr[0].classList.contains('featured');
        },
        hint: 'Try #sidebar .featured — the ID gives you high specificity.',
        successMessage: 'Featured post selected with high specificity!'
      },
      {
        id: 'nav-patterns',
        title: 'Navigation Patterns',
        explanation: [
          'Navigation menus are one of the most common UI components, and selectors are essential for styling them correctly. You typically need to style: the active page link differently, the first/last items, and dropdown sub-menus.',
          'The <code>.active</code> class pattern is very common — the current page link gets this class. Combined with combinators, you can select siblings of the active item, or style sub-menus that appear after the active item.',
          'Real navigation HTML often has nested lists: the top-level <code>&lt;ul&gt;</code> has <code>&lt;li&gt;</code> items, and dropdown menus are a nested <code>&lt;ul&gt;</code> inside a top-level <code>&lt;li&gt;</code>.'
        ],
        syntax: 'nav > ul > li.active ~ li',
        examples: [
          { selector: 'nav a.active', meaning: 'The active navigation link' },
          { selector: '.nav > li:first-child', meaning: 'The first top-level nav item' },
          { selector: '.nav li li', meaning: 'Links inside a dropdown (nested li)' },
          { selector: '.nav li:hover > ul', meaning: 'Dropdown that appears on hover' }
        ],
        tip: 'Using li:not(:last-child) to add a divider/border between nav items is cleaner than adding it to all items and then removing it from the last.',
        html: `<nav class="main-nav">
  <ul>
    <li><a href="/">Home</a></li>
    <li class="active"><a href="/products">Products</a>
      <ul class="dropdown">
        <li><a href="/products/laptops">Laptops</a></li>
        <li><a href="/products/phones">Phones</a></li>
      </ul>
    </li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>`,
        task: 'Select only the dropdown links (the nested list items inside .active).',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => el.tagName === 'A' && el.closest('.dropdown'));
        },
        hint: 'Use .dropdown a to select links inside the dropdown.',
        successMessage: '2 dropdown links selected!'
      },
      {
        id: 'form-patterns',
        title: 'Form Styling Patterns',
        explanation: [
          'Forms are complex UI components with many interactive states. CSS selectors let you style them without JavaScript for many common scenarios.',
          'A useful pattern is styling required fields, invalid inputs, and form rows that contain a focused input — all without any JavaScript.',
          '<code>input:required</code> matches inputs with the required attribute. <code>input:invalid</code> matches inputs with invalid values (like an email field with no @ sign). <code>input:valid</code> matches valid ones.',
          'Combine these with sibling selectors: <code>input:invalid + .error-msg</code> shows an error message only when the input is invalid.'
        ],
        syntax: ':required  :optional  :valid  :invalid',
        examples: [
          { selector: 'input:required', meaning: 'Inputs with the required attribute' },
          { selector: 'input:invalid', meaning: 'Inputs with currently invalid values' },
          { selector: 'input:valid', meaning: 'Inputs with currently valid values' },
          { selector: '.form-group:has(input:required)', meaning: 'Form groups containing a required input' }
        ],
        tip: ':invalid triggers immediately on page load for empty required fields. Use :user-invalid (newer) to only show errors after the user has interacted.',
        html: `<form class="signup-form">
  <div class="form-group">
    <label>Name <span class="req">*</span></label>
    <input type="text" required placeholder="Required field" />
  </div>
  <div class="form-group">
    <label>Website</label>
    <input type="url" placeholder="Optional field" />
  </div>
  <div class="form-group">
    <label>Email <span class="req">*</span></label>
    <input type="email" required placeholder="Required field" />
  </div>
</form>`,
        task: 'Select only the required form inputs.',
        validate: (els) => {
          const arr = Array.from(els);
          return arr.length === 2 && arr.every((el) => el.required);
        },
        hint: 'Use input:required',
        successMessage: '2 required inputs selected — no JavaScript needed!'
      },
      {
        id: 'table-patterns',
        title: 'Table Styling Patterns',
        explanation: [
          'Tables are a great use case for structural selectors. Without adding any classes to the HTML, you can create sophisticated table styles.',
          'The combination of <code>tr:nth-child(even)</code> for zebra striping, <code>th</code> for header cells, <code>tr:last-child td</code> for the last row, and <code>td:first-child</code> for the first column gives you full control.',
          'For responsive tables, <code>table td:before { content: attr(data-label) }</code> is a common trick to show column labels on mobile when the table is displayed as a block.'
        ],
        syntax: 'tr:nth-child(even)  td:first-child  th',
        examples: [
          { selector: 'thead th', meaning: 'Header cells only' },
          { selector: 'tbody tr:nth-child(even) td', meaning: 'Cells in even body rows' },
          { selector: 'td:first-child', meaning: 'First column cells' },
          { selector: 'tr:last-child td', meaning: 'All cells in the last row' }
        ],
        tip: 'Use td:not(:last-child) to add right borders between columns without a border on the last column.',
        html: `<table class="data-table">
  <thead>
    <tr>
      <th>Name</th><th>Role</th><th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Alice</td><td>Developer</td><td>Active</td></tr>
    <tr><td>Bob</td><td>Designer</td><td>Away</td></tr>
    <tr><td>Carol</td><td>Manager</td><td>Active</td></tr>
    <tr><td>Dave</td><td>QA</td><td>Active</td></tr>
  </tbody>
</table>`,
        task: 'Select all cells in the first column of the table body.',
        validate: (els) => {
          const arr = Array.from(els);
          return (
            arr.length === 4 &&
            arr.every((el) => {
              const siblings = Array.from(el.parentElement.children);
              return siblings.indexOf(el) === 0 && el.tagName === 'TD';
            })
          );
        },
        hint: 'Use tbody td:first-child',
        successMessage: '4 first-column cells selected!'
      }
    ]
  }
];

export const ALL_LESSONS = CHAPTERS.flatMap((ch) =>
  ch.lessons.map((l) => ({ ...l, chapterId: ch.id, chapterTitle: ch.title, chapterIcon: ch.icon }))
);
