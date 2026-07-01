import "../../styles/premiumBenefits.css";

export default function PremiumBenefits() {
  return (
    <div className="premium-container">
      <h2>✨ Beneficios del Plan PRO</h2>

      <div className="premium-cards">
        <div className="premium-card">
          <h3> Reportes avanzados</h3>
          <p>Visualiza gráficos detallados de tus ingresos y gastos.</p>
        </div>

        <div className="premium-card">
          <h3> Exportar datos</h3>
          <p>Descarga tus reportes en PDF o Excel.</p>
        </div>

        <div className="premium-card">
          <h3> Control financiero</h3>
          <p>Establece metas y presupuestos personalizados.</p>
        </div>

        <div className="premium-card">
          <h3>⚡ Acceso prioritario</h3>
          <p>Mejor rendimiento y funcionalidades exclusivas.</p>
        </div>
      </div>
    </div>
  );
}