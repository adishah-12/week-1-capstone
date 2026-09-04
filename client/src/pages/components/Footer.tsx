import './Footer.css'

function Footer() {
  const version = import.meta.env.VITE_APP_VERSION ?? 'dev'

  return (
    <footer className="footer">
      <span>v{version}</span>
    </footer>
  )
}

export default Footer