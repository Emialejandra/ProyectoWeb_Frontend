import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>

      <h1>Dashboard</h1>

      <h2>Bienvenido</h2>

      <div>
        <p>Ingresos: $0</p>
        <p>Gastos: $0</p>
        <p>Balance: $0</p>
      </div>

      <Link to="/profile">
        Completar Perfil
      </Link>

    </div>
  );
}

export default Dashboard;