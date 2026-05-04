import Link from 'next/link'

export default function Home() {
  return (
    <main className="animate-in">
      <div className="container">
        <section className="hero">
          <h1>Build with AI.<br /><span>Even with zero coding skills.</span></h1>
          <p>
            SecureCon helps you explain exactly what you want to your AI assistant — so it writes perfect, safe, and fully working code without confusion.
          </p>
          <div className="btn-row justify-center">
            <Link href="/builder" className="btn btn-primary">Start Building Now →</Link>
            <Link href="/review" className="btn hover-lift">Review AI Generated Code</Link>
          </div>
        </section>

        <div className="divider">
          <div className="divider-line"></div>
          <div className="divider-text">How It Works</div>
          <div className="divider-line"></div>
        </div>

        <div className="feature-grid">
          <div className="feature-cell">
            <span className="feature-icon">⬡</span>
            <h3>1. Select Your Goal</h3>
            <p>Tell the assistant what you are building. Toggle exactly what rules apply to your new website in a clean dashboard.</p>
          </div>
          <div className="feature-cell">
            <span className="feature-icon">◈</span>
            <h3>2. Set Rules for AI</h3>
            <p>Define clear instructions and features your AI assistant must include or test before handing over the finished code to you.</p>
          </div>
          <div className="feature-cell">
            <span className="feature-icon">◉</span>
            <h3>3. Review Progress</h3>
            <p>Live readiness score helps you track if your rules are complete, so you can build with full confidence.</p>
          </div>
          <div className="feature-cell">
            <span className="feature-icon">◎</span>
            <h3>4. AI Code Review</h3>
            <p>Paste any AI-generated code to let the review assistant confirm everything is safe. Get clear, easy-to-read results instantly.</p>
          </div>
          <div className="feature-cell">
            <span className="feature-icon">⊡</span>
            <h3>5. Simple Downloads</h3>
            <p>Download your rules file to share with any AI assistant like ChatGPT, Claude, Cursor, or Windsurf.</p>
          </div>
          <div className="feature-cell">
            <span className="feature-icon">⊕</span>
            <h3>6. Privacy First</h3>
            <p>Your data stays right on your device. No personal project info or keys are saved on our servers.</p>
          </div>
        </div>

        <section style={{ padding: '4rem 0', textAlign: 'center' }}>
          <div className="section-label justify-center" style={{ marginBottom: '2rem' }}>Safety rules included out-of-the-box</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>
            {[
              'Protects Your Keys','No Fake Links','Safe Inputs',
              'Easy-to-Read Code','No Hidden Bugs','Works Everywhere',
              'Privacy Friendly','Fast Loading','Clear Policies',
              'Terms of Use','Data Compliance','Brand Protection'
            ].map(t => (
              <span key={t} className="badge badge-blue">{t}</span>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
