// src/pages/components/AppLayout.tsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import LoadingScreen from './LoadingScreen'
import { usePageLoading } from '../../context/PageLoadingContext'

function AppLayout() {
  const { isPageLoading } = usePageLoading()

  return (
    <>
      <div style={{ display: isPageLoading ? 'none' : 'contents' }}>
        <Header />
        <Outlet />
      </div>
      {isPageLoading && <LoadingScreen />}
    </>
  )
}

export default AppLayout