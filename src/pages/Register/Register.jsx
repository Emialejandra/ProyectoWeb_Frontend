import RegisterForm from "../../components/RegisterForm/RegisterForm";
import "../../styles/register.css";

function Register() {
    return (
        <div className="register-container">

            <div className="register-left">

                <span className="register-tag">
                    Sistema de Control de Gastos
                </span>

                <h1>Crear Cuenta</h1>

                <p>
                    Comienza a gestionar tus ingresos, gastos y metas de ahorro
                    desde una sola plataforma.
                </p>


                <ul className="register-benefits">
                    <li>✓ Control de gastos diarios</li>
                    <li>✓ Seguimiento de ingresos</li>
                    <li>✓ Estadísticas financieras</li>
                    <li>✓ Metas de ahorro personalizadas</li>
                </ul>
            </div>

            <div className="register-right">
                <RegisterForm />
            </div>

        </div >
    );
}

export default Register;