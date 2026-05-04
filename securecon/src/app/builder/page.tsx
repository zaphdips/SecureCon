'use client'
import { useState, useEffect } from 'react'
import {
  ProjectSpec, TestFunction, ToggleDef,
  SECURITY_TOGGLES, QUALITY_TOGGLES, LEGAL_TOGGLES,
  DEFAULT_TESTS, PRESETS, generateContextText
} from '@/lib/types'
import { ReactIcon, NextjsIcon, NodejsIcon, SecurityIcon } from '../Logos'

const defaultSpec = (): ProjectSpec => ({
  name: '',
  stack: '',
  description: '',
  security: Object.fromEntries(SECURITY_TOGGLES.map((t: ToggleDef) => [t.key, true])),
  quality: Object.fromEntries(QUALITY_TOGGLES.map((t: ToggleDef) => [t.key, true])),
  legal: Object.fromEntries(LEGAL_TOGGLES.map((t: ToggleDef) => [t.key, true])),
  tests: DEFAULT_TESTS,
})

export default function BuilderPage() {
  const [tab, setTab] = useState<'spec'|'tests'|'eval'|'context'>('spec')
  const [spec, setSpec] = useState<ProjectSpec>(defaultSpec())
  const [projects, setProjects] = useState<ProjectSpec[]>([])
  const [customPresets, setCustomPresets] = useState<typeof PRESETS>([])
  const [newTest, setNewTest] = useState({ name: '', cat: 'security' as TestFunction['cat'], desc: '' })
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [ctx, setCtx] = useState('')

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('securecon-project')
    if (saved) { try { setSpec(JSON.parse(saved)) } catch {} }
    
    const all = localStorage.getItem('securecon-all-projects')
    if (all) { try { setProjects(JSON.parse(all)) } catch {} }

    const cp = localStorage.getItem('securecon-custom-presets')
    if (cp) { try { setCustomPresets(JSON.parse(cp)) } catch {} }
  }, [])

  const save = (s: ProjectSpec) => {
    setSpec(s)
    localStorage.setItem('securecon-project', JSON.stringify(s))
  }

  const commitProject = (s: ProjectSpec) => {
    if (!s.name.trim()) return
    const idx = projects.findIndex((p: ProjectSpec) => p.name === s.name)
    const next = idx >= 0 ? [...projects] : [s, ...projects]
    if (idx >= 0) next[idx] = s
    setProjects(next)
    localStorage.setItem('securecon-all-projects', JSON.stringify(next))
  }

  const saveAsPreset = () => {
    if (!spec.name) return alert('Enter a project name first')
    const p = {
      id: `custom-${Date.now()}`,
      name: `${spec.name} (Custom)`,
      stack: spec.stack,
      desc: spec.description,
      security: Object.keys(spec.security).filter(k => spec.security[k]),
      quality: Object.keys(spec.quality).filter(k => spec.quality[k]),
      legal: Object.keys(spec.legal).filter(k => spec.legal[k]),
    }
    const next = [p, ...customPresets]
    setCustomPresets(next)
    localStorage.setItem('securecon-custom-presets', JSON.stringify(next))
  }

  const applyPreset = (preset: typeof PRESETS[0]) => {
    const name = spec.name?.trim() || ''
    const desc = spec.description?.trim() || ''
    const allP = [...PRESETS, ...customPresets]
    const isDefaultName = !name || allP.some(p => p.name.trim() === name)
    const isDefaultDesc = !desc || allP.some(p => p.desc?.trim() === desc)

    const next: ProjectSpec = {
      ...defaultSpec(),
      name: isDefaultName ? preset.name : spec.name,
      stack: preset.stack,
      description: isDefaultDesc ? (preset.desc || '') : spec.description,
      security: Object.fromEntries(SECURITY_TOGGLES.map((t: ToggleDef) => [t.key, preset.security.includes(t.key)])),
      quality: Object.fromEntries(QUALITY_TOGGLES.map((t: ToggleDef) => [t.key, preset.quality.includes(t.key)])),
      legal: Object.fromEntries(LEGAL_TOGGLES.map((t: ToggleDef) => [t.key, preset.legal.includes(t.key)])),
    }
    save(next)
    commitProject(next)
  }

  const toggleSec = (key: string) =>
    save({ ...spec, security: { ...spec.security, [key]: !spec.security[key] } })
  const toggleQual = (key: string) =>
    save({ ...spec, quality: { ...spec.quality, [key]: !spec.quality[key] } })
  const toggleLegal = (key: string) =>
    save({ ...spec, legal: { ...spec.legal, [key]: !spec.legal[key] } })

  const addTest = () => {
    if (!newTest.name.trim()) return
    const t: TestFunction = { name: newTest.name.trim().replace(/\s+/g,'_'), cat: newTest.cat, desc: newTest.desc }
    save({ ...spec, tests: [...spec.tests, t] })
    setNewTest({ name: '', cat: 'security', desc: '' })
  }

  const removeTest = (i: number) => {
    const tests = [...spec.tests]
    tests.splice(i, 1)
    save({ ...spec, tests })
  }

  const deleteProject = (name: string) => {
    const next = projects.filter((p: ProjectSpec) => p.name !== name)
    setProjects(next)
    localStorage.setItem('securecon-all-projects', JSON.stringify(next))
  }

  const calcScore = () => {
    let score = 0
    let total = 0
    SECURITY_TOGGLES.forEach((t: ToggleDef) => { total += t.weight; if (spec.security[t.key]) score += t.weight })
    QUALITY_TOGGLES.forEach((t: ToggleDef) => { total += t.weight; if (spec.quality[t.key]) score += t.weight })
    LEGAL_TOGGLES.forEach((t: ToggleDef) => { total += t.weight; if (spec.legal[t.key]) score += t.weight })
    return Math.round((score / total) * 100)
  }
  const pct = calcScore()

  const generate = () => {
    commitProject(spec)
    setCtx(generateContextText(spec))
    setTab('context')
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(ctx)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const catColor = (cat: string) => ({
    security: 'badge-red', quality: 'badge-blue', legal: 'badge-purple', perf: 'badge-amber'
  }[cat] || 'badge-gray')

  return (
    <main className="page animate-in">
      <div className="container-wide">
        <div className="builder-grid">
          {/* MAIN CONTENT */}
          <div>
            <div className="page-header" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
              <h1>Spec Builder</h1>
              <p>Define your project's security, quality, and legal requirements. Auto-saved locally.</p>
            </div>

            <div className="tab-bar">
              {(['spec','tests','eval','context'] as const).map(t => (
                <button key={t} className={`tab${tab===t?' active':''}`} onClick={() => setTab(t)}>
                  {t === 'spec' && '01 — Spec'}
                  {t === 'tests' && '02 — Tests'}
                  {t === 'eval' && `03 — Eval ${pct ? `(${pct}%)` : ''}`}
                  {t === 'context' && '04 — Context'}
                </button>
              ))}
            </div>
            {/* SPEC TAB */}
            {tab === 'spec' && (
              <div className="animate-in">
                <div className="card-title">Bootstrap from preset</div>
                <div className="scroll-container">
                  <div className="presets-row">
                    {[...PRESETS, ...customPresets].map(p => (
                      <div key={p.id} className="preset-card" onClick={() => applyPreset(p)}>
                        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                          {p.stack.includes('React') && <ReactIcon size={24} />}
                          {p.stack.includes('Next.js') && <NextjsIcon size={24} />}
                          {p.stack.includes('Node.js') && <NodejsIcon size={24} />}
                          {p.id === 'fintech' && <SecurityIcon size={24} />}
                          {p.id.startsWith('custom-') && (
                            <button 
                              className="btn-delete" 
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                const next = customPresets.filter((cp: typeof PRESETS[0]) => cp.id !== p.id);
                                setCustomPresets(next);
                                localStorage.setItem('securecon-custom-presets', JSON.stringify(next));
                              }}
                              style={{ padding: '2px 6px', fontSize: 10 }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <h4>{p.name}</h4>
                        <p style={{ fontSize: 10, opacity: 0.8, marginBottom: 4 }}>{p.stack}</p>
                        <p className="text-sm" style={{ fontSize: 11, lineHeight: 1.3 }}>{p.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="scroll-fade">
                    <span className="scroll-arrow">→</span>
                  </div>
                </div>

                <div className="card glass">
                  <div className="card-title">Project identity</div>
                  <div className="field-row">
                    <div className="field">
                      <label>Project name</label>
                      <input value={spec.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => save({...spec, name: e.target.value})} placeholder="e.g. PayFlow API" />
                    </div>
                    <div className="field">
                      <label>Stack</label>
                      <input value={spec.stack} onChange={(e: React.ChangeEvent<HTMLInputElement>) => save({...spec, stack: e.target.value})} placeholder="e.g. Node.js + Postgres + React" />
                    </div>
                  </div>
                  <div className="field">
                    <label>Description</label>
                    <textarea value={spec.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => save({...spec, description: e.target.value})} placeholder="What this project does and who uses it..." />
                  </div>
                  <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button className="btn btn-ghost" style={{ fontSize: 11 }} onClick={() => commitProject(spec)}>
                      Save Project
                    </button>
                    <button className="btn btn-ghost" style={{ fontSize: 11 }} onClick={saveAsPreset}>
                      + Save as Template
                    </button>
                  </div>
                </div>

                {projects.length > 0 && (
                  <div className="card">
                    <div className="card-title">Saved projects</div>
                    <div className="scroll-container">
                      <div className="presets-row">
                        {projects.map((p: ProjectSpec, i: number) => (
                          <div key={i} className="preset-card" onClick={() => setSpec(p)} style={{ width: 180, padding: '1rem' }}>
                            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                              <div style={{ background: 'var(--accent)', width: 8, height: 8, borderRadius: '50%' }} />
                              <button 
                                className="btn-delete" 
                                onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteProject(p.name) }}
                                style={{ padding: '2px 6px', fontSize: 10 }}
                              >
                                Delete
                              </button>
                            </div>
                            <h4 style={{ fontSize: 13 }}>{p.name}</h4>
                            <p style={{ fontSize: 10, opacity: 0.8 }}>{p.stack || 'No stack specified'}</p>
                          </div>
                        ))}
                      </div>
                      <div className="scroll-fade">
                        <span className="scroll-arrow">→</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="card">
                  <div className="card-title">Security requirements</div>
                  <div className="toggle-grid">
                    {SECURITY_TOGGLES.map((t: ToggleDef) => (
                      <div key={t.key} className={`toggle-item${spec.security[t.key]?' on':''}`} onClick={() => toggleSec(t.key)}>
                        <div className="toggle-dot" />
                        <div className="flex flex-col">
                          <span className="toggle-label">{t.label}</span>
                          <span className="toggle-desc">{t.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">Quality & maintainability</div>
                  <div className="toggle-grid">
                    {QUALITY_TOGGLES.map((t: ToggleDef) => (
                      <div key={t.key} className={`toggle-item${spec.quality[t.key]?' on':''}`} onClick={() => toggleQual(t.key)}>
                        <div className="toggle-dot" />
                        <div className="flex flex-col">
                          <span className="toggle-label">{t.label}</span>
                          <span className="toggle-desc">{t.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">Legal & compliance</div>
                  <div className="toggle-grid">
                    {LEGAL_TOGGLES.map((t: ToggleDef) => (
                      <div key={t.key} className={`toggle-item${spec.legal[t.key]?' on':''}`} onClick={() => toggleLegal(t.key)}>
                        <div className="toggle-dot" />
                        <div className="flex flex-col">
                          <span className="toggle-label">{t.label}</span>
                          <span className="toggle-desc">{t.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="btn-row">
                  <button className="btn btn-primary" onClick={() => setTab('tests')}>Next: define tests →</button>
                </div>
              </div>
            )}

        {/* TESTS TAB */}
        {tab === 'tests' && (
          <div className="animate-in">
            <div className="card glass">
              <div className="card-title">Test functions — {spec.tests.length} defined</div>
              <div>
                {spec.tests.map((t: TestFunction, i: number) => (
                  <div key={i} className="spec-item">
                    <div className="spec-num">{String(i+1).padStart(2,'0')}</div>
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center gap-1" style={{ marginBottom: 3 }}>
                        <span className="text-mono text-sm" style={{ fontWeight: 500 }}>{t.name}</span>
                        <span className={`badge ${catColor(t.cat)}`}>{t.cat}</span>
                      </div>
                      <div className="text-sm text-muted">{t.desc}</div>
                    </div>
                    <button className="btn-ghost" style={{ padding: '2px 8px', fontSize: 18 }} onClick={() => removeTest(i)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Add custom test</div>
              <div className="field-row">
                <div className="field">
                  <label>Test name</label>
                  <input value={newTest.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTest({...newTest, name: e.target.value})} placeholder="e.g. no_exposed_pii" />
                </div>
                <div className="field">
                  <label>Category</label>
                  <select value={newTest.cat} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTest({...newTest, cat: e.target.value as TestFunction['cat']})}>
                    <option value="security">Security</option>
                    <option value="quality">Quality</option>
                    <option value="legal">Legal</option>
                    <option value="perf">Performance</option>
                  </select>
                </div>
              </div>
              <div className="field mb-2">
                <label>What this test checks for</label>
                <textarea value={newTest.desc} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTest({...newTest, desc: e.target.value})} placeholder="Describe the check..." style={{ minHeight: 60 }} />
              </div>
              <button className="btn" onClick={addTest}>+ Add test</button>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={() => setTab('spec')}>← Back</button>
              <button className="btn btn-primary" onClick={() => setTab('eval')}>Next: evaluation →</button>
            </div>
          </div>
        )}

        {/* EVAL TAB */}
        {tab === 'eval' && (
          <div className="animate-in">
            <div className="card glass">
              <div className="card-title">Evaluation function — weighted score</div>
              {[...SECURITY_TOGGLES, ...QUALITY_TOGGLES, ...LEGAL_TOGGLES].map((t: ToggleDef) => {
                const isSec = SECURITY_TOGGLES.some((s: ToggleDef) => s.key === t.key)
                const isQual = QUALITY_TOGGLES.some((q: ToggleDef) => q.key === t.key)
                const group = isSec ? spec.security : isQual ? spec.quality : spec.legal
                const on = !!group[t.key]
                return (
                  <div key={t.key} className="score-row">
                    <span>{t.label}</span>
                    <div className="flex items-center gap-1">
                      <div className="score-bar">
                        <div className="score-fill" style={{ width: on ? '100%' : '0%', background: on ? 'var(--green)' : 'var(--red)' }} />
                      </div>
                      <span className="text-mono text-sm text-muted" style={{ width: 28, textAlign: 'right' }}>{t.weight}pt</span>
                      <span className={`badge ${on ? 'badge-green' : 'badge-red'}`}>{on ? 'pass' : 'fail'}</span>
                    </div>
                  </div>
                )
              })}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Overall readiness</span>
                <span style={{ fontSize: 28, fontWeight: 700, color: pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)' }}>
                  {pct}%
                </span>
              </div>
              {pct < 80 && (
                <p className="text-sm text-muted mt-1">
                  {pct < 50 ? '⚠ Critical gaps — go back and enable more requirements before shipping.' : '⚠ Some requirements missing — review before using in production.'}
                </p>
              )}
            </div>

            <div className="btn-row">
              <button className="btn" onClick={() => setTab('tests')}>← Back</button>
              <button className="btn btn-primary" onClick={generate}>Generate context →</button>
            </div>
          </div>
        )}

        {/* CONTEXT TAB */}
        {tab === 'context' && (
          <div className="animate-in">
            {!ctx && (
              <div className="card">
                <p className="text-sm text-muted">Go to the Eval tab and click "Generate context" to produce your system prompt.</p>
                <button className="btn mt-2" onClick={() => setTab('eval')}>← Go to Eval</button>
              </div>
            )}
            {ctx && (
              <>
                <div className="card glass">
                  <div className="card-title">Generated — ready to use</div>
                  <pre className="code-block" style={{ maxHeight: 480 }}>{ctx}</pre>
                </div>
                <div className="btn-row">
                  <button className="btn btn-primary" onClick={copy}>{copied ? '✓ Copied!' : 'Copy to clipboard'}</button>
                  <button className="btn" onClick={() => downloadFile(ctx, 'AI_CONTEXT.md')}>Download .md</button>
                  <button className="btn" onClick={() => downloadFile(ctx, '.cursorrules')}>Export .cursorrules</button>
                  <button className="btn" onClick={() => downloadFile(ctx, 'AGENTS.md')}>Export .windsurfrules</button>
                </div>
                <div className="card mt-2 glass">
                  <div className="card-title">How to use this</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.8 }}>
                    <p><strong style={{ color: 'var(--text)' }}>Cursor / Windsurf:</strong> Paste into <code>.cursorrules</code> or <code>AGENTS.md</code> in your project root.</p>
                    <p className="mt-1"><strong style={{ color: 'var(--text)' }}>Claude Projects:</strong> Paste into Project Instructions — all chats inherit it.</p>
                    <p className="mt-1"><strong style={{ color: 'var(--text)' }}>Any AI tool:</strong> Save as <code>AI_CONTEXT.md</code> at repo root, paste as first message.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
          </div>

          {/* SIDE PREVIEW */}
          <div className="preview-pane">
            <div className="card-title">Live Context Preview</div>
            <p className="text-sm text-muted mb-2">This is exactly what your AI agent will see.</p>
            <pre className="code-block" style={{ height: 'calc(100% - 80px)', fontSize: 11 }}>
              {generateContextText(spec, !mounted)}
            </pre>
          </div>
        </div>
      </div>
    </main>
  )
}
