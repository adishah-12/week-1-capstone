import { createContext, useContext, useState, type ReactNode } from 'react'

interface PageLoadingContextValue {
  isPageLoading: boolean
  setIsPageLoading: (value: boolean) => void
}

const PageLoadingContext = createContext<PageLoadingContextValue | undefined>(undefined)

export function PageLoadingProvider({ children }: { children: ReactNode }) {
  const [isPageLoading, setIsPageLoading] = useState(false)
  return (
    <PageLoadingContext.Provider value={{ isPageLoading, setIsPageLoading }}>
      {children}
    </PageLoadingContext.Provider>
  )
}

export function usePageLoading() {
  const context = useContext(PageLoadingContext)
  if (!context) {
    throw new Error('usePageLoading must be used within a PageLoadingProvider')
  }
  return context
}