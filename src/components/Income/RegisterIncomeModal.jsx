function RegisterIncomeModal({
  show,
  onClose,
  onSubmit,
  incomeForm,
  setIncomeForm,
  categories,
}) {

  if (!show) return null;

  return (
    <div className="modal-overlay">

      <div className="modal-panel">

        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        <h2>Registrar Ingreso</h2>

        <form onSubmit={onSubmit}>

          <input
            placeholder="Título"
            value={incomeForm.title}
            onChange={(e)=>
              setIncomeForm({
                ...incomeForm,
                title:e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Monto"
            value={incomeForm.amount}
            onChange={(e)=>
              setIncomeForm({
                ...incomeForm,
                amount:e.target.value
              })
            }
          />

          <select
            value={incomeForm.category}
            onChange={(e)=>
              setIncomeForm({
                ...incomeForm,
                category:e.target.value
              })
            }
          >

            <option value="">
              Seleccione categoría
            </option>

            {categories.map((cat,index)=>(
              <option
                key={index}
                value={cat}
              >
                {cat}
              </option>
            ))}

          </select>

          <input
            type="date"
            value={incomeForm.income_date}
            onChange={(e)=>
              setIncomeForm({
                ...incomeForm,
                income_date:e.target.value
              })
            }
          />

          <textarea
            placeholder="Descripción"
            value={incomeForm.description}
            onChange={(e)=>
              setIncomeForm({
                ...incomeForm,
                description:e.target.value
              })
            }
          />

          <button type="submit">
            Guardar
          </button>

        </form>

      </div>

    </div>
  );

}

export default RegisterIncomeModal;