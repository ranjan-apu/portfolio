export type Category = 'software' | 'hardware' | 'ai' | 'web' | 'systems';

export interface Project {
  name: string;
  description: string;
  categories: Category[];
  featured?: boolean;
  /** For professional work: what it does and why it mattered. */
  detail?: string;
  /** For professional work: the org the project was built at. */
  org?: string;
  links: {
    code?: string;
    live?: string;
    x?: string;
    instagram?: string;
    npm?: string;
  };
}

const GH = 'https://github.com/ranjan-apu';

/** Professional work at Walmart Global Tech. Internal, so no public links. */
export const workProjects: Project[] = [
  {
    name: 'Reducto — Catalog Compliance Agent',
    org: 'Walmart Global Tech',
    description:
      'Asynchronous AI audit pipeline that auto-approves compliant seller listings and escalates edge cases.',
    detail:
      'Handles 200k+ daily seller listing updates. Enforces strict schema validation on LLM decisions, auto-approving high-probability compliant cases and routing ambiguous ones to human auditors.',
    categories: ['ai', 'systems', 'software'],
    featured: true,
    links: {},
  },
  {
    name: 'Store Compliance Analytics & GenAI Assistant',
    org: 'Walmart Global Tech',
    description:
      'Full-stack compliance platform plus a multi-agent RAG assistant over SOP documents, serving 60,000+ store associates.',
    detail:
      'Tracked 60+ critical metrics across 60,000+ store associates and prevented store-level compliance fines by grounding agent answers in internal SOP documentation.',
    categories: ['ai', 'software', 'web'],
    featured: true,
    links: {},
  },
  {
    name: 'Trace — Shipping Investigation & Fraud Detection',
    org: 'Walmart Global Tech',
    description:
      'End-to-end logistics investigation platform for analyzing anomalous delivery patterns.',
    detail:
      'Implemented OAuth2/OIDC RBAC, geospatial package search, and a WebGL-accelerated map UI on a React + Spring Boot + Elasticsearch stack.',
    categories: ['software', 'web', 'systems'],
    featured: true,
    links: {},
  },
  {
    name: 'PRISM — Prescriber Review Platform',
    org: 'Walmart Global Tech',
    description:
      'Auditing tool for reviewing historical dispensing data under regulatory opioid monitoring.',
    detail:
      'A React and GraphQL tool that lets investigators streamline reviews and mitigate OPM penalties.',
    categories: ['software', 'web'],
    links: {},
  },
  {
    name: 'Audit-Trail Microservice',
    org: 'Walmart Global Tech',
    description:
      'Distributed service logging multi-database CRUD operations with replay-by-key verification.',
    detail:
      'Built for data integrity verification: every write is captured to Kafka and replayable by key.',
    categories: ['systems', 'software'],
    links: {},
  },
];

/** Public side projects and experiments from github.com/ranjan-apu. */
export const sideProjects: Project[] = [
  {
    name: 'ScaleLab',
    description:
      'A system design studio: diagram architectures, simulate real load, and practice interviews — all in the browser.',
    detail:
      'Draw a system on the canvas, push traffic through it, and watch queueing behavior emerge: latency percentiles climbing, queues filling, circuit breakers tripping. Then rehearse explaining it with guided interview packs.',
    categories: ['web', 'software'],
    featured: true,
    links: {
      code: `${GH}/scalelab`,
      live: 'https://scalelab.apurba.top',
    },
  },
  {
    name: 'AlphaPulse — DART Market Agent Harness',
    description:
      'Research harness for evaluating an LLM-powered intraday price-action trading agent.',
    detail:
      'Tests whether a structured LLM agent, given clean multi-timeframe price-action data, can generate useful BUY/SELL/SKIP/HOLD/EXIT signals in a walk-forward backtest. Research POC — it does not place broker orders.',
    categories: ['ai', 'software'],
    featured: true,
    links: { code: `${GH}/alphapulse` },
  },
  {
    name: 'Advanced-RAG',
    description:
      'A retrieval-augmented generation system that prioritizes retrieved document context over model priors.',
    detail:
      'LangChain orchestration over QdrantVectorStore with MistralAIEmbeddings and an OpenAI-compatible endpoint, falling back to general knowledge only when retrieval comes up empty.',
    categories: ['ai', 'software'],
    links: { code: `${GH}/Advanced-RAG` },
  },
  {
    name: 'RAG-PDF-CLI',
    description:
      'A command-line lab demonstrating seven advanced RAG techniques for querying PDFs.',
    detail:
      'LangChain with Qdrant in Docker, built as a hands-on way to compare advanced retrieval strategies side by side.',
    categories: ['ai', 'software'],
    links: { code: `${GH}/query-transformation` },
  },
  {
    name: 'CodeGen Agent',
    description:
      'A structured step-by-step code generation agent following a start → plan → action → observe loop.',
    detail:
      'Validates each step before execution, integrates pluggable tools (weather, system commands), and is designed for CLI or assistant integration.',
    categories: ['ai', 'software'],
    links: { code: `${GH}/codegen-agent` },
  },
  {
    name: 'AI YouTube Shorts Generator',
    description:
      'Turns long-form videos into vertical shorts by extracting highlights with GPT-4 and Whisper.',
    detail:
      'Downloads a video, transcribes it with Whisper, identifies the most engaging segments with GPT-4, detects speakers, and crops them to vertical.',
    categories: ['ai', 'software'],
    links: { code: `${GH}/AI-Youtube-Shorts-Generator` },
  },
  {
    name: 'chat-PDF',
    description: 'A minimal LangChain RAG system for chatting with PDF documents.',
    categories: ['ai', 'software'],
    links: { code: `${GH}/chat-PDF` },
  },
  {
    name: 'TimeSeriesForecast',
    description:
      'Fine-tunes DeepSeek R1 Distill 3B to predict 5-minute crypto candles from OHLCV data.',
    detail:
      'Pulls exchange data with CCXT, computes RSI/MACD/EMA with pandas_ta, then fine-tunes the model on normalized price and indicator sequences.',
    categories: ['ai', 'software'],
    links: { code: `${GH}/TimeSeriesForcast` },
  },
  {
    name: 'competitive_programming',
    description: 'Competitive programming solutions, mostly C++.',
    categories: ['software'],
    links: { code: `${GH}/competitive_programming` },
  },
];

export const githubUrl = GH;