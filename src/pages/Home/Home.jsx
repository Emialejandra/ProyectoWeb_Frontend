import dash from "../../assets/dash.webp";
import LoginForm from "../../components/LoginForm/LoginForm";
import "../../styles/home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-left">
        <h1>Bienvenido</h1>

        <h2>Sistema de Control de Gastos</h2>

        <p>
          Organiza tus finanzas personales, controla tus gastos y alcanza tus
          metas de ahorro.
        </p>

        <img
          src={dash}
          alt="Sistema de control de gastos"
          className="home-image"
        />
      </div>

      <div className="home-right">
        <LoginForm />
      </div>
    </div>
  );
}

export default Home;