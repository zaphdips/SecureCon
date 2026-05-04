'use client'

export function ReactIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>React Logo</title>
      <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
      <g stroke="#61dafb" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </g>
    </svg>
  )
}

export function NextjsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M64 0C28.656 0 0 28.656 0 64C0 99.344 28.656 128 64 128C99.344 128 128 99.344 128 64C128 28.656 99.344 0 64 0ZM64 118C34.176 118 10 93.824 10 64C10 34.176 34.176 10 64 10C93.824 10 118 34.176 118 64C118 93.824 93.824 118 64 118ZM100.8 92.8L61.6 40.8H50.4V87.2H58.4V50.4L90.4 92.8H100.8ZM82.4 40.8V80L74.4 72V40.8H82.4Z" fill="currentColor"/>
    </svg>
  )
}

export function NodejsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 288" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M228.6 57.3L140.7 6.6C132.8 2.2 123.2 2.2 115.3 6.6L27.4 57.3C19.5 61.8 14.7 70.3 14.7 79.4V180.7C14.7 189.8 19.5 198.3 27.4 202.8L115.3 253.5C123.2 257.9 132.8 257.9 140.7 253.5L228.6 202.8C236.5 198.3 241.3 189.8 241.3 180.7V79.4C241.3 70.3 236.5 61.8 228.6 57.3ZM128 227.1L128 32.9L196.4 72.3L196.4 187.6L128 227.1Z" fill="#339933"/>
    </svg>
  )
}

export function SecurityIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 5V11C4 16.19 7.41 21.05 12 22C16.59 21.05 20 16.19 20 11V5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="9" r="1" fill="currentColor"/>
    </svg>
  )
}
