import { useEffect, useMemo, useState } from "react";
import { getHistory } from "../../services/historyService";
import "./TransactionHistory.css";

function TransactionHistory() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getHistory();

      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando historial:", error);

      if (error.message === "UNAUTHORIZED") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        return;
      }

      setError(
        error.message || "No se pudo cargar el historial."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = useMemo(() => {
    if (filter === "all") {
      return history;
    }

    return history.filter((transaction) => {
      const type = String(
        transaction?.type ||
          transaction?.transaction_type ||
          transaction?.movement_type ||
          ""
      ).toLowerCase();

      if (filter === "income") {
        return (
          type === "income" ||
          type === "ingreso"
        );
      }

      if (filter === "expense") {
        return (
          type === "expense" ||
          type === "gasto"
        );
      }

      return true;
    });
  }, [history, filter]);

  const getTransactionType = (transaction) => {
    const type = String(
      transaction?.type ||
        transaction?.transaction_type ||
        transaction?.movement_type ||
        ""
    ).toLowerCase();

    if (type === "income" || type === "ingreso") {
      return "income";
    }

    if (type === "expense" || type === "gasto") {
      return "expense";
    }

    return "unknown";
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("es-EC", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!date) {
      return "Sin fecha";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("es-EC", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <section className="history-section">
        <p>Cargando historial...</p>
      </section>
    );
  }

  return (
    <section className="history-section">
      <div className="history-header">
        <div>
          <h2>Historial de movimientos</h2>
          <p>
            Consulta todos tus ingresos y gastos registrados.
          </p>
        </div>

        <div className="history-filters">
          <button
            type="button"
            className={
              filter === "all" ? "active" : ""
            }
            onClick={() => setFilter("all")}
          >
            Todos
          </button>

          <button
            type="button"
            className={
              filter === "income" ? "active" : ""
            }
            onClick={() => setFilter("income")}
          >
            Ingresos
          </button>

          <button
            type="button"
            className={
              filter === "expense" ? "active" : ""
            }
            onClick={() => setFilter("expense")}
          >
            Gastos
          </button>
        </div>
      </div>

      {error && (
        <div className="history-error">
          <p>{error}</p>

          <button type="button" onClick={loadHistory}>
            Intentar nuevamente
          </button>
        </div>
      )}

      {!error && filteredHistory.length === 0 && (
        <div className="history-empty">
          No existen movimientos para mostrar.
        </div>
      )}

      {!error && filteredHistory.length > 0 && (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Título</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Monto</th>
              </tr>
            </thead>

            <tbody>
              {filteredHistory.map(
                (transaction, index) => {
                  const type =
                    getTransactionType(transaction);

                  const date =
                    transaction?.date ||
                    transaction?.income_date ||
                    transaction?.expense_date ||
                    transaction?.created_at;

                  return (
                    <tr
                      key={
                        transaction?.id ||
                        `${type}-${index}`
                      }
                    >
                      <td>{formatDate(date)}</td>

                      <td>
                        <span
                          className={`history-type ${type}`}
                        >
                          {type === "income"
                            ? "Ingreso"
                            : type === "expense"
                              ? "Gasto"
                              : "Movimiento"}
                        </span>
                      </td>

                      <td>
                        {transaction?.title ||
                          transaction?.name ||
                          "Sin título"}
                      </td>

                      <td>
                        {transaction?.category ||
                          "Sin categoría"}
                      </td>

                      <td>
                        {transaction?.description ||
                          "Sin descripción"}
                      </td>

                      <td
                        className={`history-amount ${type}`}
                      >
                        {type === "income"
                          ? "+"
                          : type === "expense"
                            ? "-"
                            : ""}
                        {formatAmount(
                          transaction?.amount
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default TransactionHistory;