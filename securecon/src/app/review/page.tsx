'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ProjectSpec, EvalResult } from '@/lib/types'

type InputMode = 'paste' | 'upload'

export default function ReviewPage() {
  const [mode, setMode] = useState<InputMode>('paste')
  const [code, setCode] = useState('')
  const [fileName, setFileName] = useState('')
  const [spec, setSpec] = useState<ProjectSpec | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EvalResult | null>(null)
  const [error, setError] = useState('')
  const [apiKey, setApiKey] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedSpec = localStorage.getItem('securecon-project')
    if (savedSpec) { try { setSpec(JSON.parse(savedSpec)) } catch {} }

    const savedKey = localStorage.getItem('securecon-gemini-key')
    if (savedKey) { setApiKey(savedKey) }
  }, [])

  const saveApiKey = (key: string) => {
    setApiKey(key)
    localStorage.setItem('securecon-gemini-key', key)
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = ev => setCode(ev.target?.result as string || '')
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = ev => setCode(ev.target?.result as string || '')
    reader.readAsText(file)
    setMode('upload')
  }

  const review = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, spec: spec || {}, fileName, apiKey })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Review failed')
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setCode(''); setResult(null); setError(''); setFileName('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const statusColor = (s: string) => s === 'pass' ? 'pass' : s === 'warn' ? 'warn' : 'fail'
  const statusBadge = (s: string) => s === 'pass' ? 'badge-green' : s === 'warn' ? 'badge-amber' : 'badge-red'

  return (
    <main className="page">
      <div className="container">
        <div className="page-header animate-in">
          <h1>Code Review</h1>
          <p>Paste code or upload a file. Gemini evaluates it against {spec?.name ? `your "${spec.name}" spec` : 'security best practices'}.</p>
        </div>

        <div className="card animate-in" style={{ animationDelay: '0.05s', background: 'var(--bg-off-white)', border: '1px dashed var(--border-strong)', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
          <div className="card-title" style={{ fontSize: 13, marginBottom: '0.5rem' }}>🔑 (Optional) Enter Your Google Gemini API Key</div>
          <div className="field" style={{ marginBottom: 8 }}>
            <input 
              type="password" 
              value={apiKey} 
              onChange={(e) => saveApiKey(e.target.value)} 
              placeholder="AIzaSy..." 
              style={{ maxWidth: '100%', fontSize: 13, padding: '10px 14px' }}
            />
          </div>
          <p className="text-sm text-muted" style={{ fontSize: 11, lineHeight: 1.4 }}>
            <strong>Privacy Guarantee:</strong> Your key is only saved in your browser's local storage.
            It is passed securely via the API request for evaluation and is <strong>never stored or logged</strong> on the server.
          </p>
        </div>

        {!spec && (
          <div className="card animate-in" style={{ borderColor: 'var(--amber)', background: 'var(--amber-bg)', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
            <p className="text-sm" style={{ color: 'var(--amber)', fontWeight: 500 }}>
              No project spec loaded. Reviews will use general security standards.{' '}
              <Link href="/builder" style={{ color: 'var(--amber)', fontWeight: 700, textDecoration: 'underline' }}>Build your spec →</Link>
            </p>
          </div>
        )}

        <div className="card animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="tab-bar" style={{ width: 'fit-content', marginBottom: '1.5rem', marginLeft: 'auto', marginRight: 'auto' }}>
            {(['paste', 'upload'] as InputMode[]).map(m => (
              <button key={m} onClick={() => setMode(m)} className={`tab ${mode === m ? 'active' : ''}`} style={{ padding: '6px 16px', fontSize: 12 }}>
                {m === 'paste' ? 'Paste code' : 'Upload file'}
              </button>
            ))}
          </div>

          {mode === 'paste' ? (
            <textarea
              value={code}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)}
              placeholder="Paste your code here — function, module, route handler, component..."
              style={{ minHeight: 320, fontFamily: 'var(--font)', fontSize: 13, lineHeight: 1.6 }}
            />
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="hover-lift"
              style={{
                minHeight: 220, border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 12, cursor: 'pointer', background: 'var(--bg-code)', transition: 'var(--transition)',
                padding: '2rem'
              }}
            >
              <input ref={fileRef} type="file" accept=".ts,.tsx,.js,.jsx,.py,.go,.rb,.java,.cs,.php,.rs,.swift,.kt,.vue,.html,.css,.json,.yaml,.yml,.env.example,.sh,.sql,.txt,.md" onChange={handleFile} style={{ display: 'none' }} />
              <div style={{ fontSize: 32, opacity: 0.5 }}>{fileName ? '📄' : '☁️'}</div>
              {fileName ? (
                <div className="text-center">
                  <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{fileName}</div>
                  <div className="text-sm text-muted">{code.length.toLocaleString()} chars loaded — click to change</div>
                </div>
              ) : (
                <div className="text-center">
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Drop a file or click to browse</div>
                  <div className="text-sm text-muted">Supports most programming languages</div>
                </div>
              )}
            </div>
          )}

          <div className="btn-row" style={{ marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={review} disabled={loading || !code.trim()}>
              {loading ? (
                <><div className="spinner" />Reviewing...</>
              ) : 'Run evaluation →'}
            </button>
            {(code || fileName) && <button className="btn" onClick={clear}>Clear</button>}
          </div>
        </div>

        {error && (
          <div className="card animate-in" style={{ borderColor: 'var(--red)', background: 'var(--red-bg)', padding: '1rem 1.5rem' }}>
            <p className="text-sm" style={{ color: 'var(--red)', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        {result && (
          <div className="review-result animate-in">
            <div className="review-header">
              <div className="flex items-center gap-2">
                <span className="badge badge-blue">Evaluation Result</span>
                {result.blockers?.length > 0 && (
                  <span className="badge badge-red">{result.blockers.length} blocker{result.blockers.length > 1 ? 's' : ''}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted text-sm font-bold">SCORE</span>
                <span style={{
                  fontSize: 32, fontWeight: 800,
                  color: result.score >= 80 ? 'var(--green)' : result.score >= 50 ? 'var(--amber)' : 'var(--red)'
                }}>{result.score}<span style={{ fontSize: 16, opacity: 0.5 }}>/100</span></span>
              </div>
            </div>

            <div className="review-body" style={{ padding: '2rem 2.5rem' }}>
              {result.summary && (
                <div className="card" style={{ background: 'var(--bg-code)', marginBottom: '2rem', padding: '1.5rem' }}>
                  <div className="card-title">Project Summary</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7 }}>{result.summary}</p>
                </div>
              )}

              {result.blockers?.length > 0 && (
                <>
                  <div className="section-label">Critical Blockers</div>
                  <div style={{ marginBottom: '2.5rem' }}>
                    {result.blockers.map((b: string, i: number) => (
                      <div key={i} className="test-result fail" style={{ background: 'var(--red-bg)', borderColor: 'var(--red)' }}>
                        <span className="badge badge-red" style={{ flexShrink: 0 }}>FIX</span>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="section-label">Detailed Test results</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.results?.map((r: { name: string; status: 'pass' | 'fail' | 'warn'; message: string }, i: number) => (
                  <div key={i} className={`test-result ${statusColor(r.status)}`}>
                    <span className={`badge ${statusBadge(r.status)}`} style={{ flexShrink: 0, marginTop: 2 }}>{r.status}</span>
                    <div>
                      <div className="text-mono" style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{r.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{r.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
