function CategoryCards({
  categories,
  getCategoryTotal,
}) {
  return (
    <div className="dashboard-cards">

      {categories.map((cat, index) => (

        <div
          className="dashboard-card"
          key={index}
        >
          <h3>{cat}</h3>

          <div className="card-value">
            ${getCategoryTotal(cat).toFixed(2)}
          </div>

        </div>

      ))}

    </div>
  );
}

export default CategoryCards;