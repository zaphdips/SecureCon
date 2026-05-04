import { NextRequest, NextResponse } from 'next/server'
import { ProjectSpec } from '@/lib/types'

export async function POST(req: NextRequest) {
  let body: { code: string; spec: ProjectSpec; apiKey?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { code, spec, apiKey } = body
  if (!code?.trim()) return NextResponse.json({ error: 'No code provided.' }, { status: 400 })

  const finalKey = apiKey || process.env.GEMINI_API_KEY || 'AIzaSyD38snDDInvVd5IUAwpwTc3F3NOIofPQKY'
  if (!finalKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured on server.' }, { status: 401 })
  }

  const testList = spec?.tests?.map((t, i) => `${i+1}. [${t.cat.toUpperCase()}] ${t.name}: ${t.desc}`).join('\n') || 'Use general security best practices.'

  const systemPrompt = `You are a senior security and code quality reviewer. You receive code and a project spec, and return a structured JSON evaluation.

Project: ${spec?.name || 'Unknown'}
Stack: ${spec?.stack || 'Unknown'}

Test functions to check:
${testList}

Security requirements enabled:
${Object.entries(spec?.security || {}).filter(([,v])=>v).map(([k])=>k).join(', ') || 'none'}

Quality requirements enabled:
${Object.entries(spec?.quality || {}).filter(([,v])=>v).map(([k])=>k).join(', ') || 'none'}

Respond ONLY with a JSON object, no preamble, no markdown fences. Structure:
{
  "score": <0-100 integer>,
  "results": [
    { "name": "<test_name>", "status": "pass"|"fail"|"warn", "message": "<short explanation>" }
  ],
  "blockers": ["<list of critical issues that must be fixed before shipping>"],
  "summary": "<2-3 sentence plain English summary for a technical PM>"
}

Here is the code to review:
${code.slice(0, 8000)}`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${finalKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: systemPrompt }]
          }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    )

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API failed')
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()

    let result
    try {
      result = JSON.parse(clean)
    } catch {
      return NextResponse.json({ error: 'AI returned malformed JSON. Try again.', raw: text }, { status: 502 })
    }

    return NextResponse.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Gemini API error: ${message}` }, { status: 500 })
  }
}
