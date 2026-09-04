import { Link } from 'react-router-dom'
import spoonfulSm from '../../assets/spoonful-sm.svg'
import './Logo.css'

function Logo() {
  return (
    <Link to="/" className="logo">
      <img src={spoonfulSm} alt="Spoonful" className="logo__img" />
    </Link>
  )
}

export default Logo