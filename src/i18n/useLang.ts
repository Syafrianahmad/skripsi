import { createContext, useContext } from 'react'
import type { Lang } from '../data/types.ts'
import type { Dict } from './id.ts'

export type LangState = { lang: Lang; t: Dict; setLang: (lang: Lang) => void }

// Lives in a .ts file (not next to LangProvider.tsx) so react-refresh keeps working.
export const LangContext = createContext<LangState | null>(null)

export function useLang(): LangState {
  const state = useContext(LangContext)
  if (!state) throw new Error('useLang must be used inside <LangProvider>')
  return state
}
