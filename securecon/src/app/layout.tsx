import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export const metadata: Metadata = {
  title: 'SecureCon — AI Project Context Builder',
  description: 'Build universal security and quality specs for AI-assisted development.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              if (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches) theme = 'dark';
              if (!theme) theme = 'light';
              document.documentElement.setAttribute('data-theme', theme);
            } catch (e) {}
          })();
        ` }} />
      </head>
      <body>
        <Nav />
        {children}
        <footer className="footer">
          <div className="container">
            <p>SecureCon — AI Project Context Builder</p>
            <p style={{ marginTop: '0.5rem', opacity: 0.5, fontSize: 11 }}>Built for the future of agentic coding</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

function Nav() {
  return (
    <nav>
      <div className="container nav-inner">
        <Link href="/" className="nav-brand">
          <span className="dot" />
          SecureCon
        </Link>
        <div className="nav-links">
          <Link href="/builder">Builder</Link>
          <Link href="/review">Review</Link>
          <Link href="/export">Export</Link>
          <Link href="/docs">Docs</Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
