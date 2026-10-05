export interface Role {
  company: string;
  title: string;
  period: string;
  start: string;
  end: string | null;
  current?: boolean;
  summary: string;
  highlights: {
    name: string;
    detail: string;
    stack: string[];
  }[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  detail?: string;
}

export interface Publication {
  title: string;
  venue: string;
  year: string;
  url?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const SUMMARY =
  'Full-stack Software Engineer III at Walmart Global Tech specializing in distributed enterprise systems (Spring Boot, React) and production Generative AI architectures. I build autonomous compliance agent harnesses, geospatial fraud investigation tooling, and high-scale analytics platforms that mitigate critical regulatory risk across global retail operations.';

export const roles: Role[] = [
  {
    company: 'Walmart Global Tech',
    title: 'Software Engineer III',
    period: 'Aug 2026 — Present',
    start: '2026-08',
    end: null,
    current: true,
    summary:
      'Building autonomous AI agent systems for catalog compliance across global retail operations.',
    highlights: [
      {
        name: 'Catalog Compliance Agent (Reducto)',
        detail:
          'Built an asynchronous AI audit pipeline handling 200k+ daily seller listing updates. Enforces strict schema validation on LLM decisions to auto-approve high-probability compliant cases and escalate edge cases to human auditors.',
        stack: ['Python', 'Kafka', 'Pydantic', 'LLM Agents'],
      },
    ],
  },
  {
    company: 'Walmart Global Tech',
    title: 'Software Engineer II',
    period: '2023 — Aug 2026',
    start: '2023-01',
    end: '2026-08',
    summary:
      'Led full-stack development of compliance analytics and multi-agent RAG systems serving 60,000+ store associates.',
    highlights: [
      {
        name: 'Store Compliance Analytics & GenAI Assistant',
        detail:
          'Led full-stack development of a compliance platform and a multi-agent RAG system over SOP documents for 60,000+ store associates across 60+ critical metrics, preventing store-level compliance fines.',
        stack: ['React', 'FastAPI', 'LangChain', 'FAISS', 'RAG'],
      },
      {
        name: 'E-Commerce Shipping Investigation (Trace)',
        detail:
          'Built an end-to-end logistics investigation and fraud detection platform. Implemented OAuth2/OIDC RBAC, geospatial package search, and a WebGL-accelerated map UI to analyze anomalous delivery patterns.',
        stack: ['React', 'Spring Boot', 'Elasticsearch', 'OAuth2/OIDC', 'WebGL'],
      },
      {
        name: 'Prescriber Review Platform (PRISM)',
        detail:
          'Developed a React and GraphQL auditing tool to analyze historical dispensing data, enabling investigators to streamline reviews and mitigate regulatory opioid prescription monitoring (OPM) penalties.',
        stack: ['React', 'GraphQL'],
      },
    ],
  },
  {
    company: 'Walmart Global Tech',
    title: 'SDE Intern',
    period: 'Jan 2023 — Jun 2023',
    start: '2023-01',
    end: '2023-06',
    summary: 'Built distributed infrastructure for data integrity verification.',
    highlights: [
      {
        name: 'Audit-Trail Microservice',
        detail:
          'Developed a scalable microservice to log multi-database CRUD operations with replay-by-key functionality for data integrity verification.',
        stack: ['Java', 'Spring Boot', 'Kafka', 'Cassandra'],
      },
    ],
  },
];

export const education: Education[] = [
  {
    school: 'National Institute of Technology Karnataka (NITK)',
    degree: 'B.Tech. in Computer Science and Engineering',
    period: '2019 — 2023',
    detail: 'CGPA 7.01/10',
  },
];

export const publications: Publication[] = [
  {
    title: 'Light-weight Deep Learning Model for Cataract Detection using Novel Activation Function',
    venue: 'IEEE Xplore',
    year: '2023',
  },
];

export const skills: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'GraphQL', 'C++'],
  },
  {
    label: 'Frameworks & Libraries',
    items: ['React', 'Spring Boot', 'FastAPI', 'LangChain', 'Kafka'],
  },
  {
    label: 'Databases & Storage',
    items: ['Elasticsearch', 'Cassandra', 'Azure SQL', 'FAISS', 'Qdrant', 'PostgreSQL'],
  },
  {
    label: 'Tools & Concepts',
    items: [
      'OAuth2/OIDC',
      'RBAC',
      'RAG',
      'AI Agents',
      'Pydantic',
      'WebGL',
      'Microservices',
      'Git',
    ],
  },
];