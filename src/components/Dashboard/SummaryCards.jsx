function SummaryCards({
  totalIncomes,
  totalExpenses,
  balance,
}) {
  return (
    <div className="dashboard-welcome">
      <h2>Bienvenido</h2>

      <div className="dashboard-summary">
        <div className="dashboard-card">
          <h3>Ingresos</h3>
          <div className="card-value">
            ${totalIncomes.toFixed(2)}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Gastos</h3>
          <div className="card-value">
            ${totalExpenses.toFixed(2)}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Balance</h3>
          <div className="card-value">
            ${balance.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;