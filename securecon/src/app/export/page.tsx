'use client'
import { useState, useEffect, useRef } from 'react'
import { ProjectSpec, generateContextText } from '@/lib/types'

export default function ExportPage() {
  const [spec, setSpec] = useState<ProjectSpec | null>(null)
  const [imported, setImported] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('securecon-project')
    if (saved) { try { setSpec(JSON.parse(saved) as ProjectSpec) } catch {} }
  }, [])

  const exportJSON = () => {
    if (!spec) return
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${spec.name || 'project'}-spec.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const exportContext = () => {
    if (!spec) return
    const text = generateContextText(spec)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${spec.name || 'project'}-AI_CONTEXT.md`; a.click()
    URL.revokeObjectURL(url)
  }

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string)
        setSpec(parsed)
        localStorage.setItem('securecon-project', JSON.stringify(parsed))
        setImported(true)
        setTimeout(() => setImported(false), 3000)
      } catch {
        alert('Invalid JSON file.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1>Export & Import</h1>
          <p>Share your spec with teammates or import one they've built.</p>
        </div>

        {!spec ? (
          <div className="card">
            <p className="text-sm text-muted">No spec found. <a href="/builder" style={{ color: 'var(--text)' }}>Build one first →</a></p>
          </div>
        ) : (
          <>
            <div className="card">
              <div className="card-title">Current spec — {spec.name || 'Unnamed project'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                <div style={{ background: 'var(--bg-code)', borderRadius: 'var(--radius)', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{Object.values(spec.security).filter(Boolean).length}</div>
                  <div className="text-sm text-muted">security rules</div>
                </div>
                <div style={{ background: 'var(--bg-code)', borderRadius: 'var(--radius)', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{spec.tests.length}</div>
                  <div className="text-sm text-muted">test functions</div>
                </div>
                <div style={{ background: 'var(--bg-code)', borderRadius: 'var(--radius)', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{Object.values(spec.legal).filter(Boolean).length}</div>
                  <div className="text-sm text-muted">legal docs</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Export</div>
              <div className="btn-row">
                <button className="btn btn-primary" onClick={exportJSON}>Download spec.json</button>
                <button className="btn" onClick={exportContext}>Download AI_CONTEXT.md</button>
              </div>
              <p className="text-sm text-muted mt-2">
                <strong style={{ color: 'var(--text)' }}>spec.json</strong> — reimport to SecureCon on any machine.<br />
                <strong style={{ color: 'var(--text)' }}>AI_CONTEXT.md</strong> — paste as system prompt in Claude, Cursor, ChatGPT, etc.
              </p>
            </div>
          </>
        )}

        <div className="card">
          <div className="card-title">Import spec</div>
          <p className="text-sm text-muted mb-2">Import a spec.json from a teammate to load their configuration.</p>
          {imported && (
            <div className="card mb-2" style={{ background: 'var(--green-bg)', borderColor: 'var(--green)' }}>
              <p className="text-sm text-green">Spec imported successfully.</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept=".json" onChange={importJSON} style={{ display: 'none' }} />
          <button className="btn" onClick={() => fileRef.current?.click()}>Choose spec.json file</button>
        </div>

        <div className="card">
          <div className="card-title">Use in CI/CD — auto-review PRs</div>
          <pre className="code-block" style={{ fontSize: 11 }}>{`# .github/workflows/code-review.yml
name: SecureCon Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run SecureCon review
        env:
          SECURECON_URL: https://your-app.vercel.app
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          CODE=$(git diff HEAD~1 --unified=0 | head -200)
          SPEC=$(cat AI_CONTEXT.md)
          curl -X POST $SECURECON_URL/api/review \\
            -H "Content-Type: application/json" \\
            -d "{\\"code\\": \\"$CODE\\", \\"spec\\": {}}" \\
            | jq '.blockers | if length > 0 then error else . end'`}</pre>
        </div>
      </div>
    </main>
  )
}
