import spoonfulLrg from '../../assets/spoonful-lrg.svg'
import './LoadingScreen.css'

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-screen__spinner" role="status" aria-label="Loading" />
      <img src={spoonfulLrg} alt="Spoonful" className="loading-screen__img" />
    </div>
  )
}

export default LoadingScreen