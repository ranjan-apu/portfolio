/**
 * Résumé content mirrored from the LaTeX source that produces
 * public/resume.pdf. The PDF is authoritative: if a bullet changes there,
 * change it here too so the web page and download stay identical.
 */
export const RESUME = {
  name: 'Apurba Ranjan Mohapatra',
  contact: [
    {
      icon: 'linkedin' as const,
      label: 'hi-apurba',
      href: 'https://www.linkedin.com/in/hi-apurba/',
    },
    {
      icon: 'mail' as const,
      label: 'hiranjanapu@gmail.com',
      href: 'mailto:hiranjanapu@gmail.com',
    },
    { icon: 'phone' as const, label: '+91 7752073346', href: 'tel:+917752073346' },
  ],
  summary:
    'Full-stack Software Engineer III at Walmart Global Tech specializing in distributed enterprise systems (Spring Boot, React) and production Generative AI architectures. Proven track record of designing autonomous compliance agent harnesses, geospatial fraud investigation tooling, and high-scale analytics platforms mitigating critical regulatory risk across global retail operations.',
  experience: [
    {
      title: 'Software Engineer III — Walmart Global Tech',
      period: 'Aug 2026 — Present',
      bullets: [
        {
          lead: 'Catalog Compliance Agent (Reducto):',
          body: 'Built an asynchronous AI audit pipeline (Python, Kafka, Pydantic) handling 200k+ daily seller listing updates; enforces strict schema validation on LLM decisions to auto-approve high-probability compliant cases and escalate edge cases to human auditors.',
        },
      ],
    },
    {
      title: 'Software Engineer II — Walmart Global Tech',
      period: '2023 — Aug 2026',
      bullets: [
        {
          lead: 'Store Compliance Analytics & GenAI Assistant:',
          body: 'Led full-stack development of a compliance platform (React, FastAPI) and a multi-agent RAG system (LangChain, FAISS) over SOP documents for 60,000+ store associates across 60+ critical metrics, preventing store-level compliance fines.',
        },
        {
          lead: 'E-Commerce Shipping Investigation (Trace):',
          body: 'Built an end-to-end logistics investigation and fraud detection platform (React, Spring Boot, Elasticsearch); implemented OAuth2/OIDC RBAC, geospatial package search, and a WebGL-accelerated map UI to analyze anomalous delivery patterns.',
        },
        {
          lead: 'Prescriber Review Platform (PRISM):',
          body: 'Developed a React and GraphQL auditing tool to analyze historical dispensing data, enabling investigators to streamline reviews and mitigate regulatory opioid prescription monitoring (OPM) penalties.',
        },
      ],
    },
    {
      title: 'SDE Intern — Walmart Global Tech',
      period: 'Jan 2023 — Jun 2023',
      bullets: [
        {
          lead: 'Audit-Trail Microservice:',
          body: 'Developed a scalable microservice (Java, Spring Boot, Kafka, Cassandra) to log multi-database CRUD operations with replay-by-key functionality for data integrity verification.',
        },
      ],
    },
  ],
  education: {
    school: 'National Institute of Technology Karnataka (NITK)',
    period: '2019 – 2023',
    degree: 'B.Tech. in Computer Science and Engineering',
    gradeLabel: 'CGPA:',
    grade: '7.01/10',
  },
  publications: [
    {
      title:
        'Light-weight Deep Learning Model for Cataract Detection using Novel Activation Function',
      venue: 'IEEE Xplore',
      year: '2023',
      href: 'https://ieeexplore.ieee.org/document/10307723',
    },
  ],
  skills: [
    { label: 'Languages:', items: 'Java, Python, JavaScript, SQL, GraphQL' },
    {
      label: 'Frameworks & Libraries:',
      items: 'React, Spring Boot, FastAPI, LangChain, Kafka',
    },
    {
      label: 'Databases & Storage:',
      items: 'Elasticsearch, Cassandra, Azure SQL, FAISS (Vector Index)',
    },
    { label: 'Tools & Concepts:', items: 'OAuth2/OIDC, RBAC, RAG, WebGL, Git' },
  ],
};
