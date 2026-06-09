import "./hero.css"
import logoHereo from "./logoFM.svg"
import heroAcceso from "./heroAcceso.png"
const Heroe = () => {
  return (
    <div className="hero bgRed">
      <div className="logoHereo">
        <img src={logoHereo} alt="" />
      </div>
      <div className="heroAcceso">
        <img src={heroAcceso} alt="" />
      </div>
    </div>
  )
}

export default Heroe