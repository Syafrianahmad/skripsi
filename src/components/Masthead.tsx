import type { ReactNode } from 'react'
import type { Page } from '../lib/route.ts'
import { Header } from './Header.tsx'

/** Dark blue band shared by both pages: kawung motif, header, then the page's own hero. */
export function Masthead({ page, children }: { page: Page; children: ReactNode }) {
  return (
    <div className="masthead">
      <div className="kawung" aria-hidden="true" />
      <Header page={page} />
      {children}
    </div>
  )
}
