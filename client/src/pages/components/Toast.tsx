import { useEffect } from 'react'
import './Toast.css'

interface ToastProps {
  message: string
  onDismiss: () => void
  duration?: number
}

function Toast({ message, onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [onDismiss, duration])

  return (
    <div className="toast" role="status">
      {message}
    </div>
  )
}

export default Toast