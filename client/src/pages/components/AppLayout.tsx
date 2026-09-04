import { Outlet } from 'react-router-dom'
import Header from './Header'
import LoadingScreen from './LoadingScreen'
import { usePageLoading } from '../../context/PageLoadingContext'

function AppLayout() {
  const { isPageLoading } = usePageLoading()

  if (isPageLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default AppLayout