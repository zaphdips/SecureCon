import Link from 'next/link'

export default function DocsPage() {
  return (
    <main className="page animate-in">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="page-header" style={{ marginBottom: '3rem' }}>
          <h1>SecureCon — Friendly Guide</h1>
          <p>Learn how to use SecureCon to guide your AI assistant to build exactly what you want.</p>
        </div>

        <div className="card glass">
          <div className="card-title" style={{ color: 'var(--primary-green)' }}>1. Beginner Friendly Terms</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: 14, lineHeight: 1.75 }}>
            <div>
              <strong style={{ color: 'var(--text-dark)', fontSize: 16 }}>Website Rules (Project Spec)</strong>
              <p style={{ marginTop: 4 }}>A simple checklist of instructions, features, and safety measures that your AI assistant must follow while building your website.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-dark)', fontSize: 16 }}>Checklist Questions (Test Functions)</strong>
              <p style={{ marginTop: 4 }}>Clear questions that you want the AI to answer "Yes" to (e.g., "Is the code safe?") before giving you the final results.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-dark)', fontSize: 16 }}>AI Instructions File (Context Output)</strong>
              <p style={{ marginTop: 4 }}>A readable download file containing all your custom requirements. You can easily share this with ChatGPT or Claude.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ color: 'var(--primary-green)' }}>2. How to Use the Site</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: 14, lineHeight: 1.75 }}>
            <div>
              <strong style={{ color: 'var(--text-dark)' }}>🏠 Home</strong>
              <p style={{ marginTop: 4 }}>A helpful intro to all our built-in safety rules.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-dark)' }}>⚙️ Builder</strong>
              <p style={{ marginTop: 4 }}>Our easy checklist maker. Pick a template, turn rules on or off with simple toggle switches, and check your readiness score instantly.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-dark)' }}>🔍 Review</strong>
              <p style={{ marginTop: 4 }}>Paste any code given to you by an AI assistant to verify it's safe. It's like having a friendly, trusted expert checking your work.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-dark)' }}>📥 Export</strong>
              <p style={{ marginTop: 4 }}>Download your finalized rules file so you can drop it directly into tools like ChatGPT, Cursor, Windsurf, or Claude Projects.</p>
            </div>
          </div>
        </div>

        <div className="card glass">
          <div className="card-title" style={{ color: 'var(--primary-green)' }}>3. Tips for Asking AIs for the Best Result</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: 14, lineHeight: 1.75 }}>
            <div>
              <strong style={{ color: 'var(--text-dark)' }}>Rule #1: Be Specific & Direct</strong>
              <p style={{ marginTop: 4 }}>Always start your conversation by sharing your rules file. Tell the AI to follow your exact checklist without cutting corners.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-dark)' }}>Rule #2: Do Not Accept Unfinished Work</strong>
              <p style={{ marginTop: 4 }}>Sometimes AI assistants leave code unfinished. Tell the AI: "Write the complete code without skipping lines or using 'TODO' comments."</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-dark)' }}>Rule #3: Command Clear Simple Words</strong>
              <p style={{ marginTop: 4 }}>Ask the AI to use easy-to-read words for the website so you can understand and change it later if you need to.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-dark)' }}>Rule #4: Ask for a Preview</strong>
              <p style={{ marginTop: 4 }}>Ask the AI to explain what its code does in plain English <i>before</i> it writes any technical lines of code.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-dark)' }}>Rule #5: No Hidden Links</strong>
              <p style={{ marginTop: 4 }}>Tell the AI to make sure all website links go to real, existing pages on your site.</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderColor: 'var(--amber)', background: 'var(--amber-bg)' }}>
          <div className="card-title" style={{ color: 'var(--amber)' }}>⚠️ AI Subscription & Token Warning</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-dark)' }}>
            <strong>Important Alert for Beginners:</strong> Adding extra AI instructions or using very large files consumes more AI tokens. This will <strong>drain your monthly AI subscription (e.g., Cursor or Claude Pro) much faster</strong>. To save your usage, only activate what you need for each task!
          </p>
        </div>

        <div className="card glass">
          <div className="card-title" style={{ color: 'var(--primary-green)' }}>4. Advanced Developer Skills (Beginner Friendly)</div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            We've curated specialized, high-impact skills created by developers to supercharge your AI's capabilities.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <strong style={{ color: 'var(--text-dark)', fontSize: 15 }}>🎨 1. UI UX Pro Max Skill</strong>
              <p style={{ fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>
                An amazing AI skill containing over 161 industry-specific reasoning rules. It forces your AI assistant to act like a world-class designer.
              </p>
              <div style={{ marginTop: 10, background: 'var(--bg-code)', padding: '12px', borderRadius: 8, border: '1px solid var(--border)' }}>
                <strong style={{ fontSize: 12, color: 'var(--text-dark)' }}>How to Install & Use:</strong>
                <ol style={{ fontSize: 12, lineHeight: 1.6, margin: '8px 0 0 16px' }}>
                  <li>Open your terminal/command prompt.</li>
                  <li>Type <code>npm install -g uipro-cli</code> and press Enter.</li>
                  <li>Go to your project folder and type <code>uipro init --ai cursor</code> (or substitute <code>cursor</code> with your assistant: e.g., <code>claude</code>, <code>windsurf</code>, or <code>all</code>).</li>
                  <li>Your assistant is now permanently boosted! Try asking it to "Build a landing page".</li>
                </ol>
              </div>
            </div>

            <div>
              <strong style={{ color: 'var(--text-dark)', fontSize: 15 }}>✍️ 2. Humanizer Skill</strong>
              <p style={{ fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>
                Removes technical jargon and ensures the AI communicates clearly, concisely, and acts like a patient human tutor.
              </p>
              <div style={{ marginTop: 10, background: 'var(--bg-code)', padding: '12px', borderRadius: 8, border: '1px solid var(--border)' }}>
                <strong style={{ fontSize: 12, color: 'var(--text-dark)' }}>How to Use:</strong>
                <p style={{ fontSize: 12, marginTop: 4 }}>
                  Include the <code>humanizer</code> rules directly in your custom rules or your AI context prompt. You can download or extract the files from the <code>humanizer-main.zip</code> archive in your repository and copy the guidelines into your prompt.
                </p>
              </div>
            </div>

            <div>
              <strong style={{ color: 'var(--text-dark)', fontSize: 15 }}>🔒 3. AI Security & Trust Guardrail</strong>
              <p style={{ fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>
                Ensures the AI writes safe code, avoids leaving sensitive password fields or keys exposed, and validates inputs.
              </p>
              <div style={{ marginTop: 10, background: 'var(--bg-code)', padding: '12px', borderRadius: 8, border: '1px solid var(--border)' }}>
                <strong style={{ fontSize: 12, color: 'var(--text-dark)' }}>How to Use:</strong>
                <p style={{ fontSize: 12, marginTop: 4, lineHeight: 1.6 }}>
                  Paste this clear prompt directly to the AI: <br />
                  <i>"Double check that all code is fully secure, protects user data, sanitizes inputs, uses environment variables instead of hardcoded secrets, and validates every form before saving."</i>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-row" style={{ marginTop: '3rem', justifyContent: 'center' }}>
          <Link href="/builder" className="btn btn-primary">Start Building Now →</Link>
        </div>
      </div>
    </main>
  )
}
