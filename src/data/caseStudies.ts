/** Public-facing case studies distilled from known project descriptions.
 * They deliberately omit private diagrams, source code and unverified performance claims.
 */
export interface CaseStudy {
  slug: string;
  /** Publication date for metadata, OG cards and the sitemap. */
  date: string;
  projectName: string;
  headline: string;
  introduction: string;
  context: string[];
  approach: { title: string; detail: string }[];
  engineeringLens: { title: string; detail: string }[];
  outcome: string;
  boundary: string;
  readingTag: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'catalog-compliance-agent',
    date: '2026-10-25',
    projectName: 'Reducto — Catalog Compliance Agent',
    headline: 'Making high-volume catalog review an auditable decision flow',
    introduction:
      'A seller catalog cannot rely on a language model simply saying “approved.” Every decision needs a defined shape, a confidence boundary and a clear path for ambiguous cases.',
    context: [
      'The catalog receives more than 200,000 seller listing updates per day. Reviewing them means distinguishing routine compliant listings from cases that require a person to make the call.',
      'Reducto is an asynchronous AI audit harness. It validates the structure of model decisions, auto-approves high-probability compliant cases and escalates ambiguous decisions to human auditors.',
    ],
    approach: [
      {
        title: 'Separate the audit from the request',
        detail:
          'The workflow is asynchronous, allowing the listing update and its compliance evaluation to be treated as distinct work. That separation matters when individual evaluations take different amounts of time.',
      },
      {
        title: 'Constrain AI output',
        detail:
          'Strict schema validation makes the model return a decision that the surrounding system can interpret. A plausible paragraph is insufficient when downstream actions depend on a machine-readable result.',
      },
      {
        title: 'Keep a human escalation path',
        detail:
          'High-probability compliant cases can move through automatically, while edge cases are routed to auditors. The handoff is part of the product, not an exception to it.',
      },
    ],
    engineeringLens: [
      {
        title: 'Validate before acting',
        detail:
          'In any system built around probabilistic outputs, malformed, missing or unexpected fields should fail closed into a safe review state. This is a general design principle, rather than a claim about unpublished implementation details.',
      },
      {
        title: 'Model uncertainty explicitly',
        detail:
          'Treat “needs review” as a first-class outcome. A binary approve/reject interface can hide uncertainty and make operational auditing harder.',
      },
      {
        title: 'Measure the handoff',
        detail:
          'Useful measurements would include escalation volume, review latency and agreement between automated and human judgments. These are suggested evaluation dimensions; no internal values are published here.',
      },
    ],
    outcome:
      'The documented system handles a stream of 200,000+ daily listing updates with schema-validated AI decisions and a human review path. Approval rates, latency figures and financial impact are not public.',
    boundary:
      'This is a public engineering narrative about an internal system. It does not reproduce production architecture, internal prompts, code or unpublished results.',
    readingTag: 'ai',
  },
  {
    slug: 'store-compliance-assistant',
    date: '2026-10-25',
    projectName: 'Store Compliance Analytics & GenAI Assistant',
    headline: 'Connecting operational metrics to answers people can verify',
    introduction:
      'Store compliance is both a measurement problem and an information problem: teams need to see what requires attention and find the right operating procedure to respond.',
    context: [
      'The platform tracks more than 60 critical compliance metrics across a population of over 60,000 store associates. Those numbers describe the documented scope, not the number of concurrent users.',
      'Alongside the analytics experience, a multi-agent retrieval-augmented generation (RAG) assistant uses internal standard operating procedure documents to ground responses.',
    ],
    approach: [
      {
        title: 'Put indicators in one operational view',
        detail:
          'The full-stack analytics product brings multiple critical measures into a shared compliance workflow. The goal is to make a risk visible before someone has to search across disconnected reports.',
      },
      {
        title: 'Retrieve policy context',
        detail:
          'The assistant uses RAG over SOP material so an answer is informed by relevant internal documents rather than solely by what a model recalls.',
      },
      {
        title: 'Support the people taking action',
        detail:
          'Metrics can identify where attention is needed; grounded guidance helps an associate understand the procedure that applies. Those two experiences serve different parts of the same decision.',
      },
    ],
    engineeringLens: [
      {
        title: 'Freshness is part of correctness',
        detail:
          'A metric may be numerically right but no longer current. Dashboards should make update timing and data scope easy to inspect. This is an editorial design consideration, not a claim about the platform’s exact refresh schedule.',
      },
      {
        title: 'Retrieval does not guarantee truth',
        detail:
          'An SOP-based answer still needs checks for document relevance, source version and whether the evidence supports the conclusion.',
      },
      {
        title: 'Test the difficult queries',
        detail:
          'Good evaluation material includes conflicting policies, missing sources and questions outside the document set. The right response may be a qualified answer or escalation, not a confident completion.',
      },
    ],
    outcome:
      'The described platform covers 60+ compliance metrics and 60,000+ associates, combining operational analytics with SOP-grounded assistance. No internal accuracy, savings or adoption measurements are shared.',
    boundary:
      'Product details are limited to the existing public project description. The evaluation points above are general engineering lessons and do not disclose confidential procedures.',
    readingTag: 'rag',
  },
  {
    slug: 'shipping-investigation',
    date: '2026-10-25',
    projectName: 'Trace — Shipping Investigation & Fraud Detection',
    headline: 'Giving investigators a navigable picture of delivery anomalies',
    introduction:
      'When unusual shipping behavior spans locations and events, an investigation needs more than a table of package IDs. It needs controlled access, search and geography working together.',
    context: [
      'Trace is a logistics investigation platform for examining anomalous delivery patterns. It brings geospatial package search into a map-based workflow.',
      'The documented stack includes React, Spring Boot and Elasticsearch, with OAuth2/OIDC role-based access control and a WebGL-accelerated map interface.',
    ],
    approach: [
      {
        title: 'Search by spatial context',
        detail:
          'Geospatial package search lets an investigator reason about where events happened, rather than depend solely on individual tracking identifiers.',
      },
      {
        title: 'Make the map an investigative interface',
        detail:
          'The WebGL-accelerated view supports exploring geographically distributed patterns, giving the map a functional role in reviewing anomalies.',
      },
      {
        title: 'Control access by role',
        detail:
          'OAuth2/OIDC RBAC is part of the documented implementation. Investigation data requires clear authorization boundaries across the workflow.',
      },
    ],
    engineeringLens: [
      {
        title: 'Map performance follows data density',
        detail:
          'For similar systems, bounding the queried geographic area and aggregating dense markers can keep interaction useful. Those techniques are illustrative considerations, not a claim that Trace uses a particular tiling strategy.',
      },
      {
        title: 'Search permissions must survive every layer',
        detail:
          'Protecting the UI alone is insufficient: query and API authorization should enforce the same access model.',
      },
      {
        title: 'Help people distinguish signal from noise',
        detail:
          'An anomaly is a starting point for investigation, not proof of fraud. Interfaces should preserve enough context for a person to make that distinction.',
      },
    ],
    outcome:
      'The published capabilities include geospatial search, a WebGL map UI and role-based access control. Investigation throughput, fraud detection rates and other private operating results are not asserted.',
    boundary:
      'This account describes the project at a public level and labels broader design considerations separately from implemented capabilities.',
    readingTag: 'distributed-systems',
  },
];
