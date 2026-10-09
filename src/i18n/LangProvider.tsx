import { useEffect, useState, type ReactNode } from 'react'
import type { Lang } from '../data/types.ts'
import { resolveLang } from '../lib/lang.ts'
import { readStored, writeStored } from '../lib/storage.ts'
import { en } from './en.ts'
import { id } from './id.ts'
import { LangContext } from './useLang.ts'

const STORAGE_KEY = 'lang'

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    resolveLang(readStored(STORAGE_KEY), typeof navigator === 'undefined' ? undefined : navigator.languages),
  )

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (next: Lang) => {
    setLangState(next)
    writeStored(STORAGE_KEY, next)
  }

  return <LangContext value={{ lang, t: lang === 'id' ? id : en, setLang }}>{children}</LangContext>
}
