import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './pages/styles/tokens.css'
import './pages/styles/buttons.css'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { PageLoadingProvider } from './context/PageLoadingContext.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PageLoadingProvider>
          <App />
        </PageLoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)