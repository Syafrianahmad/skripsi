import { createContext } from 'react'
import type { Lang } from '../data/types.ts'
import type { Dict } from './id.ts'

export type LangState = { lang: Lang; t: Dict; setLang: (lang: Lang) => void }

export const LangContext = createContext<LangState | null>(null)
