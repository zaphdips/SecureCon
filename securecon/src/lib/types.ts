export interface ProjectSpec {
  name: string
  stack: string
  description: string
  security: Record<string, boolean>
  quality: Record<string, boolean>
  legal: Record<string, boolean>
  tests: TestFunction[]
}

export interface TestFunction {
  name: string
  cat: 'security' | 'quality' | 'legal' | 'perf'
  desc: string
}

export interface EvalResult {
  score: number
  results: Array<{
    name: string
    status: 'pass' | 'fail' | 'warn'
    message: string
  }>
  blockers: string[]
  summary: string
}

export interface ToggleDef {
  key: string
  label: string
  rule: string
  desc: string
  weight: number
}

export const SECURITY_TOGGLES: ToggleDef[] = [
  { 
    key: 'api-keys', 
    label: 'No API keys in client', 
    rule: '- NEVER expose API keys, tokens, or secrets in client-side code, logs, or version control. All secrets live server-side only.',
    desc: 'Prevents credentials from leaking to the browser where they can be intercepted by anyone.',
    weight: 15
  },
  { 
    key: 'input-val', 
    label: 'Input validation & sanitization', 
    rule: '- Sanitize and validate ALL user inputs. Treat every external input as untrusted. Use allowlists, not denylists.',
    desc: 'The primary defense against Injection, XSS, and broken access control.',
    weight: 15
  },
  { 
    key: 'rate-limit', 
    label: 'Rate limiting on all routes', 
    rule: '- Apply rate limiting to every public API route. Prevent brute-force and abuse.',
    desc: 'Protects your server resources and prevents automated brute-force attacks.',
    weight: 10
  },
  { 
    key: 'owasp', 
    label: 'OWASP Top 10 coverage', 
    rule: '- Every generated feature must be reviewed against OWASP Top 10.',
    desc: 'Ensures your code adheres to the global standard for web application security.',
    weight: 10
  },
  { 
    key: 'pentest', 
    label: 'Pentest checklist', 
    rule: '- Assume an adversarial user. Think like a pentester: what can be abused, bypassed, or escalated?',
    desc: 'Encourages proactive vulnerability discovery by simulating real-world attacks.',
    weight: 5
  },
  { 
    key: 'logic-flaws', 
    label: 'Logic flaw detection', 
    rule: '- Explicitly identify and patch logic flaws — race conditions, TOCTOU, improper state transitions.',
    desc: 'Catches errors in business rules that automated scanners often miss.',
    weight: 10
  },
  { 
    key: 'perf-leak', 
    label: 'Performance leak prevention', 
    rule: '- Avoid performance leaks: unbounded loops, memory leaks, N+1 queries, unindexed lookups.',
    desc: 'Keeps your application fast and prevents cost spikes in cloud environments.',
    weight: 8
  },
  { 
    key: 'secrets-scan', 
    label: 'Secrets scanning (git hooks)', 
    rule: '- Enforce pre-commit hooks and CI checks to scan for accidentally committed secrets.',
    desc: 'Automates the detection of sensitive data before it reaches your repository.',
    weight: 5
  },
]

export const QUALITY_TOGGLES: ToggleDef[] = [
  { 
    key: 'human-ctx', 
    label: 'Human-readable context', 
    rule: '- Write code with rich human context: clear naming, inline comments explaining WHY not just WHAT. A senior dev should understand any section in 60 seconds.',
    desc: 'Prioritizes developer productivity and long-term maintainability over clever syntax.',
    weight: 10
  },
  { 
    key: 'patterns', 
    label: 'Detect repeated patterns', 
    rule: '- Detect and flag repeated patterns. Suggest abstractions before they become maintenance nightmares.',
    desc: 'Identifies opportunities for refactoring early in the development cycle.',
    weight: 8
  },
  { 
    key: 'systemic', 
    label: 'Systemic problem detection', 
    rule: '- Flag systemic and future systemic problems — architectural decisions that create pain at scale.',
    desc: 'Looks for "architectural smells" that will lead to tech debt or scaling issues.',
    weight: 5
  },
  { 
    key: 'pm-monitor', 
    label: 'PM-friendly monitoring output', 
    rule: '- All logs, errors, and monitoring output must be human-readable for a non-engineer technical PM.',
    desc: 'Makes system health understandable for the entire product team, not just devs.',
    weight: 7
  },
  { 
    key: 'incidents', 
    label: 'Reduced incident surface', 
    rule: '- Design for reduced incidents: prefer explicit over implicit, fail loudly with clear messages.',
    desc: 'Focuses on building robust systems that are easy to debug when they fail.',
    weight: 5
  },
  { 
    key: 'dry', 
    label: 'DRY / no duplication', 
    rule: '- Follow DRY principle strictly. No copy-pasted logic. Shared utilities over repetition.',
    desc: 'Ensures that bugs only need to be fixed in one place.',
    weight: 5
  },
]

export const LEGAL_TOGGLES: ToggleDef[] = [
  { 
    key: 'privacy', 
    label: 'Privacy Policy', 
    rule: '- Privacy Policy: must cover data collection, storage, sharing, retention, and user rights.',
    desc: 'Required for user trust and legal compliance in most jurisdictions.',
    weight: 4
  },
  { 
    key: 'terms', 
    label: 'Terms of Use', 
    rule: '- Terms of Use: acceptable use, liability limits, termination conditions, governing law.',
    desc: 'Protects your business from liability and defines user responsibilities.',
    weight: 3
  },
  { 
    key: 'data-comp', 
    label: 'Data & Compliance', 
    rule: '- Data & Compliance: comply with applicable regulations (GDPR, NDPR, CCPA). Document data flows.',
    desc: 'Ensures your data handling practices meet international regulatory standards.',
    weight: 3
  },
  { 
    key: 'ip', 
    label: 'IP / Intellectual Property', 
    rule: '- IP: all code must not infringe third-party IP. OSS licenses must be documented.',
    desc: 'Protects you from IP infringement claims and manages OSS dependencies.',
    weight: 2
  },
  { 
    key: 'gdpr', 
    label: 'GDPR / NDPR readiness', 
    rule: '- GDPR/NDPR: implement consent management, right to erasure, data portability.',
    desc: 'Specific implementation requirements for European and African data protection laws.',
    weight: 2
  },
  { 
    key: 'cookie', 
    label: 'Cookie Policy', 
    rule: '- Cookie Policy: categorize cookies, provide opt-in/opt-out, comply with ePrivacy directive.',
    desc: 'Manages user consent for tracking and analytics technologies.',
    weight: 1
  },
]

export const PRESETS = [
  {
    id: 'web-security',
    name: 'Web App (Security Focused)',
    stack: 'React + Node.js + SQL',
    desc: 'High-security web application with robust input validation and OWASP-aligned standards.',
    security: ['api-keys', 'input-val', 'rate-limit', 'owasp', 'logic-flaws'],
    quality: ['human-ctx', 'dry'],
    legal: ['privacy', 'data-comp'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise System',
    stack: 'Next.js + Microservices',
    desc: 'Scalable enterprise architecture with systemic problem detection and microservice isolation.',
    security: ['api-keys', 'owasp', 'secrets-scan'],
    quality: ['human-ctx', 'patterns', 'systemic', 'pm-monitor', 'dry'],
    legal: ['ip', 'gdpr'],
  },
  {
    id: 'quickstart',
    name: 'Rapid Prototype',
    stack: 'Vite + Firebase',
    desc: 'Lightweight configuration for fast iteration without sacrificing core security hygiene.',
    security: ['api-keys', 'input-val'],
    quality: ['human-ctx'],
    legal: [],
  },
  {
    id: 'ai-agent',
    name: 'AI / LLM Agent',
    stack: 'Python + LangChain + Pinecone',
    desc: 'Specialized for agentic workflows with focus on prompt injection defense and context integrity.',
    security: ['api-keys', 'input-val', 'logic-flaws', 'secrets-scan'],
    quality: ['human-ctx', 'systemic', 'patterns'],
    legal: ['privacy', 'data-comp'],
  },
  {
    id: 'saas',
    name: 'SaaS Starter',
    stack: 'Next.js + Prisma + Stripe',
    desc: 'Multi-tenant SaaS foundation with billing security, user isolation, and compliance readiness.',
    security: ['api-keys', 'input-val', 'rate-limit', 'owasp', 'logic-flaws', 'secrets-scan'],
    quality: ['human-ctx', 'pm-monitor', 'incidents', 'dry'],
    legal: ['privacy', 'terms', 'data-comp', 'cookie'],
  },
  {
    id: 'fintech',
    name: 'Fintech / Payments',
    stack: 'Go + PostgreSQL + Redis',
    desc: 'Mission-critical financial system with extreme focus on logic soundness and audit trails.',
    security: ['api-keys', 'input-val', 'rate-limit', 'owasp', 'logic-flaws', 'secrets-scan'],
    quality: ['human-ctx', 'patterns', 'incidents', 'dry'],
    legal: ['privacy', 'terms', 'data-comp', 'ip', 'gdpr'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare (HIPAA)',
    stack: 'Python + Django + AWS',
    desc: 'HIPAA-compliant healthcare platform with strict data privacy and encryption standards.',
    security: ['api-keys', 'input-val', 'owasp', 'pentest', 'logic-flaws'],
    quality: ['human-ctx', 'systemic', 'incidents'],
    legal: ['privacy', 'data-comp', 'ip', 'gdpr', 'cookie'],
  },
  {
    id: 'web3',
    name: 'Web3 / Blockchain',
    stack: 'Solidity + TypeScript',
    desc: 'Trustless blockchain application with smart contract security and decentralized identity.',
    security: ['input-val', 'owasp', 'pentest', 'logic-flaws', 'secrets-scan'],
    quality: ['human-ctx', 'patterns', 'systemic', 'dry'],
    legal: ['ip', 'terms'],
  }
]

export const DEFAULT_TESTS: TestFunction[] = [
  { name: 'no_client_secrets', cat: 'security', desc: 'No API keys, tokens, or credentials appear in frontend code or logs.' },
  { name: 'input_sanitized', cat: 'security', desc: 'All user inputs are validated and sanitized before use in DB queries, file ops, or shell commands.' },
  { name: 'rate_limited', cat: 'security', desc: 'Every public API route has rate limiting middleware applied.' },
  { name: 'owasp_checked', cat: 'security', desc: 'Output reviewed against OWASP Top 10: injection, broken auth, XSS, IDOR, misconfig, etc.' },
  { name: 'logic_sound', cat: 'quality', desc: 'Business logic has no exploitable flaws; edge cases are handled explicitly.' },
  { name: 'human_context', cat: 'quality', desc: 'Code includes comments and naming a human dev understands in under 60 seconds.' },
  { name: 'no_perf_leak', cat: 'perf', desc: 'No unbounded loops, memory leaks, or N+1 queries in generated code.' },
  { name: 'privacy_policy_present', cat: 'legal', desc: 'Privacy Policy exists and covers data collection, storage, sharing, and user rights.' },
]

export function generateContextText(spec: ProjectSpec, skipTimestamp = false): string {
  const getRules = (toggles: ToggleDef[], group: Record<string, boolean>) => 
    toggles.filter(t => group[t.key]).map(t => t.rule)

  const sec = getRules(SECURITY_TOGGLES, spec.security)
  const qual = getRules(QUALITY_TOGGLES, spec.quality)
  const legal = getRules(LEGAL_TOGGLES, spec.legal)

  let score = 0; let total = 0
  SECURITY_TOGGLES.forEach(t => { total += t.weight; if (spec.security[t.key]) score += t.weight })
  QUALITY_TOGGLES.forEach(t => { total += t.weight; if (spec.quality[t.key]) score += t.weight })
  LEGAL_TOGGLES.forEach(t => { total += t.weight; if (spec.legal[t.key]) score += t.weight })
  const pct = Math.round((score / total) * 100)

  const testBlock = spec.tests.map((t, i) =>
    `  ${i + 1}. [${t.cat.toUpperCase()}] ${t.name}\n     → ${t.desc}`
  ).join('\n')

  const evalPoints = [
    ...SECURITY_TOGGLES.filter(t => spec.security[t.key]),
    ...QUALITY_TOGGLES.filter(t => spec.quality[t.key]),
    ...LEGAL_TOGGLES.filter(t => spec.legal[t.key]),
  ].map(t => `- ${t.label}`).join('\n')

  const timestamp = skipTimestamp ? '[GENERATING...]' : new Date().toISOString()

  return `# PROJECT CONTEXT: ${spec.name || 'Unnamed Project'}
# Universal AI Build Standard (v2.1.0)
# Generated: ${timestamp}

## SPEC SCORE CARD
- [HEALTH] ${pct}% SecureCon Certified
- [STATUS] ${pct >= 80 ? 'Production Ready' : pct >= 50 ? 'Development Only' : 'Incubation / High Risk'}
- [RIGOR] ${sec.length + qual.length + legal.length} Active Requirements

---

## Project overview
Name: ${spec.name || 'Unnamed Project'}
Stack: ${spec.stack || '(not specified)'}
Description: ${spec.description || '(none)'}

---

## Security requirements
${sec.length ? sec.join('\n') : '(none selected)'}

---

## Quality & maintainability
${qual.length ? qual.join('\n') : '(none selected)'}

---

## Legal & compliance
${legal.length ? legal.join('\n') : '(none selected)'}

---

## Test functions
${testBlock || '(no tests defined)'}

---

## Evaluation function
When reviewing any output, score against:
${evalPoints || '(no requirements selected)'}

Score each criterion pass/fail. Flag any fail as a BLOCKER before shipping.

---

## Enforcement rule
If you are an AI generating code for this project:
1. Run all test functions above mentally before returning output.
2. If any test fails, output [TEST FAIL: test_name] and explain the issue.
3. Do not generate code with a BLOCKER without flagging it.
4. When in doubt, ask. Never silently assume.
5. Prefer boring, well-understood patterns over clever ones.
6. Production readability > AI cleverness.`
}
