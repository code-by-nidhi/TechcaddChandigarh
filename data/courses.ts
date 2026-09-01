import { site } from "./site";

export type CourseCategoryId =
  | "ai"
  | "programming"
  | "web"
  | "marketing"
  | "cyber-cloud"
  | "cad"
  | "office";

export type CourseBadge = "Hot" | "New" | "Trending";

export interface CourseModule {
  title: string;
  topics: string[];
}

export interface Course {
  /** Short identifier, e.g. "python" — every slug is derived from this. */
  id: string;
  name: string;
  category: CourseCategoryId;
  duration: string;
  level: "Beginner" | "Beginner to Advanced" | "Intermediate" | "Advanced";
  summary: string;
  badge?: CourseBadge;
  featured?: boolean;
  /** Also publish a `<id>-training-in-<city>` page, as the flagship tracks do. */
  training?: boolean;
  tools: string[];
  modules: CourseModule[];
  outcomes: string[];
  careers: string[];
  fee?: { original: number; offer: number };
}

export interface CourseCategory {
  id: CourseCategoryId;
  name: string;
  short: string;
  blurb: string;
  icon: string;
}

export const courseCategories: CourseCategory[] = [
  {
    id: "ai",
    name: "Artificial Intelligence & Data",
    short: "AI & Data",
    blurb:
      "Generative AI, agents, machine learning, analytics and the data stack that sits underneath all of it.",
    icon: "sparkles",
  },
  {
    id: "programming",
    name: "Programming Languages",
    short: "Programming",
    blurb:
      "The fundamentals every other track builds on — syntax, data structures and problem solving.",
    icon: "code",
  },
  {
    id: "web",
    name: "Full-Stack & App Development",
    short: "Development",
    blurb:
      "Ship real products: front-end, back-end, databases, deployment and mobile apps.",
    icon: "layers",
  },
  {
    id: "marketing",
    name: "Digital Marketing",
    short: "Marketing",
    blurb:
      "Run live campaigns with real budgets — SEO, ads, social, analytics and AI-assisted content.",
    icon: "megaphone",
  },
  {
    id: "cyber-cloud",
    name: "Cyber Security & Cloud",
    short: "Cyber & Cloud",
    blurb:
      "Pentest labs, blue-team tooling, AWS/Azure and the DevOps pipeline that ties them together.",
    icon: "shield",
  },
  {
    id: "cad",
    name: "CAD, CAM & Design",
    short: "CAD & Design",
    blurb: "Drafting and modelling for civil, mechanical and architectural roles.",
    icon: "compass",
  },
  {
    id: "office",
    name: "Basic Computer & Office",
    short: "Basics & Office",
    blurb:
      "Computer fundamentals, accounting and productivity skills for immediate office roles.",
    icon: "monitor",
  },
];

/** Slug helpers keep every generated URL consistent with the city. */
export const courseSlug = (id: string) => `${id}-course-in-${site.citySlug}`;
export const trainingSlug = (id: string) => `${id}-training-in-${site.citySlug}`;

export const courses: Course[] = [
  /* ------------------------------ AI & DATA ------------------------------ */
  {
    id: "artificial-intelligence",
    name: "Artificial Intelligence (AI)",
    category: "ai",
    duration: "3 – 6 months",
    level: "Beginner to Advanced",
    summary:
      "Start from Python and statistics, then build and deploy real machine learning and deep learning systems end to end.",
    badge: "Hot",
    featured: true,
    training: true,
    tools: ["Python", "NumPy", "Pandas", "scikit-learn", "TensorFlow", "PyTorch", "Hugging Face"],
    modules: [
      { title: "Foundations", topics: ["Python for AI", "NumPy & Pandas", "Statistics & probability", "Data cleaning"] },
      { title: "Machine Learning", topics: ["Regression & classification", "Trees & ensembles", "Model evaluation", "Feature engineering"] },
      { title: "Deep Learning", topics: ["Neural networks", "CNNs for vision", "RNNs & transformers", "Transfer learning"] },
      { title: "Generative AI", topics: ["LLM fundamentals", "Prompting patterns", "Embeddings & RAG", "Fine-tuning basics"] },
      { title: "Deployment", topics: ["FastAPI serving", "Streamlit apps", "Docker packaging", "Cloud deployment"] },
      { title: "Capstone", topics: ["Live client project", "Mentor code review", "Portfolio & GitHub", "Interview prep"] },
    ],
    outcomes: [
      "Build and evaluate production-grade ML models",
      "Ship an LLM-powered application with retrieval",
      "Explain model decisions to non-technical stakeholders",
      "Leave with 3+ deployed projects on your GitHub",
    ],
    careers: ["AI Engineer", "Machine Learning Engineer", "Data Scientist", "AI Product Analyst"],
    fee: { original: 70000, offer: 55000 },
  },
  {
    id: "generative-ai",
    name: "Generative AI",
    category: "ai",
    duration: "2 – 3 months",
    level: "Intermediate",
    summary:
      "Work hands-on with large language models, diffusion models and the tooling teams actually ship with.",
    badge: "Hot",
    featured: true,
    tools: ["OpenAI", "Anthropic", "LangChain", "Hugging Face", "Stable Diffusion", "Streamlit"],
    modules: [
      { title: "LLM Fundamentals", topics: ["Tokens & context", "Model families", "Cost & latency", "Evaluation"] },
      { title: "Prompt Engineering", topics: ["System prompts", "Few-shot patterns", "Structured output", "Guardrails"] },
      { title: "Retrieval", topics: ["Embeddings", "Vector databases", "Chunking strategy", "RAG pipelines"] },
      { title: "Image & Audio", topics: ["Diffusion models", "ControlNet", "Speech to text", "Voice synthesis"] },
      { title: "Ship It", topics: ["Chat interfaces", "Streaming responses", "Caching", "Deployment"] },
    ],
    outcomes: [
      "Design prompts that hold up in production",
      "Build a document-grounded chatbot with citations",
      "Compare model providers on cost and quality",
      "Deploy a generative app users can actually try",
    ],
    careers: ["Generative AI Developer", "AI Application Engineer", "Prompt Engineer", "AI Consultant"],
    fee: { original: 55000, offer: 42000 },
  },
  {
    id: "agentic-ai",
    name: "Agentic AI",
    category: "ai",
    duration: "3 months",
    level: "Advanced",
    summary:
      "Build autonomous agents that plan, call tools, use memory and complete multi-step work reliably.",
    badge: "New",
    featured: true,
    training: true,
    tools: ["LangGraph", "LangChain", "MCP", "OpenAI", "Anthropic", "Pinecone"],
    modules: [
      { title: "Agent Basics", topics: ["The ReAct loop", "Tool calling", "Planning vs reacting", "Failure modes"] },
      { title: "Tooling", topics: ["Function schemas", "MCP servers", "API integration", "Sandboxing"] },
      { title: "Memory & State", topics: ["Short vs long-term memory", "Vector recall", "State machines", "Checkpointing"] },
      { title: "Multi-Agent", topics: ["Orchestration patterns", "Hand-offs", "Critique loops", "Cost control"] },
      { title: "Reliability", topics: ["Evals & tracing", "Guardrails", "Human-in-the-loop", "Observability"] },
    ],
    outcomes: [
      "Ship an agent that completes real multi-step tasks",
      "Instrument agents with traces and evaluations",
      "Design safe tool access and approval flows",
      "Control token spend on long-running agents",
    ],
    careers: ["Agentic AI Engineer", "AI Automation Engineer", "LLM Ops Engineer", "Solutions Architect"],
    fee: { original: 65000, offer: 52000 },
  },
  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    category: "ai",
    duration: "6 weeks",
    level: "Beginner",
    summary:
      "Get repeatable, reliable output from AI tools — for engineering, marketing, support and operations work.",
    tools: ["ChatGPT", "Claude", "Gemini", "Midjourney", "Notion AI"],
    modules: [
      { title: "How Models Think", topics: ["Tokens & limits", "Temperature", "Hallucination", "Model selection"] },
      { title: "Core Patterns", topics: ["Role & context", "Few-shot examples", "Chain of thought", "Decomposition"] },
      { title: "Structured Output", topics: ["JSON schemas", "Tables & templates", "Validation", "Retries"] },
      { title: "Workflows", topics: ["Prompt chaining", "Reusable libraries", "Team playbooks", "Evaluation rubrics"] },
    ],
    outcomes: [
      "Write prompts that produce consistent, checkable output",
      "Build a reusable prompt library for your team",
      "Automate repetitive writing and analysis work",
      "Evaluate AI output critically instead of trusting it",
    ],
    careers: ["Prompt Engineer", "AI Content Specialist", "Automation Analyst", "AI Trainer"],
  },
  {
    id: "chatgpt-ai-tools",
    name: "ChatGPT & AI Tools",
    category: "ai",
    duration: "4 – 6 weeks",
    level: "Beginner",
    summary:
      "A practical tour of the AI tools that save hours every week across writing, design, data and admin work.",
    badge: "Hot",
    tools: ["ChatGPT", "Claude", "Canva AI", "Perplexity", "Zapier", "Excel Copilot"],
    modules: [
      { title: "Everyday AI", topics: ["Research & summarising", "Email & documents", "Meeting notes", "Fact checking"] },
      { title: "Creative Tools", topics: ["Image generation", "Presentation decks", "Video scripts", "Brand voice"] },
      { title: "Data Work", topics: ["Spreadsheet formulas", "Chart generation", "Cleaning messy data", "Reporting"] },
      { title: "Automation", topics: ["No-code workflows", "Triggers & actions", "Custom GPTs", "Team rollout"] },
    ],
    outcomes: [
      "Cut hours of routine work each week",
      "Produce on-brand content quickly",
      "Automate a real workflow end to end",
      "Know which tool fits which job",
    ],
    careers: ["AI Generalist", "Executive Assistant", "Content Creator", "Operations Associate"],
  },
  {
    id: "rag-development",
    name: "RAG (Retrieval-Augmented Generation)",
    category: "ai",
    duration: "6 – 8 weeks",
    level: "Advanced",
    summary:
      "Ground language models in your own documents and data so answers are accurate, current and cited.",
    badge: "Trending",
    tools: ["LangChain", "LlamaIndex", "Pinecone", "pgvector", "FastAPI", "Redis"],
    modules: [
      { title: "Retrieval Basics", topics: ["Embeddings", "Similarity search", "Chunking", "Metadata filters"] },
      { title: "Vector Stores", topics: ["Pinecone & Qdrant", "pgvector", "Indexing strategy", "Scaling"] },
      { title: "Pipelines", topics: ["Ingestion jobs", "Re-ranking", "Hybrid search", "Citations"] },
      { title: "Quality", topics: ["Eval datasets", "Groundedness scoring", "Latency tuning", "Caching"] },
    ],
    outcomes: [
      "Build a document Q&A system with source citations",
      "Tune chunking and re-ranking for real accuracy gains",
      "Measure groundedness instead of guessing",
      "Deploy a RAG API that survives production load",
    ],
    careers: ["RAG Engineer", "AI Backend Developer", "Search Engineer", "ML Engineer"],
  },
  {
    id: "ai-powered-marketing",
    name: "AI-Powered Marketing",
    category: "ai",
    duration: "2 months",
    level: "Intermediate",
    summary:
      "Use AI across the funnel — research, creative, copy, targeting and reporting — on live campaigns.",
    badge: "Trending",
    tools: ["ChatGPT", "Meta Ads", "Google Ads", "Canva AI", "HubSpot", "GA4"],
    modules: [
      { title: "AI Research", topics: ["Audience insight", "Competitor teardown", "Keyword clustering", "Offer testing"] },
      { title: "Creative at Scale", topics: ["Ad copy variants", "Image generation", "Video hooks", "Brand guardrails"] },
      { title: "Campaigns", topics: ["Meta & Google setup", "Audience building", "Budget pacing", "Creative testing"] },
      { title: "Measurement", topics: ["GA4 events", "Attribution", "AI reporting", "Iteration loops"] },
    ],
    outcomes: [
      "Run a live campaign with real budget and AI creative",
      "Produce weeks of content in a single session",
      "Report on performance with clear attribution",
      "Build an AI marketing SOP for a team",
    ],
    careers: ["Performance Marketer", "AI Marketing Specialist", "Growth Analyst", "Brand Strategist"],
  },
  {
    id: "machine-learning",
    name: "Machine Learning",
    category: "ai",
    duration: "3 months",
    level: "Intermediate",
    summary:
      "The full modelling workflow — from a messy CSV to a validated, deployed and monitored model.",
    tools: ["Python", "scikit-learn", "XGBoost", "MLflow", "Jupyter", "Docker"],
    modules: [
      { title: "Maths You Need", topics: ["Linear algebra", "Probability", "Optimisation", "Bias & variance"] },
      { title: "Supervised Learning", topics: ["Linear & logistic", "SVM & kNN", "Random forest", "Gradient boosting"] },
      { title: "Unsupervised Learning", topics: ["Clustering", "PCA", "Anomaly detection", "Recommenders"] },
      { title: "MLOps", topics: ["Experiment tracking", "Pipelines", "Model registry", "Drift monitoring"] },
    ],
    outcomes: [
      "Choose the right algorithm for a business problem",
      "Avoid leakage and overfitting in real datasets",
      "Track experiments reproducibly",
      "Deploy and monitor a model in production",
    ],
    careers: ["ML Engineer", "Data Scientist", "Applied Scientist", "Analytics Engineer"],
  },
  {
    id: "deep-learning",
    name: "Deep Learning",
    category: "ai",
    duration: "3 months",
    level: "Advanced",
    summary:
      "Neural network architectures for vision, language and sequence data, trained on real GPU workloads.",
    tools: ["PyTorch", "TensorFlow", "Keras", "OpenCV", "Hugging Face", "CUDA"],
    modules: [
      { title: "Networks", topics: ["Backpropagation", "Activations", "Regularisation", "Optimisers"] },
      { title: "Vision", topics: ["CNN architectures", "Augmentation", "Object detection", "Segmentation"] },
      { title: "Sequences", topics: ["RNN & LSTM", "Attention", "Transformers", "Fine-tuning"] },
      { title: "Scale", topics: ["Mixed precision", "Distributed training", "Model compression", "Serving"] },
    ],
    outcomes: [
      "Train custom vision and language models",
      "Debug training runs that stall or diverge",
      "Fine-tune pretrained transformers on your data",
      "Serve deep models efficiently",
    ],
    careers: ["Deep Learning Engineer", "Computer Vision Engineer", "NLP Engineer", "Research Associate"],
  },
  {
    id: "data-science",
    name: "Data Science",
    category: "ai",
    duration: "6 months",
    level: "Beginner to Advanced",
    summary:
      "Statistics, Python, SQL, visualisation and machine learning combined into a complete analyst-to-scientist path.",
    featured: true,
    training: true,
    tools: ["Python", "SQL", "Pandas", "scikit-learn", "Power BI", "Tableau"],
    modules: [
      { title: "Toolkit", topics: ["Python", "SQL joins & windows", "Excel to Pandas", "Git"] },
      { title: "Statistics", topics: ["Distributions", "Hypothesis testing", "A/B tests", "Regression"] },
      { title: "Visualisation", topics: ["Matplotlib & Seaborn", "Power BI", "Storytelling", "Dashboards"] },
      { title: "Modelling", topics: ["Supervised learning", "Time series", "NLP basics", "Model evaluation"] },
      { title: "Capstone", topics: ["Real dataset", "Stakeholder brief", "Presentation", "Portfolio"] },
    ],
    outcomes: [
      "Answer business questions with data, not opinion",
      "Write SQL that handles real production schemas",
      "Build dashboards leaders actually use",
      "Present findings to a non-technical audience",
    ],
    careers: ["Data Scientist", "Data Analyst", "Business Analyst", "Product Analyst"],
    fee: { original: 70000, offer: 55000 },
  },
  {
    id: "data-analytics",
    name: "Data Analytics",
    category: "ai",
    duration: "3 – 4 months",
    level: "Beginner to Advanced",
    summary:
      "Excel, SQL, Power BI and Python analytics — the fastest route from any background into a data role.",
    featured: true,
    training: true,
    tools: ["Excel", "SQL", "Power BI", "Tableau", "Python", "GA4"],
    modules: [
      { title: "Excel Deep Dive", topics: ["Pivot tables", "Power Query", "Lookup functions", "Dashboards"] },
      { title: "SQL", topics: ["Joins", "Aggregations", "Window functions", "Query tuning"] },
      { title: "BI Tools", topics: ["Power BI modelling", "DAX", "Tableau", "Publishing & sharing"] },
      { title: "Python Analytics", topics: ["Pandas", "Cleaning pipelines", "Automated reports", "Charting"] },
      { title: "Business Cases", topics: ["Sales analysis", "Cohort & retention", "Funnels", "Forecasting"] },
    ],
    outcomes: [
      "Turn raw exports into decision-ready dashboards",
      "Write SQL confidently against unfamiliar databases",
      "Automate a weekly report end to end",
      "Build an analytics portfolio with 4+ case studies",
    ],
    careers: ["Data Analyst", "BI Developer", "MIS Executive", "Reporting Analyst"],
    fee: { original: 45000, offer: 35000 },
  },
  {
    id: "power-bi",
    name: "Power BI",
    category: "ai",
    duration: "6 weeks",
    level: "Beginner",
    summary: "Model data, write DAX and publish dashboards that stay fast as the data grows.",
    tools: ["Power BI", "Power Query", "DAX", "Excel", "SQL Server"],
    modules: [
      { title: "Get Data", topics: ["Connectors", "Power Query", "Cleaning steps", "Refresh schedules"] },
      { title: "Model", topics: ["Star schema", "Relationships", "Calculated columns", "Performance"] },
      { title: "DAX", topics: ["Measures", "Time intelligence", "CALCULATE", "Context transition"] },
      { title: "Publish", topics: ["Report design", "Bookmarks", "Workspaces", "Row-level security"] },
    ],
    outcomes: [
      "Build a star-schema model that performs",
      "Write DAX measures beyond drag-and-drop",
      "Design reports people can read at a glance",
      "Publish and secure reports for a team",
    ],
    careers: ["BI Analyst", "Power BI Developer", "MIS Analyst", "Reporting Specialist"],
  },
  {
    id: "tableau",
    name: "Tableau",
    category: "ai",
    duration: "5 weeks",
    level: "Beginner",
    summary: "Visual analytics from first chart to published interactive dashboard.",
    tools: ["Tableau Desktop", "Tableau Public", "SQL", "Excel"],
    modules: [
      { title: "Foundations", topics: ["Data connections", "Dimensions & measures", "Marks card", "Filters"] },
      { title: "Charts", topics: ["Maps", "Dual axis", "Table calculations", "Reference lines"] },
      { title: "Calculations", topics: ["LOD expressions", "Parameters", "Sets", "Groups"] },
      { title: "Dashboards", topics: ["Layout containers", "Actions", "Story points", "Publishing"] },
    ],
    outcomes: [
      "Design dashboards that answer a question fast",
      "Use LOD expressions with confidence",
      "Publish interactive work to Tableau Public",
      "Build a visual portfolio for interviews",
    ],
    careers: ["Tableau Developer", "Data Visualisation Analyst", "BI Analyst", "Insights Executive"],
  },

  /* ----------------------------- PROGRAMMING ----------------------------- */
  {
    id: "python",
    name: "Python Programming",
    category: "programming",
    duration: "2 – 3 months",
    level: "Beginner to Advanced",
    summary:
      "The language behind AI, automation and back-end work — taught through projects, not slides.",
    featured: true,
    tools: ["Python", "VS Code", "Git", "Flask", "SQLite", "Pytest"],
    modules: [
      { title: "Core Python", topics: ["Syntax & types", "Control flow", "Functions", "Error handling"] },
      { title: "Data Structures", topics: ["Lists & dicts", "Comprehensions", "Sets & tuples", "Complexity"] },
      { title: "OOP & Modules", topics: ["Classes", "Inheritance", "Packages", "Virtual environments"] },
      { title: "Working with Data", topics: ["Files & JSON", "APIs & requests", "SQLite", "Pandas intro"] },
      { title: "Projects", topics: ["Automation scripts", "Web scraping", "Flask API", "Testing with Pytest"] },
    ],
    outcomes: [
      "Write clean, idiomatic Python from scratch",
      "Automate real tasks at work or college",
      "Build and consume REST APIs",
      "Be ready for the AI and data tracks",
    ],
    careers: ["Python Developer", "Automation Engineer", "Backend Developer", "Data Analyst"],
    fee: { original: 30000, offer: 22000 },
  },
  {
    id: "java",
    name: "Java Programming",
    category: "programming",
    duration: "3 months",
    level: "Beginner to Advanced",
    summary:
      "Core Java through to Spring Boot — the enterprise stack that still runs most large systems.",
    tools: ["Java 21", "IntelliJ IDEA", "Maven", "Spring Boot", "MySQL", "JUnit"],
    modules: [
      { title: "Core Java", topics: ["JVM basics", "OOP principles", "Collections", "Exceptions"] },
      { title: "Advanced Java", topics: ["Generics", "Streams & lambdas", "Concurrency", "JDBC"] },
      { title: "Spring Boot", topics: ["Dependency injection", "REST controllers", "JPA & Hibernate", "Validation"] },
      { title: "Delivery", topics: ["Maven builds", "JUnit testing", "Layered architecture", "Deployment"] },
    ],
    outcomes: [
      "Write production-quality object-oriented Java",
      "Build REST services with Spring Boot and JPA",
      "Handle concurrency without deadlocks",
      "Pass the Java rounds in campus interviews",
    ],
    careers: ["Java Developer", "Backend Engineer", "Android Developer", "Software Engineer"],
  },
  {
    id: "c-cpp",
    name: "C & C++ Programming",
    category: "programming",
    duration: "2 months",
    level: "Beginner",
    summary:
      "Memory, pointers and data structures — the base every computer science interview still tests.",
    tools: ["GCC", "VS Code", "GDB", "CMake"],
    modules: [
      { title: "C Foundations", topics: ["Variables & operators", "Loops", "Functions", "Arrays & strings"] },
      { title: "Pointers & Memory", topics: ["Pointer arithmetic", "Dynamic allocation", "Structures", "File I/O"] },
      { title: "C++ & OOP", topics: ["Classes & objects", "Inheritance", "Polymorphism", "Templates"] },
      { title: "DSA", topics: ["Linked lists", "Stacks & queues", "Trees", "Sorting & searching"] },
    ],
    outcomes: [
      "Reason about memory and pointers confidently",
      "Implement core data structures from scratch",
      "Debug segmentation faults systematically",
      "Clear university practicals and placement tests",
    ],
    careers: ["Software Developer", "Embedded Engineer", "Systems Programmer", "Game Developer"],
  },
  {
    id: "kotlin",
    name: "Kotlin",
    category: "programming",
    duration: "6 weeks",
    level: "Intermediate",
    summary: "Modern Android development with Kotlin, coroutines and Jetpack Compose.",
    tools: ["Kotlin", "Android Studio", "Jetpack Compose", "Room", "Retrofit"],
    modules: [
      { title: "Kotlin Language", topics: ["Null safety", "Data classes", "Extensions", "Higher-order functions"] },
      { title: "Coroutines", topics: ["Suspend functions", "Flows", "Structured concurrency", "Error handling"] },
      { title: "Jetpack Compose", topics: ["Composables", "State", "Navigation", "Theming"] },
      { title: "App Data", topics: ["Room database", "Retrofit APIs", "Dependency injection", "Play Store release"] },
    ],
    outcomes: [
      "Build a Compose app from empty project to Play Store",
      "Use coroutines without leaking work",
      "Persist and sync app data reliably",
      "Read and extend an existing Kotlin codebase",
    ],
    careers: ["Android Developer", "Kotlin Developer", "Mobile Engineer", "App Developer"],
  },
  {
    id: "linux",
    name: "Linux Administration",
    category: "programming",
    duration: "6 weeks",
    level: "Beginner",
    summary: "The shell, permissions, networking and services every DevOps and security role assumes you know.",
    tools: ["Ubuntu", "Bash", "systemd", "SSH", "Nginx", "VirtualBox"],
    modules: [
      { title: "Shell", topics: ["Filesystem", "Text processing", "Pipes & redirection", "Bash scripting"] },
      { title: "System Admin", topics: ["Users & permissions", "Package management", "Processes", "systemd services"] },
      { title: "Networking", topics: ["IP & DNS", "SSH", "Firewalls", "Troubleshooting"] },
      { title: "Servers", topics: ["Nginx", "Cron jobs", "Log analysis", "Backups"] },
    ],
    outcomes: [
      "Work fluently at the command line",
      "Automate admin tasks with shell scripts",
      "Diagnose network and service failures",
      "Harden and maintain a Linux server",
    ],
    careers: ["Linux Administrator", "DevOps Engineer", "Support Engineer", "Security Analyst"],
  },

  /* -------------------------- WEB & APP DEVELOPMENT -------------------------- */
  {
    id: "full-stack-development",
    name: "Full-Stack Development",
    category: "web",
    duration: "6 months",
    level: "Beginner to Advanced",
    summary:
      "Front-end, back-end, databases and deployment — build and ship complete products with mentor code review.",
    badge: "Hot",
    featured: true,
    training: true,
    tools: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB", "PostgreSQL", "Git", "Vercel"],
    modules: [
      { title: "Front-End Basics", topics: ["Semantic HTML", "Modern CSS", "Responsive layout", "Accessibility"] },
      { title: "JavaScript", topics: ["ES2023 syntax", "Async & promises", "DOM & events", "Fetch & APIs"] },
      { title: "React", topics: ["Components & hooks", "State management", "Routing", "Forms & validation"] },
      { title: "Back-End", topics: ["Node & Express", "REST design", "Authentication", "File uploads"] },
      { title: "Databases", topics: ["MongoDB", "PostgreSQL", "Schema design", "Indexing"] },
      { title: "Ship & Scale", topics: ["Git workflow", "Testing", "CI/CD", "Deployment & monitoring"] },
    ],
    outcomes: [
      "Build and deploy full products, not just pages",
      "Design REST APIs and database schemas",
      "Work in a real Git branching workflow",
      "Leave with a portfolio of shipped applications",
    ],
    careers: ["Full-Stack Developer", "Front-End Developer", "Backend Developer", "Software Engineer"],
    fee: { original: 75000, offer: 58000 },
  },
  {
    id: "mern-stack",
    name: "MERN Stack",
    category: "web",
    duration: "4 – 6 months",
    level: "Intermediate",
    summary: "MongoDB, Express, React and Node — one language across the entire stack.",
    featured: true,
    training: true,
    tools: ["MongoDB", "Express", "React", "Node.js", "Redux", "JWT", "Vercel"],
    modules: [
      { title: "JavaScript Depth", topics: ["Closures", "Async patterns", "Modules", "Tooling"] },
      { title: "React", topics: ["Hooks", "Context & Redux", "React Router", "Performance"] },
      { title: "Node & Express", topics: ["Middleware", "REST APIs", "JWT auth", "Error handling"] },
      { title: "MongoDB", topics: ["Schema design", "Mongoose", "Aggregation", "Indexes"] },
      { title: "Production", topics: ["Environment config", "Testing", "Deployment", "Monitoring"] },
    ],
    outcomes: [
      "Ship a complete MERN application to production",
      "Implement secure authentication and authorisation",
      "Model data properly in MongoDB",
      "Debug across the whole stack",
    ],
    careers: ["MERN Developer", "Full-Stack Developer", "React Developer", "Node.js Developer"],
  },
  {
    id: "mean-stack",
    name: "MEAN Stack",
    category: "web",
    duration: "4 months",
    level: "Intermediate",
    summary: "Angular-based full-stack development with MongoDB, Express and Node.",
    tools: ["MongoDB", "Express", "Angular", "Node.js", "TypeScript", "RxJS"],
    modules: [
      { title: "TypeScript", topics: ["Types & interfaces", "Generics", "Decorators", "Config"] },
      { title: "Angular", topics: ["Components", "Services & DI", "RxJS", "Reactive forms"] },
      { title: "Back-End", topics: ["Express APIs", "Auth", "Validation", "Testing"] },
      { title: "Delivery", topics: ["Build optimisation", "Lazy loading", "Deployment", "Monitoring"] },
    ],
    outcomes: [
      "Build enterprise-style Angular applications",
      "Use RxJS streams without memory leaks",
      "Connect Angular front-ends to Node APIs",
      "Optimise bundle size for real users",
    ],
    careers: ["Angular Developer", "MEAN Developer", "Front-End Engineer", "Full-Stack Developer"],
  },
  {
    id: "php-full-stack",
    name: "PHP Full Stack",
    category: "web",
    duration: "4 months",
    level: "Beginner to Advanced",
    summary: "Core PHP through Laravel — the stack behind a huge share of working business websites.",
    tools: ["PHP 8", "Laravel", "MySQL", "Composer", "Blade", "Bootstrap"],
    modules: [
      { title: "Core PHP", topics: ["Syntax", "Forms & sessions", "File handling", "OOP in PHP"] },
      { title: "MySQL", topics: ["Schema design", "Joins", "Prepared statements", "Transactions"] },
      { title: "Laravel", topics: ["Routing", "Eloquent ORM", "Blade templates", "Middleware"] },
      { title: "Production", topics: ["Auth scaffolding", "Queues", "Deployment", "Security hardening"] },
    ],
    outcomes: [
      "Build database-driven applications in Laravel",
      "Write secure PHP that resists injection attacks",
      "Design normalised MySQL schemas",
      "Deploy to shared or cloud hosting",
    ],
    careers: ["PHP Developer", "Laravel Developer", "Web Developer", "Backend Developer"],
  },
  {
    id: "python-django-full-stack",
    name: "Python Django Full Stack",
    category: "web",
    duration: "4 – 5 months",
    level: "Intermediate",
    summary: "Batteries-included web development with Django, DRF and PostgreSQL.",
    tools: ["Python", "Django", "Django REST Framework", "PostgreSQL", "Celery", "Docker"],
    modules: [
      { title: "Django Core", topics: ["Models & ORM", "Views & templates", "Forms", "Admin"] },
      { title: "REST APIs", topics: ["Serializers", "Viewsets", "Permissions", "Pagination"] },
      { title: "Front-End", topics: ["Templates & HTMX", "Static files", "React integration", "Auth flows"] },
      { title: "Scale", topics: ["Celery tasks", "Caching", "Docker", "Deployment"] },
    ],
    outcomes: [
      "Ship a Django application with a real admin panel",
      "Build and document REST APIs with DRF",
      "Run background jobs reliably",
      "Containerise and deploy your work",
    ],
    careers: ["Django Developer", "Python Full-Stack Developer", "Backend Engineer", "API Developer"],
  },
  {
    id: "web-development",
    name: "Web Development",
    category: "web",
    duration: "3 months",
    level: "Beginner",
    summary: "From your first HTML file to a deployed, responsive, interactive website.",
    tools: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "Git", "Netlify"],
    modules: [
      { title: "HTML & CSS", topics: ["Semantic markup", "Flexbox & Grid", "Responsive design", "Animations"] },
      { title: "JavaScript", topics: ["Variables & functions", "DOM manipulation", "Events", "Fetch API"] },
      { title: "Tooling", topics: ["Git & GitHub", "Tailwind CSS", "Build tools", "Debugging"] },
      { title: "Launch", topics: ["Performance", "SEO basics", "Accessibility", "Deployment"] },
    ],
    outcomes: [
      "Build responsive sites that work on every screen",
      "Add real interactivity with JavaScript",
      "Use Git and GitHub like a professional",
      "Deploy live sites with custom domains",
    ],
    careers: ["Web Developer", "Front-End Developer", "Freelance Developer", "Web Designer"],
  },
  {
    id: "web-designing",
    name: "Web Designing",
    category: "web",
    duration: "2 – 3 months",
    level: "Beginner",
    summary: "Visual design, UI systems and prototyping — then translate the design into working pages.",
    tools: ["Figma", "Adobe XD", "Photoshop", "HTML", "CSS", "Tailwind CSS"],
    modules: [
      { title: "Design Basics", topics: ["Typography", "Colour theory", "Layout & grids", "Visual hierarchy"] },
      { title: "UI/UX", topics: ["User flows", "Wireframes", "Design systems", "Usability testing"] },
      { title: "Figma", topics: ["Components", "Auto layout", "Variants", "Prototyping"] },
      { title: "To Code", topics: ["HTML structure", "CSS layout", "Responsive breakpoints", "Handoff"] },
    ],
    outcomes: [
      "Design interfaces that look considered, not decorated",
      "Build a reusable component library in Figma",
      "Hand off designs developers can actually build",
      "Produce a design portfolio with 4+ projects",
    ],
    careers: ["Web Designer", "UI Designer", "UX Designer", "Product Designer"],
  },
  {
    id: "wordpress",
    name: "WordPress",
    category: "web",
    duration: "6 weeks",
    level: "Beginner",
    summary: "Build, customise and maintain client websites without writing an application from scratch.",
    tools: ["WordPress", "Elementor", "WooCommerce", "Yoast SEO", "cPanel"],
    modules: [
      { title: "Setup", topics: ["Hosting & domains", "Installation", "Themes", "Core settings"] },
      { title: "Building", topics: ["Elementor", "Custom post types", "Menus & widgets", "Forms"] },
      { title: "WooCommerce", topics: ["Products", "Payments", "Shipping", "Order flow"] },
      { title: "Maintain", topics: ["SEO plugins", "Speed optimisation", "Security", "Backups"] },
    ],
    outcomes: [
      "Launch a client-ready site in days, not months",
      "Run a working online store",
      "Keep sites fast, secure and backed up",
      "Take on freelance web projects",
    ],
    careers: ["WordPress Developer", "Freelance Web Developer", "Web Manager", "Digital Marketer"],
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "web",
    duration: "5 weeks",
    level: "Beginner",
    summary: "Set up, theme and run a commercial Shopify store — including apps, payments and analytics.",
    tools: ["Shopify", "Liquid", "Shopify Apps", "Klaviyo", "GA4"],
    modules: [
      { title: "Store Setup", topics: ["Products & variants", "Collections", "Payments", "Shipping"] },
      { title: "Theming", topics: ["Theme editor", "Liquid basics", "Sections", "Custom CSS"] },
      { title: "Growth", topics: ["Apps", "Email flows", "Discounts", "Reviews"] },
      { title: "Analytics", topics: ["GA4 setup", "Conversion tracking", "Reports", "Optimisation"] },
    ],
    outcomes: [
      "Launch a store that takes real payments",
      "Customise themes beyond the editor",
      "Set up abandoned-cart and email flows",
      "Read store analytics and act on them",
    ],
    careers: ["Shopify Developer", "E-commerce Manager", "Store Owner", "E-commerce Marketer"],
  },
  {
    id: "flutter-app-development",
    name: "Flutter App Development",
    category: "web",
    duration: "3 – 4 months",
    level: "Intermediate",
    summary: "One codebase, Android and iOS — build, test and publish real cross-platform apps.",
    badge: "Trending",
    training: true,
    tools: ["Flutter", "Dart", "Firebase", "Riverpod", "REST APIs", "Play Console"],
    modules: [
      { title: "Dart", topics: ["Language basics", "Async & futures", "Null safety", "Collections"] },
      { title: "Flutter UI", topics: ["Widgets", "Layout", "Navigation", "Animations"] },
      { title: "State & Data", topics: ["Riverpod / Provider", "REST integration", "Local storage", "Error states"] },
      { title: "Firebase", topics: ["Auth", "Firestore", "Push notifications", "Analytics"] },
      { title: "Release", topics: ["Testing", "App icons & splash", "Play Store", "App Store basics"] },
    ],
    outcomes: [
      "Publish a cross-platform app to the Play Store",
      "Manage app state without spaghetti code",
      "Integrate Firebase auth and realtime data",
      "Debug platform-specific issues",
    ],
    careers: ["Flutter Developer", "Mobile App Developer", "Cross-Platform Engineer", "Freelance App Developer"],
  },

  /* --------------------------- DIGITAL MARKETING --------------------------- */
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    category: "marketing",
    duration: "3 – 6 months",
    level: "Beginner to Advanced",
    summary:
      "SEO, paid ads, social, email and analytics — practised on live campaigns with real budgets, not case studies.",
    badge: "Hot",
    featured: true,
    training: true,
    tools: ["Google Ads", "Meta Ads", "GA4", "Search Console", "Semrush", "Canva", "Mailchimp"],
    modules: [
      { title: "Foundations", topics: ["Marketing funnels", "Audience research", "Positioning", "Offer design"] },
      { title: "SEO", topics: ["Keyword research", "On-page SEO", "Technical SEO", "Link building"] },
      { title: "Paid Ads", topics: ["Google Search & Display", "Meta Ads", "Budgeting", "Creative testing"] },
      { title: "Social & Content", topics: ["Content calendars", "Reels & shorts", "Influencer basics", "Community"] },
      { title: "Email & Automation", topics: ["List building", "Sequences", "Segmentation", "Deliverability"] },
      { title: "Analytics", topics: ["GA4", "Attribution", "Dashboards", "Reporting to clients"] },
    ],
    outcomes: [
      "Run campaigns end to end with measurable ROI",
      "Rank a real site for real keywords",
      "Build reporting dashboards clients understand",
      "Take on freelance or agency work immediately",
    ],
    careers: ["Digital Marketing Executive", "SEO Specialist", "Performance Marketer", "Social Media Manager"],
    fee: { original: 45000, offer: 35000 },
  },
  {
    id: "seo",
    name: "Search Engine Optimization (SEO)",
    category: "marketing",
    duration: "2 months",
    level: "Beginner to Advanced",
    summary: "Technical, on-page and off-page SEO practised on a live site you take from zero to ranking.",
    tools: ["Search Console", "Semrush", "Ahrefs", "Screaming Frog", "GA4"],
    modules: [
      { title: "Research", topics: ["Keyword intent", "Competitor gaps", "Topic clusters", "SERP analysis"] },
      { title: "On-Page", topics: ["Titles & meta", "Content structure", "Internal linking", "Schema markup"] },
      { title: "Technical", topics: ["Crawling & indexing", "Core Web Vitals", "Sitemaps", "Redirects"] },
      { title: "Off-Page", topics: ["Link building", "Digital PR", "Local SEO", "Reputation"] },
    ],
    outcomes: [
      "Audit a site and prioritise fixes by impact",
      "Rank pages for commercial keywords",
      "Diagnose indexing and crawl problems",
      "Report SEO progress credibly",
    ],
    careers: ["SEO Executive", "SEO Analyst", "Content Strategist", "Growth Marketer"],
  },
  {
    id: "social-media-marketing",
    name: "Social Media Marketing",
    category: "marketing",
    duration: "6 weeks",
    level: "Beginner",
    summary: "Strategy, content and paid social across Instagram, LinkedIn, YouTube and Facebook.",
    tools: ["Meta Business Suite", "Canva", "CapCut", "Buffer", "LinkedIn Ads"],
    modules: [
      { title: "Strategy", topics: ["Platform fit", "Audience personas", "Content pillars", "Calendars"] },
      { title: "Content", topics: ["Reels & shorts", "Carousels", "Copywriting", "Design in Canva"] },
      { title: "Paid Social", topics: ["Campaign objectives", "Audiences", "Creative testing", "Retargeting"] },
      { title: "Measure", topics: ["Engagement metrics", "Conversions", "Reporting", "Iteration"] },
    ],
    outcomes: [
      "Plan a month of content in one sitting",
      "Produce reels that actually get watched",
      "Run paid social with a controlled budget",
      "Grow a real account with measurable results",
    ],
    careers: ["Social Media Manager", "Content Creator", "Community Manager", "Brand Executive"],
  },
  {
    id: "google-ads",
    name: "Google Ads",
    category: "marketing",
    duration: "5 weeks",
    level: "Beginner to Advanced",
    summary: "Search, Display, Shopping, YouTube and Performance Max — structured, tested and optimised.",
    tools: ["Google Ads", "Keyword Planner", "GA4", "Google Tag Manager", "Merchant Center"],
    modules: [
      { title: "Account Structure", topics: ["Campaigns & ad groups", "Match types", "Negatives", "Budgets"] },
      { title: "Campaign Types", topics: ["Search", "Display", "Shopping", "YouTube & PMax"] },
      { title: "Conversion Tracking", topics: ["GTM setup", "GA4 imports", "Offline conversions", "Attribution"] },
      { title: "Optimisation", topics: ["Bid strategies", "Quality Score", "A/B tests", "Scaling"] },
    ],
    outcomes: [
      "Structure accounts that stay manageable at scale",
      "Track conversions accurately end to end",
      "Cut wasted spend with negative keywords",
      "Report cost per acquisition confidently",
    ],
    careers: ["PPC Specialist", "Paid Search Analyst", "Performance Marketer", "Agency Executive"],
  },

  /* ---------------------------- CYBER & CLOUD ---------------------------- */
  {
    id: "cyber-security",
    name: "Cyber Security",
    category: "cyber-cloud",
    duration: "4 – 6 months",
    level: "Intermediate",
    summary:
      "Offensive and defensive security in live lab environments — networks, web apps, cloud and incident response.",
    badge: "Hot",
    featured: true,
    training: true,
    tools: ["Kali Linux", "Burp Suite", "Wireshark", "Metasploit", "Nmap", "Splunk"],
    modules: [
      { title: "Foundations", topics: ["Networking & TCP/IP", "Linux security", "Cryptography", "Threat models"] },
      { title: "Offensive", topics: ["Reconnaissance", "Vulnerability scanning", "Exploitation", "Post-exploitation"] },
      { title: "Web Security", topics: ["OWASP Top 10", "Burp Suite", "Auth flaws", "API security"] },
      { title: "Defensive", topics: ["SIEM & log analysis", "Incident response", "Hardening", "Forensics basics"] },
      { title: "Reporting", topics: ["Pentest reports", "Risk scoring", "Remediation advice", "Client briefing"] },
    ],
    outcomes: [
      "Run a full penetration test in a lab environment",
      "Find and explain OWASP Top 10 vulnerabilities",
      "Investigate an incident using logs",
      "Write a report a client can act on",
    ],
    careers: ["Security Analyst", "Penetration Tester", "SOC Analyst", "Security Engineer"],
    fee: { original: 70000, offer: 55000 },
  },
  {
    id: "ethical-hacking",
    name: "Ethical Hacking",
    category: "cyber-cloud",
    duration: "3 months",
    level: "Intermediate",
    summary: "CEH-aligned offensive security practised entirely in isolated, authorised lab ranges.",
    tools: ["Kali Linux", "Metasploit", "Nmap", "Burp Suite", "John the Ripper", "Hydra"],
    modules: [
      { title: "Recon", topics: ["Footprinting", "Scanning", "Enumeration", "OSINT"] },
      { title: "System Hacking", topics: ["Password attacks", "Privilege escalation", "Persistence", "Covering tracks"] },
      { title: "Network Attacks", topics: ["Sniffing", "MITM", "Wireless", "Denial of service concepts"] },
      { title: "Web & Mobile", topics: ["Injection", "XSS & CSRF", "Session attacks", "Mobile app testing"] },
    ],
    outcomes: [
      "Work through a full kill chain in the lab",
      "Use industry tooling the way assessors do",
      "Understand the legal and ethical boundaries",
      "Prepare for CEH-style certification exams",
    ],
    careers: ["Ethical Hacker", "Penetration Tester", "VAPT Analyst", "Security Consultant"],
  },
  {
    id: "cloud-computing",
    name: "Cloud Computing & DevOps",
    category: "cyber-cloud",
    duration: "4 months",
    level: "Intermediate",
    summary: "AWS and Azure fundamentals plus the DevOps pipeline — containers, CI/CD and infrastructure as code.",
    featured: true,
    training: true,
    tools: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions"],
    modules: [
      { title: "Cloud Basics", topics: ["Compute & storage", "Networking & VPC", "IAM", "Cost management"] },
      { title: "Containers", topics: ["Docker images", "Compose", "Registries", "Container security"] },
      { title: "Kubernetes", topics: ["Pods & services", "Deployments", "ConfigMaps & secrets", "Scaling"] },
      { title: "CI/CD", topics: ["Pipelines", "GitHub Actions", "Jenkins", "Release strategies"] },
      { title: "IaC & Monitoring", topics: ["Terraform", "Ansible basics", "Prometheus & Grafana", "Alerting"] },
    ],
    outcomes: [
      "Deploy a containerised app to a managed cluster",
      "Automate builds and releases with CI/CD",
      "Provision infrastructure from code",
      "Prepare for AWS and Azure associate exams",
    ],
    careers: ["DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer", "Platform Engineer"],
    fee: { original: 65000, offer: 50000 },
  },

  /* ------------------------------ CAD & DESIGN ------------------------------ */
  {
    id: "autocad",
    name: "AutoCAD",
    category: "cad",
    duration: "6 weeks",
    level: "Beginner",
    summary: "2D drafting and 3D modelling for civil, mechanical and architectural drawings.",
    tools: ["AutoCAD 2D", "AutoCAD 3D", "Plotting", "DWG standards"],
    modules: [
      { title: "2D Drafting", topics: ["Draw & modify tools", "Layers", "Dimensioning", "Blocks"] },
      { title: "Standards", topics: ["Templates", "Annotation scaling", "Sheet sets", "Plotting"] },
      { title: "3D", topics: ["Solids & surfaces", "Views", "Rendering", "Sections"] },
      { title: "Projects", topics: ["Floor plans", "Machine parts", "Site layouts", "Portfolio drawings"] },
    ],
    outcomes: [
      "Produce drawings to professional standards",
      "Work efficiently with layers and blocks",
      "Model and section 3D parts",
      "Build a drawing portfolio for job interviews",
    ],
    careers: ["CAD Draftsman", "Civil Engineer", "Mechanical Designer", "Architectural Assistant"],
  },
  {
    id: "3ds-max",
    name: "3ds Max",
    category: "cad",
    duration: "8 weeks",
    level: "Intermediate",
    summary: "Architectural modelling, materials, lighting and photorealistic rendering.",
    tools: ["3ds Max", "V-Ray", "Corona", "Photoshop"],
    modules: [
      { title: "Modelling", topics: ["Splines", "Poly modelling", "Modifiers", "Architectural elements"] },
      { title: "Materials", topics: ["UVW mapping", "PBR materials", "Texture libraries", "Real-world scale"] },
      { title: "Lighting", topics: ["Daylight systems", "Interior lighting", "HDRI", "Exposure"] },
      { title: "Rendering", topics: ["V-Ray settings", "Camera work", "Post-production", "Walkthroughs"] },
    ],
    outcomes: [
      "Model interiors and exteriors accurately",
      "Light scenes that look photographic",
      "Render efficiently without endless retries",
      "Produce a visualisation showreel",
    ],
    careers: ["3D Visualiser", "Architectural Renderer", "Interior Designer", "3D Artist"],
  },
  {
    id: "revit",
    name: "Revit (BIM)",
    category: "cad",
    duration: "6 weeks",
    level: "Intermediate",
    summary: "Building information modelling — parametric families, coordinated drawings and schedules.",
    tools: ["Revit Architecture", "Revit Structure", "Navisworks", "BIM 360"],
    modules: [
      { title: "BIM Basics", topics: ["Project setup", "Levels & grids", "Walls & floors", "Roofs & stairs"] },
      { title: "Families", topics: ["System families", "Loadable families", "Parameters", "Types"] },
      { title: "Documentation", topics: ["Views", "Sheets", "Schedules", "Annotation"] },
      { title: "Coordination", topics: ["Worksets", "Linked models", "Clash detection", "Exports"] },
    ],
    outcomes: [
      "Model a complete building in BIM",
      "Produce coordinated construction documents",
      "Create custom parametric families",
      "Collaborate on linked models",
    ],
    careers: ["BIM Modeller", "Revit Technician", "Architectural Designer", "Structural Draftsman"],
  },
  {
    id: "solidworks",
    name: "SolidWorks",
    category: "cad",
    duration: "6 weeks",
    level: "Intermediate",
    summary: "Parametric mechanical design — parts, assemblies, drawings and basic simulation.",
    tools: ["SolidWorks", "GD&T", "Simulation", "Sheet Metal"],
    modules: [
      { title: "Part Design", topics: ["Sketching", "Features", "Patterns", "Configurations"] },
      { title: "Assemblies", topics: ["Mates", "Sub-assemblies", "Interference checks", "Motion"] },
      { title: "Drawings", topics: ["Views & sections", "GD&T", "BOM", "Standards"] },
      { title: "Advanced", topics: ["Sheet metal", "Weldments", "Surfacing basics", "Simulation intro"] },
    ],
    outcomes: [
      "Design manufacturable parts and assemblies",
      "Apply GD&T correctly on drawings",
      "Check interference before manufacturing",
      "Run basic stress simulations",
    ],
    careers: ["Mechanical Design Engineer", "Product Designer", "CAD Engineer", "Design Draftsman"],
  },

  /* ---------------------------- BASICS & OFFICE ---------------------------- */
  {
    id: "basic-computer",
    name: "Basic Computer Course",
    category: "office",
    duration: "6 weeks",
    level: "Beginner",
    summary: "Computer fundamentals, internet skills and office software for people starting from zero.",
    tools: ["Windows", "MS Word", "MS Excel", "Internet", "Email"],
    modules: [
      { title: "Fundamentals", topics: ["Hardware & software", "Windows basics", "File management", "Printing"] },
      { title: "Internet", topics: ["Browsers & search", "Email", "Online forms", "Digital safety"] },
      { title: "Documents", topics: ["MS Word", "Formatting", "Tables", "Mail merge"] },
      { title: "Spreadsheets", topics: ["MS Excel basics", "Formulas", "Charts", "Printing sheets"] },
    ],
    outcomes: [
      "Use a computer confidently for daily work",
      "Handle email and online forms independently",
      "Produce clean documents and spreadsheets",
      "Qualify for entry-level office roles",
    ],
    careers: ["Data Entry Operator", "Office Assistant", "Front Desk Executive", "Back Office Executive"],
  },
  {
    id: "ms-office",
    name: "MS Office",
    category: "office",
    duration: "6 weeks",
    level: "Beginner",
    summary: "Word, Excel, PowerPoint and Outlook to a level employers actually test for.",
    tools: ["MS Word", "MS Excel", "PowerPoint", "Outlook", "OneDrive"],
    modules: [
      { title: "Word", topics: ["Styles", "Templates", "References", "Mail merge"] },
      { title: "Excel", topics: ["Formulas", "Lookups", "Pivot tables", "Charts"] },
      { title: "PowerPoint", topics: ["Slide masters", "Design", "Animation", "Delivery"] },
      { title: "Outlook & Cloud", topics: ["Email management", "Calendars", "OneDrive", "Collaboration"] },
    ],
    outcomes: [
      "Build spreadsheets that calculate correctly",
      "Design presentations that hold attention",
      "Manage email and calendars efficiently",
      "Pass office software screening tests",
    ],
    careers: ["Office Executive", "MIS Assistant", "Administrative Assistant", "Coordinator"],
  },
  {
    id: "tally",
    name: "Tally with GST",
    category: "office",
    duration: "8 weeks",
    level: "Beginner",
    summary: "Computerised accounting, inventory and GST compliance in TallyPrime.",
    tools: ["TallyPrime", "GST", "Excel", "Banking"],
    modules: [
      { title: "Accounting", topics: ["Ledgers & groups", "Vouchers", "Trial balance", "Final accounts"] },
      { title: "Inventory", topics: ["Stock items", "Godowns", "Batches", "Reorder levels"] },
      { title: "GST", topics: ["GST setup", "Invoicing", "Returns", "E-way bills"] },
      { title: "Payroll & Reports", topics: ["Salary structures", "TDS basics", "Bank reconciliation", "MIS reports"] },
    ],
    outcomes: [
      "Maintain a complete set of books in Tally",
      "File GST-compliant invoices and returns",
      "Reconcile bank statements accurately",
      "Work as an accounts assistant from day one",
    ],
    careers: ["Accounts Executive", "Tally Operator", "GST Practitioner", "Billing Executive"],
  },
  {
    id: "typing",
    name: "Typing Course",
    category: "office",
    duration: "4 – 8 weeks",
    level: "Beginner",
    summary: "Build accurate touch-typing speed in English and Hindi for government and office exams.",
    tools: ["Typing software", "English keyboard", "Hindi (Mangal/Kruti Dev)"],
    modules: [
      { title: "Technique", topics: ["Home row", "Posture", "Finger placement", "Rhythm"] },
      { title: "Speed", topics: ["Accuracy drills", "Timed tests", "Common words", "Numbers & symbols"] },
      { title: "Hindi Typing", topics: ["Mangal font", "Kruti Dev", "Inscript layout", "Practice passages"] },
      { title: "Exam Prep", topics: ["Government test patterns", "Mock tests", "Error correction", "Certification"] },
    ],
    outcomes: [
      "Reach 40+ WPM with high accuracy",
      "Type in Hindi to exam standards",
      "Clear government typing tests",
      "Work faster in every other computer task",
    ],
    careers: ["Data Entry Operator", "Clerk", "Steno Assistant", "Office Assistant"],
  },
  {
    id: "desktop-publishing-dtp",
    name: "Desktop Publishing (DTP)",
    category: "office",
    duration: "8 weeks",
    level: "Beginner",
    summary: "Photoshop, Illustrator, CorelDRAW and InDesign for print and digital design work.",
    tools: ["Photoshop", "Illustrator", "CorelDRAW", "InDesign"],
    modules: [
      { title: "Photoshop", topics: ["Selections & layers", "Retouching", "Compositing", "Export for web"] },
      { title: "Illustrator", topics: ["Vector drawing", "Logos", "Typography", "Print-ready files"] },
      { title: "CorelDRAW", topics: ["Page layout", "Tracing", "Print setup", "Colour modes"] },
      { title: "InDesign", topics: ["Master pages", "Text flow", "Brochures", "PDF export"] },
    ],
    outcomes: [
      "Design print-ready brochures, cards and banners",
      "Create clean vector logos",
      "Prepare files correctly for a printing press",
      "Take on freelance design jobs",
    ],
    careers: ["Graphic Designer", "DTP Operator", "Print Designer", "Freelance Designer"],
  },
];

/* --------------------------------- Lookups --------------------------------- */

export const coursesById = new Map(courses.map((c) => [c.id, c]));

export const getCourse = (id: string) => coursesById.get(id);

export const coursesByCategory = (category: CourseCategoryId) =>
  courses.filter((c) => c.category === category);

export const featuredCourses = courses.filter((c) => c.featured);

export const trainingCourses = courses.filter((c) => c.training);

export const getCategory = (id: CourseCategoryId) =>
  courseCategories.find((c) => c.id === id)!;
