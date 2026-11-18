import type { LayerId } from '../data/resourceData'

type Props = { type: LayerId; size?: number; decorative?: boolean }

export function ResourceIcon({ type, size = 28, decorative = true }: Props) {
  const common = { width: size, height: size, viewBox: '0 0 32 32', fill: 'none', 'aria-hidden': decorative || undefined }

  switch (type) {
    case 'gas':
      return <svg {...common}><path d="M17 3c2 7-5 8-2 14 2-2 4-3 5-6 4 4 6 8 4 13-2 5-9 7-14 4-5-3-5-10-1-14 2-2 4-4 5-8 2 2 2 5 3 7Z" fill="currentColor"/><path d="M17 28c-4-1-5-5-3-8 1 2 2 3 4 4 1-2 2-4 1-6 4 3 4 9-2 10Z" fill="#fff4d8" opacity=".8"/></svg>
    case 'jade':
      return <svg {...common}><path d="m16 3 10 7-4 15-13 3-5-13L9 5l7-2Z" fill="currentColor"/><path d="m9 6 6 8-6 13m7-24-1 11 7 11m-7-11 11-4M4 15l11-1" stroke="#fff4d8" strokeWidth="1.4" opacity=".7"/></svg>
    case 'rareEarths':
      return <svg {...common}><path d="M16 2 20 11l10 5-10 5-4 9-4-9-10-5 10-5 4-9Z" fill="currentColor"/><circle cx="16" cy="16" r="4" fill="#fff4d8"/><circle cx="16" cy="16" r="1.7" fill="currentColor"/></svg>
    case 'tin':
      return <svg {...common}><path d="m7 7 9-4 9 5 2 11-8 10-11-4-4-9 3-9Z" fill="currentColor"/><path d="m8 9 8 3 8-2m-8 2 2 16m-2-16L8 24" stroke="#fff4d8" strokeWidth="1.5" opacity=".75"/></svg>
    case 'copper':
      return <svg {...common}><circle cx="16" cy="16" r="12" fill="currentColor"/><path d="M21 10a8 8 0 1 0 0 12M15 8v16M10 16h10" stroke="#fff4d8" strokeWidth="2.1" strokeLinecap="round"/></svg>
    case 'forests':
      return <svg {...common}><path d="m16 2 8 10h-4l7 9h-8v8h-6v-8H5l7-9H8l8-10Z" fill="currentColor"/><path d="M16 8v17" stroke="#fff4d8" strokeWidth="1.5" opacity=".7"/></svg>
    case 'farmland':
      return <svg {...common}><path d="M6 28V14m0 2c4 0 7-2 8-6-5-1-8 1-8 6Zm0 5c-3 0-5-1-6-4 3-1 6 1 6 4Zm12 7V8m0 3c4 0 7-3 8-7-5 0-8 2-8 7Zm0 7c-4 0-7-2-8-6 5-1 8 1 8 6Zm0 5c3 0 6-2 7-5-4-1-7 1-7 5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    case 'rivers':
      return <svg {...common}><path d="M5 7c6-4 8 4 13 1 4-2 5-3 9-1M5 16c6-4 8 4 13 1 4-2 5-3 9-1M5 25c6-4 8 4 13 1 4-2 5-3 9-1" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
  }
}
