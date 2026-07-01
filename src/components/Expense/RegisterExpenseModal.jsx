function RegisterExpenseModal({
  show,
  onClose,
  onSubmit,
  expenseForm,
  setExpenseForm,
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

        <h2>Registrar Gasto</h2>

        <form onSubmit={onSubmit}>

          <input
            placeholder="Título"
            value={expenseForm.title}
            onChange={(e)=>
              setExpenseForm({
                ...expenseForm,
                title:e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Monto"
            value={expenseForm.amount}
            onChange={(e)=>
              setExpenseForm({
                ...expenseForm,
                amount:e.target.value
              })
            }
          />

          <select
            value={expenseForm.category}
            onChange={(e)=>
              setExpenseForm({
                ...expenseForm,
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
            value={expenseForm.expense_date}
            onChange={(e)=>
              setExpenseForm({
                ...expenseForm,
                expense_date:e.target.value
              })
            }
          />

          <textarea
            placeholder="Descripción"
            value={expenseForm.description}
            onChange={(e)=>
              setExpenseForm({
                ...expenseForm,
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

export default RegisterExpenseModal;