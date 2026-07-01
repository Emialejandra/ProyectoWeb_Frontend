
import "../../styles/premiumBenefits.css";

export default function PremiumBenefits() {
  return (
    <div className="premium-benefits">
      <div className="premium-header">
        <h2> ¡Plan PRO Activo!</h2>
        <p>
          Gracias por adquirir el Plan PRO. Ya tienes acceso a todas las
          funcionalidades premium de tu gestor financiero.
        </p>
      </div>

      <div className="premium-cards">
        <div className="premium-card">
          <h3> Reportes avanzados</h3>
          <p>
            Consulta estadísticas más completas sobre tus ingresos, gastos,
            balances y hábitos financieros.
          </p>
        </div>

        <div className="premium-card">
          <h3> Análisis Inteligente</h3>
          <p>
            Recibe recomendaciones financieras basadas en el comportamiento de
            tus gastos e ingresos.
          </p>
        </div>

        <div className="premium-card">
          <h3> Metas y presupuestos</h3>
          <p>
            Organiza objetivos de ahorro y controla tus límites de gasto para
            mejorar tu planificación financiera.
          </p>
        </div>

        <div className="premium-card">
          <h3> Exportación de información</h3>
          <p>
            Descarga tus reportes y movimientos en formatos PDF o Excel cuando
            esta funcionalidad esté disponible.
          </p>
        </div>

        <div className="premium-card">
          <h3> Acceso prioritario</h3>
          <p>
            Disfruta de las nuevas funciones premium antes que los usuarios del
            plan gratuito.
          </p>
        </div>

        <div className="premium-card">
          <h3> Cuenta Premium</h3>
          <p>
            Tu suscripción se encuentra activa. Ya no es necesario volver a
            comprar el Plan PRO mientras permanezca vigente.
          </p>
        </div>
      </div>
    </div>
  );
}
