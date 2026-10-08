import { useContext } from 'react'
import { LangContext, type LangState } from './langContext.ts'

export function useLang(): LangState {
  const state = useContext(LangContext)
  if (!state) throw new Error('useLang must be used inside <LangProvider>')
  return state
}
